import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateLivroDto } from './createLivro.dto';

export class UpdateLivroDto extends PartialType(
  PickType(CreateLivroDto, [
    'titulo',
    'isbn',
    'autores',
    'categorias',
    'editora',
  ] as const),
) {}
