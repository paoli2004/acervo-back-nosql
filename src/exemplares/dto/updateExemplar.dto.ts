import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateExemplarDto } from './createExemplar.dto';

export class UpdateExemplarDto extends PartialType(
  PickType(CreateExemplarDto, [
    'livro',
    'codigo_patrimonio',
    'ano_publicacao',
  ] as const),
) {}
