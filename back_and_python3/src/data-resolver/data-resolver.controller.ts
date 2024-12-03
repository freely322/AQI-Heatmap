import { Controller, Get, Query } from '@nestjs/common';
import { DataResolverService } from './data-resolver.service';

@Controller('data-resolver')
export class DataResolverController {
  constructor(private readonly dataResolverService: DataResolverService) {}

  @Get('coordinates')
  async getCoordinates(@Query('type') type) {
    return await this.dataResolverService.getCoordinates(type);
  }

}
