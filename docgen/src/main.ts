import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FinderService } from './parser/service/finder.service';

const TEMPLATES = [
  './templates/docx_template.docx',
  './templates/pptx_template.pptx',
  './templates/xlsx_template.xlsx',
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const service = app.get<FinderService>(FinderService);
  for (const file of TEMPLATES) {
    const placeholders = await service.listPlaceholders(file);
    console.log(`Placeholders of ${file}: ${placeholders}`);
  }

  await app.listen(3000);
}
bootstrap();
