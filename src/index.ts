import { getAuth } from './auth';
import { getFormDefinition } from './form-definition';
import { getFormResponses } from './form-responses';
import { generatePdfs } from './pdf-generator';
import { writeFile } from './write-file';
import path from 'path';

// global.auth = await getAuth();
// var d = new Date();
// const daysOfData = 1;
// const formDefinition = await getFormDefinition();
// await writeFile(
//   path.join(__dirname, './output/data/form-definition.json'),
//   JSON.stringify(formDefinition, null, 2)
// );
// const formResponses = await getFormResponses(new Date(d.setDate(d.getDate() - daysOfData)));
// await writeFile(
//   path.join(__dirname, './output/data/form-responses.json'),
//   JSON.stringify(formResponses, null, 2)
// );

await generatePdfs();