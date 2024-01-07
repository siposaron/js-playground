import { Body, Controller, Get, Post } from '@nestjs/common';
import { FinderService } from '../parser/service/finder.service';
import { PlaceholderResponse, GenerateResponse } from './dto/response.dto';
import { DocxGeneratorService } from '../generator/service/docx/docx-generator.service';
import { PptxGeneratorService } from '../generator/service/pptx/pptx-generator.service';
import { XlsxGeneratorService } from '../generator/service/xlsx/xlsx-generator.service';

const TEMPLATES = [
  './templates/docx_template.docx',
  './templates/pptx_template.pptx',
  './templates/xlsx_template.xlsx',
];

@Controller()
export class AppController {
  constructor(
    private readonly finderService: FinderService,
    private readonly docxGenerator: DocxGeneratorService,
    private readonly pptxGenerator: PptxGeneratorService,
    private readonly xlsxGenerator: XlsxGeneratorService,
  ) {}

  @Get('/placeholders')
  async getPlaceholders(): Promise<PlaceholderResponse[]> {
    const response = new Array<PlaceholderResponse>();
    for (const file of TEMPLATES) {
      const placeholders = await this.finderService.listPlaceholders(file);
      console.log(`Placeholders of ${file}: ${placeholders}`);
      response.push({
        file,
        placeholders,
      } as PlaceholderResponse);
    }
    return response;
  }

  @Post('/generate')
  async generate(@Body() contentValues: any): Promise<GenerateResponse> {
    const response = {} as GenerateResponse;
    const fileNames = new Array<string>();

    const docxFile = await this.docxGenerator.generateFile(
      TEMPLATES[0],
      contentValues,
    );
    fileNames.push(docxFile);

    const pptxFile = await this.pptxGenerator.generateFile(
      './templates/pptx_template_root.pptx',
      TEMPLATES[1],
      contentValues,
    );
    fileNames.push(pptxFile);

    const xlsxFile = await this.xlsxGenerator.generateFile(
      TEMPLATES[2],
      contentValues,
    );
    fileNames.push(xlsxFile);

    response.files = fileNames;

    return response;
  }
}
