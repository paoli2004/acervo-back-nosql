<p align="center">
  <img src="https://nestjs.com/logo.svg" width="80" />
  <img src="https://s2.glbimg.com/nXvJL6pASCukU-CT1l_h6j2l_Qc=/300x225/s.glbimg.com/jo/g1/f/original/2015/04/06/udesc-novo_1.jpg" width="80" />
</p>

<p align="center">
  Trabalho de Ban II - Projeto back-end desenvolvido com NestJS (Migrado para NoSQL)
</p>

## 📚 Acervo de Livros (Versão NoSQL)

Sistema back-end para gerenciamento de acervo de livros, desenvolvido com NestJS, que permite o controle de autores, categorias, editoras, usuários e exemplares, além da gestão de empréstimos.

A aplicação foi migrada de um modelo relacional (SQL) para o modelo orientado a documentos (**NoSQL**), utilizando o **MongoDB** para otimizar as consultas profundamente aninhadas (como o histórico e detalhes de empréstimos) e garantir consistência na disponibilidade física de exemplares através de propriedades embutidas.

A aplicação segue uma arquitetura modular, com separação clara de responsabilidades entre controllers, services, DTOs e schemas.

---

## 🧾 Pré-requisitos

* Node.js (versão recomendada: >= 18)
* Yarn
* MongoDB (Instalado localmente)

---

## 💻 SO utilizada

* WSL Ubuntu

---

## 🛠️ Tecnologias utilizadas

* Back-end: Node.js + TypeScript (NestJS)
* Front-end: React *(em repositório separado)*
* Banco de dados: MongoDB (via Mongoose)

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

# modo watch (desenvolvimento ativo)
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

Edite o arquivo `.env` inserindo a URI de conexão com a sua instância do MongoDB:

```env
PORT=3000

# URI do MongoDB (ajuste se estiver usando credenciais ou Atlas)
MONGO_URI=mongodb://localhost:27017/acervo_livro

```
--- 

## 🐳 Inicialização com Docker & MongoDB Compass

Para rodar o banco de dados de forma isolada e rápida sem precisar instalar o MongoDB nativamente, utilizamos o Docker.

### 1. Subindo o Banco com Docker
Se você já possui um arquivo `docker-compose.yml`, execute:
```bash
docker-compose up -d

```

Caso queira subir o container diretamente via terminal usando a imagem oficial, execute o comando abaixo no seu WSL Ubuntu:

```bash
docker run -d --name mongo-acervo -p 27017:27017 -v mongo_data:/data/db mongo:latest

```

*(`-v mongo_data:/data/db` garante que os livros cadastrados não sumam quando o container parar).*

### 2. Conectando no MongoDB Compass

O **MongoDB Compass** é a interface gráfica oficial para visualizar suas coleções. Para se conectar ao banco do projeto:

1. Abra o MongoDB Compass.
2. No campo **URI** ou **Connection String**, insira exatamente:
```text
mongodb://localhost:27017/acervo_livro

```
3. Clique em **Connect**.

Assim que você iniciar a aplicação NestJS (`yarn start:dev`), as coleções `autores`, `livros`, `emprestimos`, etc., aparecerão automaticamente dentro do Compass para você analisar.


---

## 🔄 Sincronização e Coleções

O projeto utiliza o **Mongoose** como ODM.

✔️ As coleções (*collections*) e seus respectivos índices são criados e mapeados automaticamente no MongoDB assim que a aplicação é inicializada, eliminando a necessidade de scripts de migração manuais.

---

## 📜 Scripts disponíveis

```bash
yarn start        # inicia aplicação
yarn start:dev    # desenvolvimento em modo watch
yarn start:prod   # produção
yarn build        # gera o build em javascript compilado

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
 ├── common/
 │    └── utils/
 │         └── query.utils.ts
 │
 ├── app.controller.ts
 ├── app.service.ts
 ├── app.module.ts
 └── main.ts

```

📌 O projeto segue uma arquitetura modular baseada no NestJS, onde cada domínio possui seu próprio módulo contendo:

* **Controller** → responsável pelas rotas da API e recepção dos dados.
* **Service** → regras de negócio, persistência assíncrona e consultas avançadas.
* **DTOs** → objetos de transferência de dados e regras de validação física (`class-validator`).
* **Schemas** → mapeamento e modelagem de documentos do MongoDB usando Decorators do Mongoose.
