import { Module } from '@nestjs/common';
import { DataResolverModule } from './data-resolver/data-resolver.module';

@Module({
  imports: [
    DataResolverModule,
  ]
})
export class AppModule {}
