--
-- PostgreSQL database dump
--

\restrict Nc5iH7P5nMoq51Hy0GbyxC7k2Gre9tTa3546nOGaYBd7237xBRy697k3eQYfOCA

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-05-04 23:50:38

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 17412)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 5106 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 228 (class 1259 OID 17469)
-- Name: autores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.autores (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    nacionalidade character varying(50) NOT NULL
);


ALTER TABLE public.autores OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 17468)
-- Name: autores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.autores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.autores_id_seq OWNER TO postgres;

--
-- TOC entry 5108 (class 0 OID 0)
-- Dependencies: 227
-- Name: autores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.autores_id_seq OWNED BY public.autores.id;


--
-- TOC entry 230 (class 1259 OID 17479)
-- Name: categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias (
    id integer NOT NULL,
    nome character varying(50) NOT NULL,
    descricao character varying(400)
);


ALTER TABLE public.categorias OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 17478)
-- Name: categorias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categorias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categorias_id_seq OWNER TO postgres;

--
-- TOC entry 5109 (class 0 OID 0)
-- Dependencies: 229
-- Name: categorias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categorias_id_seq OWNED BY public.categorias.id;


--
-- TOC entry 224 (class 1259 OID 17447)
-- Name: editoras; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.editoras (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    cidade character varying(100) NOT NULL
);


ALTER TABLE public.editoras OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 17446)
-- Name: editoras_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.editoras_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.editoras_id_seq OWNER TO postgres;

--
-- TOC entry 5110 (class 0 OID 0)
-- Dependencies: 223
-- Name: editoras_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.editoras_id_seq OWNED BY public.editoras.id;


--
-- TOC entry 222 (class 1259 OID 17435)
-- Name: emprestimos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emprestimos (
    id integer NOT NULL,
    data_emprestimo timestamp without time zone DEFAULT now() NOT NULL,
    data_devolucao timestamp without time zone DEFAULT now() NOT NULL,
    usuario_id integer,
    exemplar_id integer,
    ativo boolean CONSTRAINT emprestimos_status_not_null NOT NULL
);


ALTER TABLE public.emprestimos OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 17434)
-- Name: emprestimos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.emprestimos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.emprestimos_id_seq OWNER TO postgres;

--
-- TOC entry 5111 (class 0 OID 0)
-- Dependencies: 221
-- Name: emprestimos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.emprestimos_id_seq OWNED BY public.emprestimos.id;


--
-- TOC entry 226 (class 1259 OID 17457)
-- Name: exemplares; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exemplares (
    id integer NOT NULL,
    codigo_patrimonio integer NOT NULL,
    ano_publicacao integer NOT NULL,
    livro_id integer,
    editora_id integer
);


ALTER TABLE public.exemplares OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 17456)
-- Name: exemplares_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exemplares_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exemplares_id_seq OWNER TO postgres;

--
-- TOC entry 5112 (class 0 OID 0)
-- Dependencies: 225
-- Name: exemplares_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exemplares_id_seq OWNED BY public.exemplares.id;


--
-- TOC entry 232 (class 1259 OID 17488)
-- Name: livros; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.livros (
    id integer NOT NULL,
    titulo character varying(150) NOT NULL,
    isbn character varying NOT NULL
);


ALTER TABLE public.livros OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 17499)
-- Name: livros_autores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.livros_autores (
    livro_id integer NOT NULL,
    autor_id integer NOT NULL
);


ALTER TABLE public.livros_autores OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 17508)
-- Name: livros_categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.livros_categorias (
    livro_id integer NOT NULL,
    categoria_id integer NOT NULL
);


ALTER TABLE public.livros_categorias OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 17487)
-- Name: livros_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.livros_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.livros_id_seq OWNER TO postgres;

--
-- TOC entry 5113 (class 0 OID 0)
-- Dependencies: 231
-- Name: livros_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.livros_id_seq OWNED BY public.livros.id;


--
-- TOC entry 220 (class 1259 OID 17420)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    criado_em timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 17419)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 5114 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 4901 (class 2604 OID 17472)
-- Name: autores id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autores ALTER COLUMN id SET DEFAULT nextval('public.autores_id_seq'::regclass);


