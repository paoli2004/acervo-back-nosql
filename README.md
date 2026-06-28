<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="80" style="margin-right: 20px;" />
  <img src="https://s2.glbimg.com/nXvJL6pASCukU-CT1l_h6j2l_Qc=/300x225/s.glbimg.com/jo/g1/f/original/2015/04/06/udesc-novo_1.jpg" width="80" />
</p>

<p align="center">
  Trabalho de Ban II - Projeto back-end desenvolvido com NestJS
</p>

## 📚 Acervo de Livros

Sistema back-end para gerenciamento de acervo de livros, desenvolvido com NestJS, que permite o controle de autores, categorias, editoras, usuários e exemplares, além da gestão de empréstimos.

O sistema garante a organização e rastreabilidade dos livros disponíveis, possibilitando o controle de disponibilidade de exemplares e validações no processo de empréstimo.

A aplicação segue uma arquitetura modular, com separação clara de responsabilidades entre controllers, services, DTOs e entities.

---

## 🧾 Pré-requisitos

* Node.js (versão recomendada: >= 18)
* Yarn
* PostgreSQL

---

## 💻 SO utilizada

* WSL Ubuntu

---

## 🛠️ Tecnologias utilizadas

* Back-end: Node.js + TypeScript (NestJS)
* Front-end: React *(em repositório separado)*
* Banco de dados: PostgreSQL

---

## ▶️ Iniciando o projeto

```bash
# instalar dependências
yarn install
```

---

## 🚀 Executando o projeto

```bash
# desenvolvimento
yarn start

# modo watch
yarn start:dev

# produção
yarn start:prod
```

💡 Alternativamente, você pode rodar sem instalar o NestJS globalmente:

```bash
npx nest start
```

---

## ⚙️ Configuração do ambiente (.env)

O projeto já contém um arquivo de exemplo chamado `.env_copy`.

```bash
# criar arquivo de ambiente
cp .env_copy .env
```

---

## 🗄️ Configuração do banco de dados

Edite o arquivo `.env`:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=acervo_livro
DB_USER=postgres
DB_PASS=postgres
```

⚠️ Ajuste conforme sua instalação do PostgreSQL.

---

## 🏗️ Criação do banco de dados

```bash
# acessar postgres
sudo -u postgres psql

# criar banco
CREATE DATABASE acervo_livro;
```

---

## 🔄 Sincronização do banco

O projeto utiliza o TypeORM com:

```ts
synchronize: true
```

✔️ As tabelas são criadas automaticamente ao iniciar a aplicação.

---

## 📜 Scripts disponíveis

```bash
yarn start        # inicia aplicação
yarn start:dev    # desenvolvimento
yarn start:prod   # produção
yarn build        # build do projeto
```

---

## 🧱 Estrutura do projeto

```bash
src/
 ├── autores/
 │    ├── dto/
 │    ├── schemas/
 │    ├── autores.controller.ts
 │    ├── autores.service.ts
 │    └── autores.module.ts
 │
 ├── categorias/
 ├── editoras/
 ├── emprestimos/
 ├── exemplares/
 ├── livros/
 ├── usuarios/
 │
 ├── app.controller.ts
 ├── app.service.ts
 ├── app.module.ts
 └── main.ts
```

📌 O projeto segue uma arquitetura modular baseada no NestJS, onde cada domínio possui seu próprio módulo contendo:

* **Controller** → responsável pelas rotas da API
* **Service** → regras de negócio
* **DTOs** → validação e transferência de dados
* **Entities** → mapeamento com o banco de dados

---

## Diagrama disponibilizado para análise

https://dbdiagram.io/d/69cf05f678c6c4bc7ad17c24
