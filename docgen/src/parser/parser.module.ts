import { Module } from '@nestjs/common';
import { FinderService } from './service/finder.service';
import { ParserService } from './service/parser.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ParserService, FinderService],
})
export class ParserModule {}