--
-- TOC entry 4902 (class 2604 OID 17482)
-- Name: categorias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias ALTER COLUMN id SET DEFAULT nextval('public.categorias_id_seq'::regclass);


--
-- TOC entry 4899 (class 2604 OID 17450)
-- Name: editoras id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.editoras ALTER COLUMN id SET DEFAULT nextval('public.editoras_id_seq'::regclass);


--
-- TOC entry 4896 (class 2604 OID 17438)
-- Name: emprestimos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emprestimos ALTER COLUMN id SET DEFAULT nextval('public.emprestimos_id_seq'::regclass);


--
-- TOC entry 4900 (class 2604 OID 17460)
-- Name: exemplares id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exemplares ALTER COLUMN id SET DEFAULT nextval('public.exemplares_id_seq'::regclass);


--
-- TOC entry 4903 (class 2604 OID 17491)
-- Name: livros id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livros ALTER COLUMN id SET DEFAULT nextval('public.livros_id_seq'::regclass);


--
-- TOC entry 4894 (class 2604 OID 17423)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 5094 (class 0 OID 17469)
-- Dependencies: 228
-- Data for Name: autores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.autores (id, nome, nacionalidade) FROM stdin;
1	Edgar Allan Poe	Estados Unidos
2	Machado de Assis	Brasil
5	J.R.R. Tolkien	África do Sul
6	Franz Kafka	República Tcheca
7	Tolstói	Rússia
8	Dostoiévski	Rússia
9	Jorge Amado	Brasil
10	Cruz e Sousa	Brasil
11	José de alencar	Brasil
12	John Steinbeck	Estados Unidos
4	George Orwell	Reino Unido
13	Desconhecido	Desconhecido
14	David Goggins	Estados Unidos
15	David Halliday	Estados Unidos
16	Robert Resnick	Estados Unidos
\.


--
-- TOC entry 5096 (class 0 OID 17479)
-- Dependencies: 230
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categorias (id, nome, descricao) FROM stdin;
2	Romance	Narrativas longas em prosa com diversos conflitos e desenvolvimento profundo de personagens
4	Fantasia	Histórias que envolvem magia, mundos imaginários e elementos sobrenaturais.
11	Ficção Científica	Explora tecnologia, futuro, viagens espaciais ou descobertas científicas.
12	Suspense	Focados em mistérios, crimes, investigações e tensão constante.
14	Terror	Obras que visam causar medo, susto e tensão no leitor.
15	Distopia	Retrata sociedades futuristas opressoras ou pós-apocalípticas.
16	Aventura	Foca em jornadas, perigos e ação intensa
17	Biografia	Narra a vida de uma pessoa real
18	Religioso	Textos focados em doutrinas, fé e espiritualidade
19	Contos	Narrativas curtas, focadas em um único conflito
20	Poesia	Textos em versos que expressam emoções e sentimentos
21	Autoajuda	Livros focados em desenvolvimento pessoal, psicologia prática e melhoria de vida.
22	Técnico e Científico	Obras destinadas ao estudo, pesquisa e aprofundamento em áreas específicas do conhecimento
\.


--
-- TOC entry 5090 (class 0 OID 17447)
-- Dependencies: 224
-- Data for Name: editoras; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.editoras (id, nome, cidade) FROM stdin;
2	Abril	São Paulo
4	Ipê	Fortaleza
1	Canarinho	Joinville
5	Martin Claret	São Paulo
6	Sextante	Brasília
7	Harper Collins	Rio de Janeiro
8	Editora do Exército	Rio de Janeiro
9	Editora Mapa	São Paulo
10	Sagrado	São Paulo
11	Papel	Goiânia
\.


