import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Livro, LivroDocument } from './schemas/livro.schema';
import {
  Exemplar,
  ExemplarDocument,
} from '../exemplares/schemas/exemplar.schema';
import { CreateLivroDto } from './dto/createLivro.dto';
import { UpdateLivroDto } from './dto/updateLivro.dto';
import { CategoriasService } from '../categorias/categorias.service';
import { AutoresService } from '../autores/autores.service';
import { EditorasService } from '../editoras/editoras.service';
import { findOrFail } from '../common/utils/query.utils';

type FilterQuery<T> = { [P in keyof T]?: T[P] } & { _id?: any };

@Injectable()
export class LivrosService {
  constructor(
    @InjectModel(Livro.name)
    private readonly livroModel: Model<LivroDocument>,
    @InjectModel(Exemplar.name)
    private readonly exemplarModel: Model<ExemplarDocument>,
    private readonly categoriasService: CategoriasService,
    private readonly autoresService: AutoresService,
    private readonly editorasService: EditorasService,
  ) {}

  /**
   * Localiza um único documento de livro baseado em um filtro de busca na coleção.
   * @param livroFilterQuery Objeto contendo os critérios de seleção (ex: { _id: id }).
   * @returns Documento do livro encontrado com seus métodos e propriedades do Mongoose.
   * @throws {NotFoundException} Se nenhum documento na coleção corresponder ao critério.
   */
  async findLivro(
    livroFilterQuery: FilterQuery<Livro>,
  ): Promise<LivroDocument> {
    return await findOrFail(
      this.livroModel
        .findOne(livroFilterQuery)
        .populate('autores')
        .populate('categorias')
        .populate('editora')
        .exec(),
      'Livro não encontrado',
    );
  }

  /**
   * Recupera uma lista de documentos de livros da coleção, permitindo aplicar filtros opcionais.
   * @param livroFilterQuery Critério opcional de projeção ou busca (ex: { titulo: 'Dom Casmurro' }). Se omitido, retorna todos da coleção.
   * @returns Array contendo os documentos dos livros localizados.
   */
  async findAllLivros(
    livroFilterQuery?: FilterQuery<Livro>,
  ): Promise<LivroDocument[]> {
    return this.livroModel
      .find(livroFilterQuery)
      .populate('autores')
      .populate('categorias')
      .populate('editora')
      .exec();
  }

  /**
   * Realiza uma busca avançada e dinâmica de livros baseada em filtros.
   * @param params params Filtros opcionais de busca (IDs de autores, categorias, editoras e disponibilidade).
   * @returns Lista de livros com toda a árvore de relacionamentos populada (autores, categorias e editoras).
   */
  async buscarAvancado(params: {
    titulo?: string;
    autores?: string;
    categorias?: string;
    editoras?: string;
    onlyDisponiveis?: boolean;
  }): Promise<
    {
      id: Types.ObjectId;
      titulo: string;
      isbn: string;
      autores: any;
      categorias: any;
      editora: any;
      temExemplarDisponivel: boolean;
    }[]
  > {
    const query: any = {};

    if (params.autores) query.autores = new Types.ObjectId(params.autores);
    if (params.categorias)
      query.categorias = new Types.ObjectId(params.categorias);
    if (params.editoras) query.editora = new Types.ObjectId(params.editoras);

    const livros = await this.livroModel
      .find(query)
      .populate('autores')
      .populate('categorias')
      .populate('editora')
      .exec();

    const livrosComDisponibilidade = await Promise.all(
      livros.map(async (livro) => {
        const disponivel = await this.exemplarModel.exists({
          livro: livro._id,
          ehDisponivel: true,
        });
        return {
          id: livro._id,
          titulo: livro.titulo,
          isbn: livro.isbn,
          autores: livro.autores,
          categorias: livro.categorias,
          editora: livro.editora,
          temExemplarDisponivel: !!disponivel,
        };
      }),
    );

    if (params.onlyDisponiveis) {
      return livrosComDisponibilidade.filter(
        (livro) => livro.temExemplarDisponivel,
      );
    }

    return livrosComDisponibilidade;
  }

