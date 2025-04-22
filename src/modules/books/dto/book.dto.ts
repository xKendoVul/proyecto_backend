import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateBookDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  id?: number;

  @IsString()
  @MinLength(3)
  @ApiProperty()
  title: string;

  @IsString()
  @MinLength(3)
  @ApiProperty()
  genre: string;

  @IsString()
  @MinLength(3)
  @ApiProperty()
  author: string;

  @IsString()
  @MinLength(3)
  @ApiProperty()
  publisher: string;

  @IsInt()
  @IsPositive()
  @ApiProperty()
  publication_year: number;

  @IsOptional()
  @ApiProperty()
  isAvailable?: boolean;
}

export class UpdateBookDto extends PartialType(CreateBookDto) {}
