import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  Min,
  IsPositive,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateAuthorDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  id?: number;

  @IsString()
  @MinLength(3)
  @ApiProperty()
  name: string;
}

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {}

export class FilterAuthorDto {
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsOptional()
  @Min(0)
  offset: number;

  @IsOptional()
  name: string;
}