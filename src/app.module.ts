import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
// import { LivrosModule } from './livros/livros.module';
// import { AutoresModule } from './autores/autores.module';
import { UsuariosModule } from './usuarios/usuarios.module';
// import { ExemplaresModule } from './exemplares/exemplares.module';
// import { EmprestimosModule } from './emprestimos/emprestimos.module';
// import { EditorasModule } from './editoras/editoras.module';
// import { CategoriasModule } from './categorias/categorias.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://admin:acervolivro@localhost:27017/acervo?authSource=admin',
    ),
    // LivrosModule,
    // AutoresModule,
    UsuariosModule,
    // EmprestimosModule,
    // ExemplaresModule,
    // EditorasModule,
    // CategoriasModule,
  ],
})
export class AppModule {}
