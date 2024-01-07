import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { ParserModule } from './parser/parser.module';
import { GeneratorModule } from './generator/generator.module';
import { FinderService } from './parser/service/finder.service';
import { ParserService } from './parser/service/parser.service';
import { DocxGeneratorService } from './generator/service/docx/docx-generator.service';
import { PptxGeneratorService } from './generator/service/pptx/pptx-generator.service';
import { XlsxGeneratorService } from './generator/service/xlsx/xlsx-generator.service';

@Module({
  imports: [ParserModule, GeneratorModule],
  controllers: [AppController],
  providers: [
    FinderService,
    ParserService,
    DocxGeneratorService,
    PptxGeneratorService,
    XlsxGeneratorService,
  ],
})
export class AppModule {}
