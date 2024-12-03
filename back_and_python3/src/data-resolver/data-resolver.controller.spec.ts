import { Test, TestingModule } from '@nestjs/testing';
import { DataResolverController } from './data-resolver.controller';

describe('DataResolverController', () => {
  let controller: DataResolverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataResolverController],
    }).compile();

    controller = module.get<DataResolverController>(DataResolverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
