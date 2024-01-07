import { Injectable } from '@nestjs/common';
import * as OfficeParser from 'officeparser';

const config = {
  newlineDelimiter: ' ', // Separate new lines with a space instead of the default \n.
  ignoreNotes: true, // Ignore notes while parsing presentation files like pptx or odp.
};

@Injectable()
export class ParserService {
  async parseFile(file: string): Promise<string> {
    return await OfficeParser.parseOfficeAsync(file, config);
  }
}
