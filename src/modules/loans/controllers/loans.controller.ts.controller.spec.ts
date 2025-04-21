import { Test, TestingModule } from '@nestjs/testing';
import { LoansControllerTsController } from './loans.controller.ts.controller';

describe('LoansControllerTsController', () => {
  let controller: LoansControllerTsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoansControllerTsController],
    }).compile();

    controller = module.get<LoansControllerTsController>(LoansControllerTsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
