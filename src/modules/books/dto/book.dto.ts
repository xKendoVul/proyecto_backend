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
  Min,
  IsArray,
  ArrayNotEmpty,
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

  @IsString()
  @MinLength(3)
  @ApiProperty()
  readonly publisher_id: number;

  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true })
  @ApiProperty()
  readonly genre_id: number[];
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
  title: string;
}