--
-- TOC entry 5088 (class 0 OID 17435)
-- Dependencies: 222
-- Data for Name: emprestimos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.emprestimos (id, data_emprestimo, data_devolucao, usuario_id, exemplar_id, ativo) FROM stdin;
15	2026-04-25 21:00:00	2026-06-17 21:00:00	4	11	t
16	2026-04-25 21:00:00	2026-06-09 21:00:00	5	14	t
14	2026-04-25 21:00:00	2026-06-16 21:00:00	3	7	f
17	2026-04-25 21:00:00	2026-05-14 21:00:00	5	18	t
18	2026-04-25 21:00:00	2026-05-06 21:00:00	1	16	t
19	2026-04-25 21:00:00	2026-04-29 21:00:00	3	7	t
20	2026-04-25 21:00:00	2026-05-14 21:00:00	8	13	f
23	2026-05-02 21:00:00	2026-05-04 21:00:00	3	22	t
21	2026-04-25 21:00:00	2026-05-12 21:00:00	3	21	f
24	2026-05-02 21:00:00	2026-05-29 21:00:00	4	23	t
\.


--
-- TOC entry 5092 (class 0 OID 17457)
-- Dependencies: 226
-- Data for Name: exemplares; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exemplares (id, codigo_patrimonio, ano_publicacao, livro_id, editora_id) FROM stdin;
7	1001	2014	7	2
8	1007	2003	10	5
9	1100	2006	8	4
10	1101	2006	8	4
11	10102	2006	8	4
12	1050	2026	26	6
13	1090	2017	15	10
14	1085	2025	15	7
15	1004	1998	21	7
16	1068	1973	22	4
17	1290	2010	19	8
18	1212	2012	9	2
19	3198	2020	20	9
20	1313	2020	8	1
21	4433	2007	7	2
22	1569	2013	25	5
23	5948	1993	7	11
24	6957	2003	13	1
25	2223	2006	20	4
26	1625	2024	26	4
\.


--
-- TOC entry 5098 (class 0 OID 17488)
-- Dependencies: 232
-- Data for Name: livros; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.livros (id, titulo, isbn) FROM stdin;
7	1984	978-85-3591-484-9
8	Dom Casmurro	725-90-9365-874-2
9	NEGRO	690-85-4894-333-2
10	O Gato Preto e Outras Histórias	978-0-111-22233-1
11	O Corvo e Outros Poemas	978-0-222-33344-2
12	Os Assassinatos na Rua Morgue	978-0-333-44455-3
13	Papéis Avulsos	978-1-555-66677-5
14	A Revolução dos Bichos	978-2-777-88899-7
15	Bíblia Sagrada	978-8-00-111112-7
16	O Guarani	978-8-01-000001-3
17	Crime e Castigo	978-8-00-777771-0
18	A metamorfose	978-8-00-555551-2
19	Capitães da Areia	978-8-00-888881-9
20	Nada pode me parar	978-8-00-666662-8
21	Guerra e Paz	978-8-00-666661-1
22	Senhor dos Anéis	978-8-00-444441-3
23	O Hobbit	978-8-00-444442-0
24	Ratos e Homens	978-8-01-000002-0
25	As Mil e Uma Noites	847-5-938-8492-3
26	Fundamentos da Física	978-67-8512-333-9
\.


--
-- TOC entry 5099 (class 0 OID 17499)
-- Dependencies: 233
-- Data for Name: livros_autores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.livros_autores (livro_id, autor_id) FROM stdin;
7	4
8	2
9	10
10	1
11	1
12	1
13	2
14	4
15	13
16	11
17	8
18	6
19	9
20	14
21	7
22	5
23	5
24	12
25	13
26	15
26	16
\.


--
-- TOC entry 5100 (class 0 OID 17508)
-- Dependencies: 234
-- Data for Name: livros_categorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.livros_categorias (livro_id, categoria_id) FROM stdin;
7	15
7	12
8	2
9	20
10	19
10	14
10	12
11	20
12	12
13	19
14	15
15	18
16	2
16	16
17	2
17	12
18	4
18	19
19	2
19	16
20	21
20	17
21	2
22	4
22	16
23	4
23	16
24	19
24	16
25	2
25	4
25	16
26	22
\.


