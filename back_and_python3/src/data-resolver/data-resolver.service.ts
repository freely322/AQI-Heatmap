import { HttpService, Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class DataResolverService {
  constructor(
    private _httpService: HttpService
  ) {};

  async getCoordinates(type: any ): Promise<any> {
    try {
      return await fs.readFileSync(`${__dirname}/../../data-${type}.json`, 'utf8');
    } catch (e) {
      return e.message;
    }
  }

}
