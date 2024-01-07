import { Module } from '@nestjs/common';
import { DocxGeneratorService } from './service/docx/docx-generator.service';
import { PptxGeneratorService } from './service/pptx/pptx-generator.service';
import { XlsxGeneratorService } from './service/xlsx/xlsx-generator.service';

@Module({
  imports: [],
  controllers: [],
  providers: [DocxGeneratorService, PptxGeneratorService, XlsxGeneratorService],
})
export class GeneratorModule {}