  /**
   * Cria e persiste um novo documento de livro na coleção correspondente do MongoDB.
   * @param createLivroDto Objeto contendo os dados estruturados e validados do livro (titulo, isbn, etc).
   * @returns O documento do livro recém-criado, incluindo o identificador único (_id) gerado pelo banco.
   */
  async createLivro(createLivroDto: CreateLivroDto): Promise<Livro> {
    const isbnAlreadyExist = await this.livroModel.exists({
      isbn: createLivroDto.isbn,
    });

    if (isbnAlreadyExist) {
      throw new ConflictException(
        'Já existe um livro cadastrado com este ISBN.',
      );
    }

    const categorias = await Promise.all(
      createLivroDto.categorias.map((categoriaId) =>
        findOrFail(
          this.categoriasService.findCategoria({ _id: categoriaId }),
          `Categoria ${categoriaId} não encontrada`,
        ),
      ),
    );

    const autores = createLivroDto.autores?.length
      ? await Promise.all(
          createLivroDto.autores.map((autorId) =>
            findOrFail(
              this.autoresService.findAutor({ _id: autorId }),
              `Autor ${autorId} não encontrado`,
            ),
          ),
        )
      : [];

    const editora = await findOrFail(
      this.editorasService.findEditora({ _id: createLivroDto.editora }),
      `Editora ${createLivroDto.editora} não encontrada`,
    );

    const novoLivro = await this.livroModel.create({
      titulo: createLivroDto.titulo,
      isbn: createLivroDto.isbn,
      categorias: categorias.map((cat: any) => cat._id),
      autores: autores.map((aut: any) => aut._id),
      editora: (editora as any)._id,
    });

    return novoLivro;
  }

  /**
   * Identifica um documento de livro por meio de um filtro e aplica as modificações fornecidas.
   * @param livroFilterQuery Objeto de seleção para mapear o documento a ser alterado (ex: { _id: id }).
   * @param updateLivroDto Objeto contendo o conjunto de campos parciais ou completos a serem atualizados.
   * @returns O documento do livro com as modificações aplicadas e atualizadas em memória.
   * @throws {BadRequestException} Se o objeto de filtro fornecido estiver vazio ou for inválido.
   * @throws {NotFoundException} Se o documento alvo não for localizado para a operação de escrita.
   */
  async findOneAndUpdateLivro(
    livroFilterQuery: FilterQuery<Livro>,
    updateLivroDto: UpdateLivroDto,
  ): Promise<LivroDocument> {
    if (!livroFilterQuery || Object.keys(livroFilterQuery).length === 0) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    const livro = await this.findLivro(livroFilterQuery);

    if (updateLivroDto.isbn && updateLivroDto.isbn !== livro.isbn) {
      const isbnAlreadyExist = await this.livroModel.exists({
        isbn: updateLivroDto.isbn,
        _id: { $ne: livro._id },
      });

      if (isbnAlreadyExist) {
        throw new ConflictException(
          'Já existe um livro cadastrado com este ISBN.',
        );
      }
    }

    if (updateLivroDto.autores?.length) {
      const autores = await Promise.all(
        updateLivroDto.autores.map((autorId) =>
          findOrFail(
            this.autoresService.findAutor({ _id: autorId }),
            `Autor ${autorId} não encontrado`,
          ),
        ),
      );
      livro.autores = autores.map((aut: any) => aut._id);
    }

    if (updateLivroDto.categorias?.length) {
      const categorias = await Promise.all(
        updateLivroDto.categorias.map((categoriaId) =>
          findOrFail(
            this.categoriasService.findCategoria({ _id: categoriaId }),
            `Categoria ${categoriaId} não encontrada`,
          ),
        ),
      );
      livro.categorias = categorias.map((cat: any) => cat._id);
    }

    if (updateLivroDto.editora) {
      const editora = await findOrFail(
        this.editorasService.findEditora({ _id: updateLivroDto.editora }),
        `Editora ${updateLivroDto.editora} não encontrada`,
      );
      livro.editora = (editora as any)._id;
    }

    return findOrFail(
      this.livroModel
        .findOneAndUpdate(
          livroFilterQuery,
          {
            titulo: updateLivroDto.titulo ?? livro.titulo,
            isbn: updateLivroDto.isbn ?? livro.isbn,
            autores: livro.autores,
            categorias: livro.categorias,
            editora: livro.editora,
          },
          { new: true },
        )
        .exec(),
      'Livro não encontrado para atualização',
    );
  }

  /**
   * Remove de forma definitiva um documento de livro da coleção do MongoDB baseado em um filtro.
   * @param livroFilterQuery Objeto de seleção contendo as propriedades para identificar o livro a ser deletado (ex: { _id: id }).
   * @returns O documento do livro que foi removido da coleção.
   * @throws {BadRequestException} Se o objeto de filtro fornecido estiver vazio ou for inválido.
   * @throws {NotFoundException} Se o documento não for encontrado na coleção para a remoção.
   */
  async deleteLivro(livroFilterQuery: FilterQuery<Livro>): Promise<void> {
    if (!livroFilterQuery || Object.keys(livroFilterQuery).length === 0) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    const exemplaresVinculados = await this.exemplarModel.countDocuments({
      livro: new Types.ObjectId(livroFilterQuery._id),
    });

    if (exemplaresVinculados > 0) {
      throw new ConflictException(
        `Não é possível remover: ${exemplaresVinculados} exemplar(es) vinculado(s) a este livro. Remova esse(s) exemplar(es) antes.`,
      );
    }

    await findOrFail(
      this.livroModel.findOneAndDelete(livroFilterQuery).exec(),
      'Livro não encontrado para remoção',
    );
  }
}
