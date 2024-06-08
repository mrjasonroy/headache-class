// takes a file path and a string and writes the string to the file

import fs from 'fs';
import path from 'path';

async function writeFile(filePath: string, content: string): Promise<void> {
  const resolvedPath = path.resolve(filePath);
  await fs.promises
    .writeFile(resolvedPath, content)
    .catch((err) => console.error(err));
}
export { writeFile };