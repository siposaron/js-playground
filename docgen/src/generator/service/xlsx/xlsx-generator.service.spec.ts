import { Test, TestingModule } from '@nestjs/testing';
import { XlsxGeneratorService } from './xlsx-generator.service';

describe('XlsxGeneratorService', () => {
  const data = {
    firstName: 'Alon',
    lastName: 'Bar',
    first: 'First text',
    LAST: 'Very important\ntext here!',
  };

  let service: XlsxGeneratorService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [XlsxGeneratorService],
    }).compile();

    service = app.get<XlsxGeneratorService>(XlsxGeneratorService);
  });

  describe('XlsxGeneratorService', () => {
    it('should generate xlsx from template', async () => {
      const fileName = await service.generateFileJsXls(
        './templates/xlsx_template.xlsx',
        data,
      );

      console.log(`XLSX results: ${fileName}`);
      await expect(fileName).toBe('output-js-xls.xlsx');
      // assert content does not contain ${} but contains values
    });

    it('should generate xlsx from template', async () => {
      const fileName = await service.generateFile(
        './templates/xlsx_template.xlsx',
        data,
      );

      console.log(`XLSX results: ${fileName}`);
      await expect(fileName).toBe('output.xlsx');
    });
  });
});
