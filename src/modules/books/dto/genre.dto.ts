import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateGenreDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  id?: number;

  @IsString()
  @MinLength(3)
  @ApiProperty() // Asegúrate de que ApiProperty esté aquí
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  image?: string; // Aquí va la URL de la imagen
}

export class UpdateGenreDto extends PartialType(CreateGenreDto) {}
