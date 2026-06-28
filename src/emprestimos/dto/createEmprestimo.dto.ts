import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsBoolean, IsString } from 'class-validator';

export class CreateEmprestimoDto {
  @IsString()
  @IsNotEmpty()
  usuario!: string;

  @IsString()
  @IsNotEmpty()
  exemplar!: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  data_emprestimo!: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  data_devolucao!: Date;

  @IsBoolean()
  @IsNotEmpty()
  ativo!: boolean;
}
