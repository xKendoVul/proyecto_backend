import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  Min,
  IsPositive,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateGenreDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  id?: number;

  @IsString()
  @MinLength(3)
  @ApiProperty() // Asegúrate de que ApiProperty esté aquí
  name?: string;
}

export class UpdateGenreDto extends PartialType(CreateGenreDto) {}

export class FilterGenreDto {
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsOptional()
  @Min(0)
  offset: number;

  @IsOptional()
  name: string;
}