--
-- TOC entry 5086 (class 0 OID 17420)
-- Dependencies: 220
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nome, email, criado_em) FROM stdin;
1	João Pedro	joaopedro@gmail.com	2026-04-21 12:03:09.262081
3	Pedro	pedro@admin.com	2026-04-21 14:50:28.927816
4	Júlia Nascimento	julia.nascimento12@gmail.com	2026-04-26 14:41:15.994712
5	Enzo da Silva	enzosilva@gmail.com	2026-04-26 14:41:31.871583
6	Maria Luísa Carvalho	luisamariacarvalhooo@gmail.com	2026-04-26 14:41:57.87512
7	Luís Pontes	lpontes@gmail.com	2026-04-26 14:42:14.758434
8	Geórgia Cardoso	georgiiacs@gmail.com	2026-04-26 14:42:28.679924
9	Beto Oliveira	beto@hotmail.com	2026-04-26 14:42:55.437168
\.


--
-- TOC entry 5115 (class 0 OID 0)
-- Dependencies: 227
-- Name: autores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.autores_id_seq', 16, true);


--
-- TOC entry 5116 (class 0 OID 0)
-- Dependencies: 229
-- Name: categorias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorias_id_seq', 22, true);


--
-- TOC entry 5117 (class 0 OID 0)
-- Dependencies: 223
-- Name: editoras_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.editoras_id_seq', 11, true);


--
-- TOC entry 5118 (class 0 OID 0)
-- Dependencies: 221
-- Name: emprestimos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.emprestimos_id_seq', 24, true);


--
-- TOC entry 5119 (class 0 OID 0)
-- Dependencies: 225
-- Name: exemplares_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exemplares_id_seq', 26, true);


--
-- TOC entry 5120 (class 0 OID 0)
-- Dependencies: 231
-- Name: livros_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.livros_id_seq', 26, true);


--
-- TOC entry 5121 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 9, true);


--
-- TOC entry 4917 (class 2606 OID 17486)
-- Name: categorias PK_3886a26251605c571c6b4f861fe; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT "PK_3886a26251605c571c6b4f861fe" PRIMARY KEY (id);


--
-- TOC entry 4929 (class 2606 OID 17514)
-- Name: livros_categorias PK_4bc17bc005dbd8b4b9df232fbd3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livros_categorias
    ADD CONSTRAINT "PK_4bc17bc005dbd8b4b9df232fbd3" PRIMARY KEY (livro_id, categoria_id);


--
-- TOC entry 4907 (class 2606 OID 17445)
-- Name: emprestimos PK_560d61bedea3b4e5926b39766b7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emprestimos
    ADD CONSTRAINT "PK_560d61bedea3b4e5926b39766b7" PRIMARY KEY (id);


--
-- TOC entry 4919 (class 2606 OID 17496)
-- Name: livros PK_69daba516e6b0dd45f49c4d8d52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livros
    ADD CONSTRAINT "PK_69daba516e6b0dd45f49c4d8d52" PRIMARY KEY (id);


--
-- TOC entry 4915 (class 2606 OID 17477)
-- Name: autores PK_8973029e8bb26f72a4738afc834; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autores
    ADD CONSTRAINT "PK_8973029e8bb26f72a4738afc834" PRIMARY KEY (id);


--
-- TOC entry 4909 (class 2606 OID 17455)
-- Name: editoras PK_9974cc858c97fb880c59f85e183; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.editoras
    ADD CONSTRAINT "PK_9974cc858c97fb880c59f85e183" PRIMARY KEY (id);


--
-- TOC entry 4905 (class 2606 OID 17433)
-- Name: usuarios PK_d7281c63c176e152e4c531594a8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY (id);


--
-- TOC entry 4925 (class 2606 OID 17505)
-- Name: livros_autores PK_e2b9cac9018697fd28093e3b547; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livros_autores
    ADD CONSTRAINT "PK_e2b9cac9018697fd28093e3b547" PRIMARY KEY (livro_id, autor_id);


--
-- TOC entry 4911 (class 2606 OID 17465)
-- Name: exemplares PK_f4dee0cd8e094ef06eb62bd285b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exemplares
    ADD CONSTRAINT "PK_f4dee0cd8e094ef06eb62bd285b" PRIMARY KEY (id);


