import { getAuth } from './src/auth';
import { getFormDefinition } from './src/form-definition';
import { getFormResponses } from './src/form-responses';
import { writeFile } from './src/write-file';
import path from 'path';

global.auth = await getAuth();
var d = new Date();
const daysOfData = 1;
const formDefinition = await getFormDefinition();
await writeFile(
  path.join(__dirname, './output/data/form-definition.json'),
  JSON.stringify(formDefinition, null, 2)
);
const formResponses = await getFormResponses(new Date(d.setDate(d.getDate() - daysOfData)));
await writeFile(
  path.join(__dirname, './output/data/form-responses.json'),
  JSON.stringify(formResponses, null, 2)
);
