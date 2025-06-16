import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLoanDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  id: number;

  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true })
  @ApiProperty()
  readonly book_id: number[];

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly user_id: number;

  @ApiProperty()
  @IsNotEmpty()
  loan_date: Date;

  @ApiProperty()
  @IsNotEmpty()
  return_date: Date;

  // @ApiProperty()
  // state?: boolean;
}

export class UpdateLoanDto extends PartialType(CreateLoanDto) {}
