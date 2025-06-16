import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Query,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateLoanDto } from '../dto/loan.dto';
import { LoansService } from '../services/loans.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('loans')
export class LoansController {
  constructor(private readonly loanService: LoansService) {}

  @Get()
  async getLoansAll(@Query() pagination: PaginationDto) {
    return this.loanService.findAll(pagination);
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    const loan = await this.loanService.findOne(id);
    const data = {
      data: loan,
    };
    return data;
  }

  @Post()
  async createLoan(@Body() createLoanDto: CreateLoanDto) {
    const loan = await this.loanService.create(createLoanDto);
    const data = {
      data: loan,
      message: 'Préstamo creado correctamente',
    };
    return data;
  }

  @Patch(':id/confirm')
  async confirmLoan(@Param('id', ParseIntPipe) id: number) {
    return this.loanService.confirmLoan(id);
  }

  @Patch(':id/deny')
  async denyLoan(@Param('id', ParseIntPipe) id: number) {
    return this.loanService.denyLoan(id);
  }

  @Patch(':id/return')
  async updateLoan(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLoanDto: CreateLoanDto,
  ) {
    const updatedLoan = await this.loanService.update(id, updateLoanDto);
    const data = {
      data: updatedLoan,
      message: 'Préstamo actualizado',
    };
    return data;
  }
}
