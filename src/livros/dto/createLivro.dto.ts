import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';

export class CreateLivroDto {
  @IsNotEmpty()
  @IsString()
  titulo!: string;

  @IsNotEmpty()
  @IsString()
  isbn!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  autores?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  categorias!: string[];

  @IsNotEmpty()
  @IsString()
  editora!: string;
}
