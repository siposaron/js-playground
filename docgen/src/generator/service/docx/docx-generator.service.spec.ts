import { Test, TestingModule } from '@nestjs/testing';
import { DocxGeneratorService } from './docx-generator.service';

describe('DocxGeneratorService', () => {
  const data = {
    firstName: 'Alon',
    lastName: 'Bar',
    first: 'First text',
    LAST: 'Very important\ntext here!',
  };

  let service: DocxGeneratorService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [DocxGeneratorService],
    }).compile();

    service = app.get<DocxGeneratorService>(DocxGeneratorService);
  });

  describe('DocxGeneratorService', () => {
    it('should generate docx from template', async () => {
      const fileName = await service.generateFile(
        './templates/docx_template.docx',
        data,
      );

      console.log(`DOCX results: ${fileName}`);
      await expect(fileName).toBe('output.docx');
      // assert content does not contain ${} but contains values
    });

    it('should generate pptx from template', async () => {
      const fileName = await service.generatePPTX(
        './templates/pptx_template.pptx',
        data,
      );

      console.log(`PPTX results: ${fileName}`);
      await expect(fileName).toBe('output.pptx');
      // assert content does not contain ${} but contains values
    });
  });
});
