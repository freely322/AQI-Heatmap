import {Module, HttpModule} from '@nestjs/common';
import { config } from "dotenv";

const environment = process.env.NODE_ENV || 'development';

config({
  path: `.env.${environment}`
});

@Module({
  imports: [
    HttpModule.register({
      baseURL: process.env.HOST,
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  exports: [HttpModule]
})

export class HttpConfigModule {}
