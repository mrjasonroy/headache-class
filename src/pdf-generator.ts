import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import QuickChart from 'quickchart-js';

// Define paths
const dataDir = path.resolve(__dirname, '../output/data');
const pdfOutputDir = path.resolve(__dirname, '../output/pdfs');
const assetsDir = path.resolve(__dirname, '../assets');

// Ensure output directory exists
if (!fs.existsSync(pdfOutputDir)) {
  fs.mkdirSync(pdfOutputDir, { recursive: true });
}

// Function to read JSON file
const readJSONFile = (filePath: string) => {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

// Function to generate chart URL
const generateChartUrl = (data: number[], labels: string[], annotations: { text: string; x: number }[]) => {
  const chart = new QuickChart();
  chart.setConfig({
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Pain Level',
        data,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      }]
    },
    options: {
      plugins: {
        annotation: {
          annotations: annotations.map(a => ({
            type: 'line',
            mode: 'vertical',
            scaleID: 'x-axis-0',
            value: labels[a.x],
            borderColor: 'rgba(0, 0, 255, 0.5)',
            borderWidth: 2,
            label: {
              content: a.text,
              enabled: true,
              position: 'top'
            }
          }))
        }
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time of Day'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Pain Level'
          },
          ticks: {
            min: 0,
            max: 10
          }
        }]
      }
    }
  });
  chart.setWidth(600).setHeight(150);
  return chart.getUrl();
};

// Function to create a PDF for each day
const createPDF = async (responses: any[]) => {
  for (const response of responses) {
    const pdfDoc = await PDFDocument.create();

    // Process form data here
    const { painLevels, remedies, medications, riskFactors, triggers, notes, date } = response;

    // Add a page to the PDF
    const page = pdfDoc.addPage([600, 800]);

    // Generate chart URL
    const labels = ['Morning', 'Noon', 'Afternoon', 'Evening', 'Night'];
    const chartAnnotations = [
      ...remedies.map((r: any) => ({ text: r.name, x: r.time })),
      ...medications.map((m: any) => ({ text: m.name, x: m.time }))
    ];

    const chartUrl = generateChartUrl(painLevels, labels, chartAnnotations);
    const chartImageBytes = await fetch(chartUrl).then(res => res.arrayBuffer());
    const chartImage = await pdfDoc.embedPng(chartImageBytes);

    // Draw chart
    page.drawImage(chartImage, {
      x: 50,
      y: 500,
      width: 500,
      height: 150,
    });

    // Draw other text fields (risk factors, triggers, notes)
    page.drawText(`Date: ${date}`, { x: 50, y: 750, size: 12 });

    // Draw risk factors
    const riskFactorsYStart = 470;
    const riskFactorTitles = ['Diet', 'Emotion', 'Intensity', 'Body Use', 'Sleep', 'External', 'Other'];
    riskFactorTitles.forEach((title, index) => {
      const yPosition = riskFactorsYStart - index * 30;
      const riskFactorValue = riskFactors[title] || 'N/A';
      page.drawText(`${title}: ${riskFactorValue}`, { x: 50, y: yPosition, size: 12 });
    });

    // Draw triggers and notes
    page.drawText(`Triggers: ${triggers.join(', ')}`, { x: 50, y: 260, size: 12 });
    page.drawText(`Notes: ${notes.join('\n')}`, { x: 50, y: 230, size: 12 });

    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(path.join(pdfOutputDir, `Journal_${date}.pdf`), pdfBytes);
  }
};

async function generatePdfs() {
  const formDefinition = readJSONFile(path.join(dataDir, 'form-definition.json'));
  const formResponses = readJSONFile(path.join(dataDir, 'form-responses.json'));
  console.log('Generating PDFs...');
  const questionMap: { [key: string]: string } = {};
  formDefinition.items.forEach((item: any) => {
    if (item.questionItem) {
      const questionId = item.questionItem.question.questionId;
      const title = item.title;
      questionMap[questionId] = title;
    }
  });

  const daysOfData = formResponses.responses?.reduce((acc: any, curr: any) => {
    const symptomStart = curr.answers['065980fd']?.textAnswers.answers[0].value;
    const date = symptomStart ? symptomStart.split(' ')[0] : new Date(curr.lastSubmittedTime).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(curr);
    console.log('acc', acc[date]);
    return acc;
  }, {});
  console.log(daysOfData + ' days of data found!');

  const dailyResponses = Object.keys(daysOfData).map(date => {
    const responses = daysOfData[date];

    const painLevels = responses.map((r: any) => r.answers['645e49c5'] ? parseInt(r.answers['645e49c5'].textAnswers.answers[0].value) : 0);
    const remedies = responses
      .flatMap((r: any) => r.answers['6b3c1ac6'] ? [{ name: r.answers['6b3c1ac6'].textAnswers.answers[0].value, time: new Date(r.createTime).getHours() }] : []);
    const medications = responses
      .flatMap((r: any) => r.answers['7dafa2ba'] ? [{ name: r.answers['7dafa2ba'].textAnswers.answers[0].value, time: new Date(r.createTime).getHours() }] : []);
    
    const riskFactors: { [key: string]: string } = {};
    ['20018bcf', '1f14e108', '1f166a67', '57e852e0', '2094789c', '3c9831e5', '2cecca34'].forEach(key => {
      const factorTitle = questionMap[key];
      riskFactors[factorTitle] = responses.map((r: any) => r.answers[key]?.textAnswers.answers[0].value || 'N/A')[0];
    });

    const triggers = [
      ...new Set(
        responses.flatMap((r: any) => r.answers['721d6b55'] ? r.answers['721d6b55'].textAnswers.answers.map((a: any) => a.value) : [])
      ),
    ];
    const notes = responses
      .flatMap((r: any) => r.answers['2af75715'] ? r.answers['2af75715'].textAnswers.answers[0].value : [])
      .filter(n => n);

    return { date, painLevels, remedies, medications, riskFactors, triggers, notes };
  });
  console.log((dailyResponses as any[]).length + ' PDFs generated!')

  await createPDF(dailyResponses);
}

export { generatePdfs };
