Sabores de Pedro II 

Aplicativo mobile de receitas tradicionais do município de **Pedro II – Piauí**, desenvolvido com **React Native + Expo** e utilizando **Firebase** como backend.

O projeto tem como objetivo valorizar, preservar e divulgar a culinária local por meio de uma plataforma digital simples e acessível.


Funcionalidades

- Visualização de receitas típicas de Pedro II – PI;
- Cadastro e autenticação de usuários;
- Cadastro, edição e exclusão de receitas por usuários cadastrados;
- Organização das receitas por categorias;
- Busca por nome ou ingrediente;
- Favoritar receitas;
- Avaliação e comentários;
- Upload de imagens das receitas;
- Área administrativa para moderação de conteúdo.


Perfis de Usuário

- **Visitante**: pode apenas visualizar as receitas;
- **Usuário Cadastrado**: pode cadastrar, editar e excluir suas próprias receitas, além de avaliar e comentar;
- **Administrador**: gerencia usuários e conteúdos do sistema.


Tecnologias Utilizadas

Frontend

- React Native
- Expo
- JavaScript / TypeScript

Backend (Firebase)

- Firebase Authentication
- Firebase Firestore (Banco de Dados NoSQL)
- Firebase Storage (Armazenamento de imagens)


Estrutura do Banco de Dados (Firestore)

Coleção `usuarios`

- `id`
- `nome`
- `email`
- `tipo` (visitante, cadastrado, administrador)
- `dataCadastro`

Coleção `receitas`

- `id`
- `titulo`
- `descricao`
- `ingredientes`
- `modoPreparo`
- `tempoPreparo`
- `origemCultural`
- `autorId`
- `categoriaId`
- `imagemUrl`

Coleção `categorias`

- `id`
- `nome`

Coleção `avaliacoes`

- `id`
- `nota`
- `comentario`
- `usuarioId`
- `receitaId`


Regras Básicas de Negócio

- Apenas usuários autenticados podem cadastrar receitas;
- Cada usuário pode editar ou excluir apenas suas próprias receitas;
- Visitantes não podem cadastrar conteúdo;
- O administrador pode moderar qualquer receita.


Como Executar o Projeto

Pré-requisitos

- Node.js instalado;
- Expo CLI;
- Conta no Firebase.

Passos

1. Clone o repositório:

   ```bash
   git clone https://github.com/IsaquePFerreira/sabores-de-pedro-ii
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure o Firebase:

   - Crie um projeto no Firebase;
   - Ative Authentication, Firestore e Storage;
   - Configure as credenciais no projeto.

4. Execute o projeto:

   ```bash
   expo start
   ```

Contexto Acadêmico

Projeto desenvolvido para a disciplina **Programação para Dispositivos Móveis**, do curso de **Tecnologia em Análise e Desenvolvimento de Sistemas**, do **Instituto Federal do Piauí – Campus Pedro II**.

