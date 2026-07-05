import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './createUsuario.dto';

export class UpdateUsuarioDto extends PartialType(
  PickType(CreateUsuarioDto, ['nome', 'email'] as const),
) {}