--
-- TOC entry 4921 (class 2606 OID 25851)
-- Name: livros UQ_af619d4f3297f10337117d0738f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livros
    ADD CONSTRAINT "UQ_af619d4f3297f10337117d0738f" UNIQUE (isbn);


--
-- TOC entry 4913 (class 2606 OID 17467)
-- Name: exemplares UQ_b66abc07933f6eb224632813787; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exemplares
    ADD CONSTRAINT "UQ_b66abc07933f6eb224632813787" UNIQUE (codigo_patrimonio);


--
-- TOC entry 4922 (class 1259 OID 17506)
-- Name: IDX_36909f498c32dd46379a60087b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_36909f498c32dd46379a60087b" ON public.livros_autores USING btree (livro_id);


--
-- TOC entry 4926 (class 1259 OID 17516)
-- Name: IDX_6e8ef8ded84e7fcf65b296064f; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_6e8ef8ded84e7fcf65b296064f" ON public.livros_categorias USING btree (categoria_id);


--
-- TOC entry 4923 (class 1259 OID 17507)
-- Name: IDX_8e7723714b350fe426375e8c22; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_8e7723714b350fe426375e8c22" ON public.livros_autores USING btree (autor_id);


--
-- TOC entry 4927 (class 1259 OID 17515)
-- Name: IDX_a80c861aff274ed430a526ed0c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_a80c861aff274ed430a526ed0c" ON public.livros_categorias USING btree (livro_id);


--
-- TOC entry 4934 (class 2606 OID 17537)
-- Name: livros_autores FK_36909f498c32dd46379a60087b5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livros_autores
    ADD CONSTRAINT "FK_36909f498c32dd46379a60087b5" FOREIGN KEY (livro_id) REFERENCES public.livros(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4936 (class 2606 OID 17552)
-- Name: livros_categorias FK_6e8ef8ded84e7fcf65b296064f8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livros_categorias
    ADD CONSTRAINT "FK_6e8ef8ded84e7fcf65b296064f8" FOREIGN KEY (categoria_id) REFERENCES public.categorias(id);


--
-- TOC entry 4930 (class 2606 OID 17522)
-- Name: emprestimos FK_72c917af32e98de2d46c38dd12f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emprestimos
    ADD CONSTRAINT "FK_72c917af32e98de2d46c38dd12f" FOREIGN KEY (exemplar_id) REFERENCES public.exemplares(id);


--
-- TOC entry 4935 (class 2606 OID 17542)
-- Name: livros_autores FK_8e7723714b350fe426375e8c221; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livros_autores
    ADD CONSTRAINT "FK_8e7723714b350fe426375e8c221" FOREIGN KEY (autor_id) REFERENCES public.autores(id);


--
-- TOC entry 4931 (class 2606 OID 17517)
-- Name: emprestimos FK_a5dad21409edde2a7fd6ea669e6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emprestimos
    ADD CONSTRAINT "FK_a5dad21409edde2a7fd6ea669e6" FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- TOC entry 4937 (class 2606 OID 17547)
-- Name: livros_categorias FK_a80c861aff274ed430a526ed0c0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livros_categorias
    ADD CONSTRAINT "FK_a80c861aff274ed430a526ed0c0" FOREIGN KEY (livro_id) REFERENCES public.livros(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4932 (class 2606 OID 17532)
-- Name: exemplares FK_effa0ff3a2e0be908799addec00; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exemplares
    ADD CONSTRAINT "FK_effa0ff3a2e0be908799addec00" FOREIGN KEY (editora_id) REFERENCES public.editoras(id);


--
-- TOC entry 4933 (class 2606 OID 17527)
-- Name: exemplares FK_f0b03ec015094caa4d6f142d672; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exemplares
    ADD CONSTRAINT "FK_f0b03ec015094caa4d6f142d672" FOREIGN KEY (livro_id) REFERENCES public.livros(id);


--
-- TOC entry 5107 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2026-05-04 23:50:38

--
-- PostgreSQL database dump complete
--

\unrestrict Nc5iH7P5nMoq51Hy0GbyxC7k2Gre9tTa3546nOGaYBd7237xBRy697k3eQYfOCA

