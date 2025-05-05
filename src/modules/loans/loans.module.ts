import { Module } from '@nestjs/common';
import { LoansControllerTsController } from './controllers/loans.controller.ts.controller';
import { LoansService } from './services/loans.service';

@Module({
  controllers: [LoansControllerTsController],
  providers: [LoansService]
})
export class LoansModule {}
