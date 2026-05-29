import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Emprestimo, EmprestimoDocument } from './schemas/emprestimo.schema';
import { UsuariosService } from '../usuarios/usuarios.service';

type FilterQuery<T> = { [P in keyof T]?: T[P] } & { _id?: any };

@Injectable()
export class EmprestimosService {
  constructor(
    @InjectModel(Emprestimo.name)
    private readonly emprestimoModel: Model<EmprestimoDocument>,
    private readonly usuariosService: UsuariosService,
  ) {}

  /**
   *Executa uma Promise que busca uma entidade e lança erro caso não encontre.
   *
   * @template T Tipo da entidade esperada
   * @param promise Promise que retorna a entidade ou null (ex: findOne do Mongoose)
   * @param message Mensagem de erro caso a entidade não seja encontrada
   * @returns A entidade encontrada (garantido que não é null)
   */
  private async findOrFail<T>(
    promise: Promise<T | null>,
    message: string,
  ): Promise<T> {
    const result = await promise;

    if (!result) {
      throw new NotFoundException(message);
    }

    return result;
  }

  async findEmprestimo(
    emprestimoFilterQuery: FilterQuery<Emprestimo>,
  ): Promise<Emprestimo> {
    if (
      !emprestimoFilterQuery ||
      Object.keys(emprestimoFilterQuery).length === 0
    ) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }
    return this.findOrFail(
      this.emprestimoModel.findOne(emprestimoFilterQuery).exec(),
      'Empréstimo não encontrado',
    );
  }

  async createEmprestimo(createEmprestimoDto: any): Promise<void> {
    const usuario = await this.findOrFail(
      this.usuariosService.findUsuario({ _id: createEmprestimoDto.usuario_id }),
      'Usuário não encontrado',
    );

    // const exemplar =
  }
}

// @Injectable()
// export class EmprestimosService {
//   constructor(
//     @InjectRepository(Emprestimos)
//     private readonly emprestimosRepository: Repository<Emprestimos>,
//     private readonly usuariosService: UsuariosService,
//     private readonly exemplaresService: ExemplaresService,
//   ) {}

//   /**
//    * Cria um novo emprestimo.
//    * @param createEmprestimo Dados para criação do emprestimo.
//    * @returns Promise que resolve quando o emprestimo é criado.
//    */
//   async createEmprestimo(createEmprestimo: CreateEmprestimoDto): Promise<void> {
//     const usuario = await this.findOrFail(
//       this.usuariosService.getUsuarioById(createEmprestimo.usuario_id),
//       'Usuário não encontrado',
//     );

//     const exemplar = await this.findOrFail(
//       this.exemplaresService.getExemplarById(createEmprestimo.exemplar_id),
//       'Exemplar não encontrado',
//     );

//     const exemplarJaEmprestado = await this.emprestimosRepository.findOne({
//       where: {
//         exemplar: { id: createEmprestimo.exemplar_id },
//         ativo: true,
//       },
//     });

//     if (exemplarJaEmprestado) {
//       throw new ConflictException('Este exemplar já está emprestado.');
//     }

//     const emprestimo = this.emprestimosRepository.create({
//       usuario: usuario,
//       exemplar: exemplar,
//       data_emprestimo: createEmprestimo.data_emprestimo, // formato "2026-05-10"
//       data_devolucao: createEmprestimo.data_devolucao, // formato "2026-05-20"
//       ativo: true,
//     });

//     await this.emprestimosRepository.save(emprestimo);
//   }

//   async removeEmprestimo(id: number): Promise<void> {
//     const emprestimo = await this.findOrFail(
//       this.getEmprestimoById(id),
//       'Emprestimo não encontrado',
//     );

//     await this.emprestimosRepository.remove(emprestimo);
//   }

//   /**
//    * Retorna todos os emprestimos.
//    * @returns Lista de emprestimos.
//    */
//   async getAllEmprestimos(): Promise<any[]> {
//     const emprestimo = await this.emprestimosRepository.find({
//       order: { id: 'ASC' },
//       relations: ['usuario', 'exemplar.livro'],
//     });

