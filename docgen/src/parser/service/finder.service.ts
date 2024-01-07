import { Injectable } from '@nestjs/common';
import { ParserService } from './parser.service';

@Injectable()
export class FinderService {
  constructor(private readonly parserService: ParserService) {}

  async listPlaceholders(file: string): Promise<string[]> {
    try {
      const parsedContent = await this.parserService.parseFile(file);

      // eslint-disable-next-line prettier/prettier
      const matchedArray = parsedContent.match(/\${(.*?)}/g);
      return this.removeDuplicates(matchedArray);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  private removeDuplicates(data: string[]): string[] {
    return [...new Set(data)];
  }
}
