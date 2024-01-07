import { Test, TestingModule } from '@nestjs/testing';
import { PptxGeneratorService } from './pptx-generator.service';

describe('PptxGeneratorService', () => {
  const data = {
    firstName: 'Alon',
    lastName: 'Bar',
    first: 'First text',
    second: 'SECOND title',
    LAST: 'Very important\ntext here!',
  };

  let service: PptxGeneratorService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [PptxGeneratorService],
    }).compile();

    service = app.get<PptxGeneratorService>(PptxGeneratorService);
  });

  describe('PptxGeneratorService', () => {
    it('should generate pptx from template', async () => {
      const fileName = await service.generateFile(
        './templates/pptx_template_root.pptx',
        './templates/pptx_template.pptx',
        data,
      );

      console.log(`PPTX results: ${fileName}`);
      await expect(fileName).toBe('output.pptx');
      // assert content does not contain ${} but contains values
    });
  });
});
