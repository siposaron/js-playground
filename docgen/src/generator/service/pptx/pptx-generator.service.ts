import { Injectable } from '@nestjs/common';
import Automizer, { ReplaceText, modify } from 'pptx-automizer/dist';

@Injectable()
export class PptxGeneratorService {
  private output = 'output.pptx';
  private delimiters = {
    openingTag: '${',
    closingTag: '}',
  };

  private automizer = new Automizer({
    outputDir: `./`,
  });

  constructor() {}

  async generateFile(
    rootTemplateFile: string,
    templateFile: string,
    contentValues: any,
  ): Promise<string> {
    const pres = this.automizer
      .loadRoot(rootTemplateFile) // unfortunately this is needed
      .load(templateFile);

    const presInfo = await pres.getInfo();
    const slideNumbers = presInfo
      .slidesByTemplate(templateFile)
      .map((slide) => slide.number);

    if (Array.isArray(slideNumbers) && slideNumbers.length) {
      for (const slideNumber of slideNumbers) {
        await pres.addSlide(templateFile, slideNumber, async (slide) => {
          // Use the textElementIds method to get all text element IDs in the slide
          const elementIds = (await slide.getAllElements()).map((e) => e.name);

          // Loop through the element IDs and modify the text
          for (const elementId of elementIds) {
            slide.modifyElement(
              elementId,
              modify.replaceText(
                this.normalizeContentValues(contentValues),
                this.delimiters,
              ),
            );
          }
        });
      }
      await pres.write(this.output);
      return this.output;
    }
  }

  normalizeContentValues(contentValues: any): ReplaceText[] {
    const replaceTexts = [];
    if (contentValues) {
      for (const [key, value] of Object.entries(contentValues)) {
        replaceTexts.push({
          replace: key,
          by: {
            text: value,
          },
        } as ReplaceText);
      }
    }
    return replaceTexts;
  }
}
