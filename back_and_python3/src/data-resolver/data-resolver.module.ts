import { Module } from '@nestjs/common';
import { DataResolverController } from './data-resolver.controller';
import { DataResolverService } from './data-resolver.service';
import {HttpConfigModule} from "../http-config/http-config.module";

@Module({
  imports: [HttpConfigModule],
  controllers: [DataResolverController],
  providers: [DataResolverService]
})
export class DataResolverModule {}
