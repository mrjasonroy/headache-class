import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define paths
const dataDir = path.resolve(__dirname, '../output/data');
const pdfOutputDir = path.resolve(__dirname, '../output/pdfs');

// Ensure output directory exists
if (!fs.existsSync(pdfOutputDir)) {
  fs.mkdirSync(pdfOutputDir, { recursive: true });
}

// Function to read JSON file
const readJSONFile = (filePath) => {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

// Function to generate chart image
const generateChartImage = async (data, labels) => {
  const chartData = data.map(d => d.level);
  const annotations = data.flatMap((d, i) => [
    ...d.remedies.map(r => ({
      type: 'box',
      xMin: labels[d.time],
      xMax: labels[d.time],
      yMin: d.level - 0.5,
      yMax: d.level + 0.5,
      backgroundColor: 'rgba(255, 159, 64, 0.25)',
      borderColor: 'rgb(255, 159, 64)',
      borderWidth: 2,
      label: {
        content: r,
        position: 'center',
        enabled: true
      }
    })),
    ...d.medications.map(m => ({
      type: 'box',
      xMin: labels[d.time],
      xMax: labels[d.time],
      yMin: d.level - 0.5,
      yMax: d.level + 0.5,
      backgroundColor: 'rgba(54, 162, 235, 0.25)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 2,
      label: {
        content: m,
        position: 'center',
        enabled: true
      }
    }))
  ]);

  const width = 600;
  const height = 300;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

  const configuration = {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Pain Level',
        data: chartData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      }]
    },
    options: {
      plugins: {
        annotation: {
          annotations
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time of Day'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Pain Level'
          },
          min: 0,
          max: 10
        }
      }
    }
  };

  const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);
  return imageBuffer;
};

// Function to create a PDF for each day
const createPDF = async (dayData) => {
  const pdfDoc = await PDFDocument.create();
  const { date, pain, factors } = dayData;

  // Add a page to the PDF
  const page = pdfDoc.addPage([600, 800]);

  // Generate chart image
  const labels = ['Morning', 'Noon', 'Afternoon', 'Evening', 'Night'];
  const chartImage = await generateChartImage(pain, labels);

  // Embed chart image in PDF
  const chartImagePdf = await pdfDoc.embedPng(chartImage);

  // Draw chart
  page.drawImage(chartImagePdf, {
    x: 50,
    y: 400, // Adjusted y-position to accommodate increased height
    width: 500,
    height: 300,
  });

  // Draw other text fields (risk factors, triggers, notes)
  page.drawText(`Date: ${date}`, { x: 50, y: 750, size: 12 });

  // Draw risk factors
  const riskFactorsYStart = 380;
  const riskFactorTitles = ['Diet', 'Emotion', 'Intensity', 'Body Use', 'Sleep', 'External', 'Other'];
  riskFactorTitles.forEach((title, index) => {
    const yPosition = riskFactorsYStart - index * 30;
    const riskFactorValue = factors[title.toLowerCase()] || 'N/A';
    page.drawText(`${title}: ${riskFactorValue}`, { x: 50, y: yPosition, size: 12 });
  });

  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.join(pdfOutputDir, `Journal_${date}.pdf`), pdfBytes);
};

async function generatePdfs() {
  const formDefinition = readJSONFile(path.join(dataDir, 'form-definition.json'));
  const formResponses = readJSONFile(path.join(dataDir, 'form-responses.json'));

  const questionMap = {};
  formDefinition.items.forEach((item) => {
    if (item.questionItem) {
      const questionId = item.questionItem.question.questionId;
      const title = item.title;
      questionMap[questionId] = title;
    }
  });

  const daysOfData = formResponses.responses?.reduce((acc, curr) => {
    const symptomStart = curr.answers['065980fd']?.textAnswers.answers[0].value;
    const date = symptomStart ? symptomStart.split(' ')[0] : new Date(curr.lastSubmittedTime).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = {
        pain: [],
        factors: {}
      };
    }

    const time = new Date(curr.createTime).getHours();
    const painLevel = curr.answers['645e49c5'] ? parseInt(curr.answers['645e49c5'].textAnswers.answers[0].value) : 0;
    const remedies = curr.answers['6b3c1ac6'] ? [curr.answers['6b3c1ac6'].textAnswers.answers[0].value] : [];
    const medications = curr.answers['7dafa2ba'] ? [curr.answers['7dafa2ba'].textAnswers.answers[0].value] : [];

    acc[date].pain.push({ time, level: painLevel, remedies, medications });

    // Update factors with the latest response
    ['20018bcf', '1f14e108', '1f166a67', '57e852e0', '2094789c', '3c9831e5', '2cecca34'].forEach(key => {
      if (curr.answers[key]) {
        const factorTitle = questionMap[key];
        acc[date].factors[factorTitle.toLowerCase()] = curr.answers[key].textAnswers.answers[0].value;
      }
    });

    return acc;
  }, {});

  for (const date in daysOfData) {
    await createPDF({ date, ...daysOfData[date] });
  }
}

generatePdfs().then(() => {
  console.log('PDFs generated successfully!');
}).catch(err => {
  console.error('Error generating PDFs:', err);
});

export { generatePdfs };
