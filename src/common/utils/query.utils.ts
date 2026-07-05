import { NotFoundException } from '@nestjs/common';

/**
 * Executa uma Promise que busca uma entidade e lança erro caso não encontre.
 *
 * @template T Tipo da entidade esperada
 * @param promise Promise que retorna o schema ou null
 * @param message Mensagem de erro caso o schema não seja encontrado
 * @returns O schema encontrado
 */
export async function findOrFail<T>(
  promise: Promise<T | null>,
  message: string,
): Promise<T> {
  const result = await promise;

  if (!result) {
    throw new NotFoundException(message);
  }

  return result;
}
