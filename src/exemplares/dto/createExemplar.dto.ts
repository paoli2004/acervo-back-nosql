import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateExemplarDto {
  @IsNotEmpty()
  @IsString()
  livro!: string;

  @IsNotEmpty()
  @IsInt()
  ano_publicacao!: number;

  @IsNotEmpty()
  @IsInt()
  codigo_patrimonio!: number;
}