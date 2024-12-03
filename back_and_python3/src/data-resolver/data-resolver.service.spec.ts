import { Test, TestingModule } from '@nestjs/testing';
import { DataResolverService } from './data-resolver.service';

describe('DataResolverService', () => {
  let service: DataResolverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataResolverService],
    }).compile();

    service = module.get<DataResolverService>(DataResolverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
