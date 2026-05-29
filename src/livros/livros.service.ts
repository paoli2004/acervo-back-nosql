import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
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
   * Executa uma Promise que busca uma entidade e lança erro caso não encontre.
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

  /**
   * Retorna um livro.
   * @param livroFilterQuery Objeto de filtro para encontrar o livro (ex: { _id: id }).
   * @returns Livro encontrado.
   */
  async findLivro(
    livroFilterQuery: FilterQuery<Livro>,
  ): Promise<LivroDocument> {
    const livro = await this.findOrFail(
      this.livroModel
        .findOne(livroFilterQuery)
        .populate('autores')
        .populate('categorias')
        .populate('editora')
        .exec(),
      'Livro não encontrado',
    );

    return livro;
  }

  /**
   * Realiza uma busca avançada e dinâmica de livros baseada em filtros.
   * Varre a coleção de livros aplicando filtros opcionais e verifica na coleção
   * de exemplares se existe alguma cópia física disponível para empréstimo.
   *
   * @param params Objeto contendo os critérios de busca opcionais.
   * @param params.titulo Termo para busca parcial no título do livro (Case-Insensitive).
   * @param params.autor_id ID alfanumérico (ObjectId) do autor para filtragem.
   * @param params.categoria_id ID alfanumérico (ObjectId) da categoria para filtragem.
   * @param params.onlyDisponiveis Se true, retorna apenas livros que possuem exemplares disponíveis.
   * @returns Array de objetos customizados contendo os dados do livro e o status de disponibilidade.
   */
  async buscarAvancado(params: {
    titulo?: string;
    autor_id?: string;
    categoria_id?: string;
    onlyDisponiveis?: boolean;
  }): Promise<any[]> {
    const query: any = {};

    if (params.titulo) query.titulo = { $regex: params.titulo, $options: 'i' };
    if (params.autor_id) query.autores = params.autor_id;
    if (params.categoria_id) query.categorias = params.categoria_id;

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
   * Retorna uma lista de livros cadastrados, permitindo aplicar filtros opcionais.
   * @param livroFilterQuery Filtro opcional de busca (ex: { titulo: 'Dom Casmurro' }). Se omitido, traz todos.
   * @returns Array de livros.
   */
  async findAllLivros(livroFilterQuery?: FilterQuery<Livro>): Promise<Livro[]> {
    return this.livroModel
      .find(livroFilterQuery)
      .populate('autores')
      .populate('categorias')
      .populate('editora')
      .exec();
  }

  /**
   * Cria um novo livro no sistema após validar o ISBN e a existência das categorias, autores e editora.
   * @param createLivroDto Dados para criação do livro, incluindo arrays de IDs de categorias e autores.
   * @returns Documento do livro recém-criado.
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
        this.findOrFail(
          this.categoriasService.findCategoria({ _id: categoriaId }),
          `Categoria ${categoriaId} não encontrada`,
        ),
      ),
    );

    const autores = createLivroDto.autores?.length
      ? await Promise.all(
          createLivroDto.autores.map((autorId) =>
            this.findOrFail(
              this.autoresService.findAutor({ _id: autorId }),
              `Autor ${autorId} não encontrado`,
            ),
          ),
        )
      : [];

    const editora = await this.findOrFail(
      this.editorasService.findEditora({ _id: createLivroDto.editora }),
      `Editora ${createLivroDto.editora} não encontrada`,
    );

    const newBook = await this.livroModel.create({
      titulo: createLivroDto.titulo,
      isbn: createLivroDto.isbn,
      categorias: categorias.map((cat: any) => cat._id),
      autores: autores.map((aut: any) => aut._id),
      editora: (editora as any)._id,
    });

    return newBook;
  }

  /**
   * Atualiza um livro de forma parcial e dinâmica com base em um filtro de busca.
   * Valida regras de negócio como duplicidade de ISBN e existência de autores/categorias/editora.
   * @param livroFilterQuery Filtro para encontrar o livro que será atualizado.
   * @param updateLivroDto Dados com as alterações parciais do livro.
   * @returns Documento do livro já atualizado.
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
          this.findOrFail(
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
          this.findOrFail(
            this.categoriasService.findCategoria({ _id: categoriaId }),
            `Categoria ${categoriaId} não encontrada`,
          ),
        ),
      );
      livro.categorias = categorias.map((cat: any) => cat._id);
    }

    if (updateLivroDto.editora) {
      const editora = await this.findOrFail(
        this.editorasService.findEditora({ _id: updateLivroDto.editora }),
        `Editora ${updateLivroDto.editora} não encontrada`,
      );
      livro.editora = (editora as any)._id;
    }

    return this.findOrFail(
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
   * Remove um livro.
   * @param livroFilterQuery Objeto de filtro para identificar o livro a ser removido (ex: { _id: id }).
   * @returns Promise<void>.
   */
  async deleteLivro(livroFilterQuery: FilterQuery<Livro>): Promise<void> {
    if (!livroFilterQuery || Object.keys(livroFilterQuery).length === 0) {
      throw new BadRequestException('Filtro de busca inválido ou vazio');
    }

    await this.findOrFail(
      this.livroModel.findOneAndDelete(livroFilterQuery).exec(),
      'Livro não encontrado para remoção',
    );
  }
}
