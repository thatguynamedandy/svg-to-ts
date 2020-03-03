import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as prettier from 'prettier/standalone';
import typescriptParser from 'prettier/parser-typescript';

import { ConvertionOptions } from '../bin/svg-to-ts';

const readfile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

export const extractSvgContent = async (filePath: string): Promise<string> => {
  const fileContentRaw = await readfile(filePath, 'utf-8');
  return fileContentRaw.replace(/\r?\n|\r/g, ' ');
};

export const writeIconsFile = async (convertionOptions: ConvertionOptions, fileContent: string): Promise<void> => {
  const formatedFileContent = formatContent(fileContent);
  if (!fs.existsSync(convertionOptions.outputDirectory)) {
    fs.mkdirSync(convertionOptions.outputDirectory);
  }
  await writeFile(
    path.join(convertionOptions.outputDirectory, `${convertionOptions.fileName}.ts`),
    formatedFileContent
  );
};

const formatContent = (fileContent: string) =>
  prettier.format(fileContent, {
    parser: 'typescript',
    plugins: [typescriptParser],
    singleQuote: true
  });