//     return emprestimo.map((emprestimo) => ({
//       ...emprestimo,
//       usuario: emprestimo.usuario,
//       exemplar: emprestimo.exemplar,
//     }));
//   }

//   async devolveExemplar(id: number) {
//     const emprestimo = await this.emprestimosRepository.findOne({
//       where: { id },
//       relations: ['usuario', 'exemplar.livro'],
//     });

//     if (!emprestimo) {
//       throw new NotFoundException('Emprestimo não encontrado');
//     }

//     emprestimo.ativo = false;
//     await this.emprestimosRepository.save(emprestimo);
//   }

//   /**
//    * Retorna um emprestimo.
//    * @param id ID do emprestimo.
//    * @returns Emprestimo encontrado.
//    */
//   async getEmprestimoById(id: number): Promise<any> {
//     const emprestimo = await this.emprestimosRepository.findOne({
//       where: { id },
//       relations: ['usuario', 'exemplar.livro'],
//     });

//     if (!emprestimo) {
//       throw new NotFoundException('Emprestimo não encontrado');
//     }

//     return {
//       id: emprestimo.id,
//       usuario: emprestimo.usuario.nome,
//       exemplar: emprestimo.exemplar.livro?.titulo,
//       data_emprestimo: emprestimo.data_emprestimo,
//       data_devolucao: emprestimo.data_devolucao,
//     };
//   }

//   async buscarAvancado(params: {
//     livro_id?: number;
//     usuario_id?: number;
//     exemplar_id?: number;
//     data_inicio?: Date;
//     data_fim?: Date;
//     ativo?: boolean;
//   }): Promise<any[]> {
//     const qb = this.emprestimosRepository
//       .createQueryBuilder('emprestimo')
//       .innerJoinAndSelect('emprestimo.usuario', 'usuario')
//       .innerJoinAndSelect('emprestimo.exemplar', 'exemplar')
//       .innerJoinAndSelect('exemplar.livro', 'livro')
//       .leftJoinAndSelect('livro.categoria', 'categoria');

//     if (params.livro_id) {
//       qb.andWhere('livro.id = :livro_id', { livro_id: params.livro_id });
//     }

//     if (params.usuario_id) {
//       qb.andWhere('usuario.id = :usuario_id', {
//         usuario_id: params.usuario_id,
//       });
//     }

//     if (params.exemplar_id) {
//       qb.andWhere('exemplar.id = :exemplar_id', {
//         exemplar_id: params.exemplar_id,
//       });
//     }

//     if (params.data_inicio && params.data_fim) {
//       qb.andWhere(
//         'emprestimo.data_emprestimo BETWEEN :data_inicio AND :data_fim',
//         {
//           data_inicio: params.data_inicio,
//           data_fim: params.data_fim,
//         },
//       );
//     } else if (params.data_inicio) {
//       qb.andWhere('emprestimo.data_emprestimo >= :data_inicio', {
//         data_inicio: params.data_inicio,
//       });
//     } else if (params.data_fim) {
//       qb.andWhere('emprestimo.data_emprestimo <= :data_fim', {
//         data_fim: params.data_fim,
//       });
//     }

//     if (params.ativo !== undefined) {
//       if (params.ativo) {
//         qb.andWhere('emprestimo.ativo = true');
//       } else {
//         qb.andWhere('emprestimo.ativo = false');
//       }
//     }

//     const emprestimos = await qb.orderBy('emprestimo.id', 'ASC').getMany();

//     return emprestimos.map((e) => ({
//       id: e.id,
//       ativo: e.ativo,
//       data_emprestimo: e.data_emprestimo,
//       data_devolucao: e.data_devolucao,
//       usuario: e.usuario,
//       exemplar: {
//         id: e.exemplar.id,
//         codigo_patrimonio: e.exemplar.codigo_patrimonio,
//         livro: {
//           id: e.exemplar.livro.id,
//           titulo: e.exemplar.livro.titulo,
//           categoria: e.exemplar.livro.categoria ?? [],
//         },
//       },
//     }));
//   }
// }
