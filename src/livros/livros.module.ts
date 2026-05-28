// import { Module } from '@nestjs/common';
// import { Livros } from './entities/livros.entity';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { LivrosController } from './livros.controller';
// import { LivrosService } from './livros.service';
// import { Editoras } from '../editoras/entities/editoras.entity';
// import { Autores } from '../autores/entities/autores.entity';
// import { Categorias } from '../categorias/entities/categorias.entity';
// import { AutoresModule } from '../autores/autores.module';
// import { CategoriasModule } from '../categorias/categorias.module';
// import { EditorasModule } from '../editoras/editoras.module';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([Livros, Editoras, Autores, Categorias]),
//     EditorasModule,
//     AutoresModule,
//     CategoriasModule,
//   ],
//   controllers: [LivrosController],
//   providers: [LivrosService],
//   exports: [LivrosService],
// })
// export class LivrosModule {}
