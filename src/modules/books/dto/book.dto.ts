import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateBookDto {
  @IsNumber()
  @ApiProperty()
  id: number;

  @IsString()
  @MinLength(3)
  @ApiProperty()
  title: string;

  @IsInt()
  @IsPositive()
  @ApiProperty()
  publication_year?: number;

  @IsOptional()
  @ApiProperty()
  isAvailable?: boolean;

  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  readonly author_id: number;

  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  readonly publisher_id: number;

  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true })
  @ApiProperty()
  readonly genre_id: number[];

  @IsString()
  @ApiProperty()
  @IsOptional()
  image: string;

  @IsNumber()
  @ApiProperty()
  total_copies: number;
}

export class UpdateBookDto extends PartialType(CreateBookDto) {}
