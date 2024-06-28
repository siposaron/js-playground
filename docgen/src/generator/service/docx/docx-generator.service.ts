import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { MimeType, TemplateHandler } from 'easy-template-x';

@Injectable()
export class DocxGeneratorService {
  private output = 'output.docx';
  private delimiters = {
    tagStart: '${',
    tagEnd: '}',
  };
  private handler = new TemplateHandler({ delimiters: this.delimiters });

  constructor() {}

  async generateFile(file: string, contentValues: any): Promise<string> {
    // 1. read template file
    const templateFile = fs.readFileSync(file);

    // 2. list tags
    const tags = await this.handler.parseTags(templateFile);
    const tagNames = this.removeDuplicates(tags.map((t) => t.name));
    console.log(`Tag names: ${tagNames}`);

    // images if exist
    if (contentValues.images) {
      for (let i = 0; i < contentValues.images.length; i++) {
        const index = i + 1;
        contentValues[`img${index}`] = {
          _type: 'image',
          source: fs.readFileSync(`./templates/img/${contentValues.images[i]}`),
          format: MimeType.Jpeg,
          width: 600,
          height: 800,
        };
      }
    }

    // 3. process the template
    const doc = await this.handler.process(templateFile, contentValues);

    // 4. save output
    fs.writeFileSync(this.output, doc);

    return this.output;
  }

  async generatePPTX(file: string, contentValues: any): Promise<string> {
    // 1. read template file
    const templateFile = fs.readFileSync(file);

    // 2. list tags
    const tags = await this.handler.parseTags(templateFile);
    const tagNames = this.removeDuplicates(tags.map((t) => t.name));
    console.log(`Tag names: ${tagNames}`);

    // 3. process the template
    const doc = await this.handler.process(templateFile, contentValues);

    // 4. save output
    fs.writeFileSync('output.pptx', doc);

    return 'output.pptx';
  }

  private removeDuplicates(data: string[]): string[] {
    return [...new Set(data)];
  }
}
