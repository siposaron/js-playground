import { Injectable } from '@nestjs/common';
import JsExcelTemplate from 'js-excel-template';
import XlsxTemplate from 'xlsx-template';
import { promises as fs } from 'fs';

@Injectable()
export class XlsxGeneratorService {
  private output = 'output.xlsx';
  private outputJsXls = 'output-js-xls.xlsx';
  private delimiters = {
    tagStart: '${',
    tagEnd: '}',
  };

  constructor() {}

  // js-excel-template: works but placeholder is fixed {placeholder}, no delimiters can be specified
  async generateFileJsXls(file: string, contentValues: any): Promise<string> {
    // 1. read template file
    const excelTemplate = await JsExcelTemplate.fromFile(file);

    // 2. change placeholders with values
    if (contentValues) {
      for (const [key, value] of Object.entries(contentValues)) {
        excelTemplate.set(key, value as string);
      }
    }

    // 3. save file
    await excelTemplate.saveAs(this.outputJsXls);

    return this.outputJsXls;
  }

  // xlsx-template lib
  async generateFile(file: string, contentValues: any): Promise<string> {
    try {
      const data = await fs.readFile(file);
      const template = new XlsxTemplate(data);
      (<XlsxTemplateExtended>(template as unknown)).substituteAll(
        contentValues,
      );

      // Get binary data
      const newData = template.generate();

      fs.writeFile(this.output, newData, 'binary');

      return this.output;
    } catch (err) {
      console.error('Error reading file data', err);
    }
  }
}
