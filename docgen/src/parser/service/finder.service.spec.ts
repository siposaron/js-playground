import { Test, TestingModule } from '@nestjs/testing';
import { FinderService } from './finder.service';
import { ParserService } from './parser.service';

describe('FinderService', () => {
  let service: FinderService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [FinderService, ParserService],
    }).compile();

    service = app.get<FinderService>(FinderService);
  });

  describe('Finder Service', () => {
    it('should return parsed placeholders from docx', async () => {
      const result = await service.listPlaceholders(
        './templates/docx_template.docx',
      );
      console.log(`DOCX results: ${result}`);
      await expect(result).toBeDefined();
      await expect(result).toHaveLength(4);
      await expect(result).toContain('${firstName}');
      await expect(result).toContain('${LAST}');
    });

    it('should return parsed placeholders from pptx', async () => {
      const result = await service.listPlaceholders(
        './templates/pptx_template.pptx',
      );
      console.log(`PPTX results: ${result}`);
      await expect(result).toBeDefined();
      await expect(result).toHaveLength(4);
      await expect(result).toContain('${firstName}');
      await expect(result).toContain('${LAST}');
    });

    it('should return parsed placeholders from xlsx', async () => {
      const result = await service.listPlaceholders(
        './templates/xlsx_template.xlsx',
      );
      console.log(`XLSX results: ${result}`);
      await expect(result).toBeDefined();
      await expect(result).toHaveLength(5);
      await expect(result).toContain('${firstName}');
      await expect(result).toContain('${LAST}');
      await expect(result).toContain('${aron}'); // second tab
    });
  });
});
