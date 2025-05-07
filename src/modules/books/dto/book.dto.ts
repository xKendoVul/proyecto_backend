import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
  Min,
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

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  @IsNotEmpty()
  readonly genre_id: number;

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

export class FilterBookDto {
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsOptional()
  @Min(0)
  offset: number;

  @IsOptional()
  description: string;
}
