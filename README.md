# Projeto final - Padrões Web, HTML, CSS e Javascript

## Introdução

Este projeto tem relação ao item 3 da atividade final da disciplina de Padrões Web, HTML, CSS e Javascript do curso de pós-graduação da PUC Minas. Consiste na implementação de uma pequena aplicação que permite fazer desenhos utilizando o Canvas, armazená-los em um servidor e posteriormente carregá-los para visualização e/ou edição. Os componentes visuais da aplicação foram feitos utilizando a biblioteca Bootstrap e a comunicação para o CRUD dos desenhos foi feita utilizando requisições HTTP por meio do Ajax.

Como o lado servidor não foi parte do escopo da disciplina, nada foi implementado explicitamente neste sentido. Porém, de modo a disponibilizar uma maneira de gerenciar as requisições solicitadas pelo frontend, o projeto utiliza uma API REST falsa. Esta API é implementada por meio do uso do [JSON Server](https://github.com/typicode/json-server) que lê o arquivo [db.json](https://github.com/RicardoGPP/paw-class6-task1-ajaxcanvas/blob/main/db.json) para criar as rotas que permitirão a interação (GET, POST, PUT, DELETE...) com os dados.

## Preparação

Antes de iniciar a aplicação, é necessário preparar o JSON Server. Para isto, siga os seguintes passos:

Instale o JSON Server:

```
npm install -g json-server
```

Inicie o JSON Server apontando para o arquivo db.json:

```bash
json-server --watch db.json
```

Com a API REST falsa de pé, basta acessar o arquivo [index.html](https://github.com/RicardoGPP/paw-class6-task1-ajaxcanvas/blob/main/index.html) com um navegador de sua preferência e a aplicação estará disponível para uso.

## Como funciona

O arquivo [script.js](https://github.com/RicardoGPP/paw-class6-task1-ajaxcanvas/blob/main/script.js) implementa o padrão de projeto MVC para separação de responsabilidades, controlando desde o registro de todos os listeners até os dados para renderização e como trafegam dentro da aplicação.

Já o arquivo [service.js](https://github.com/RicardoGPP/paw-class6-task1-ajaxcanvas/blob/main/service.js) implementa uma classe responsável pelas requisições HTTP ao servidor, simplificando as mensagens e transformando-as em Promises ao invés de mantê-las no conceito puro de callbacks do XMLHttpRequest.

O método de serialização dos desenhos feitos no componente Canvas foi o da transformação de seu conteúdo em uma representação textual denominada **Data URL**. A deserialização ocorre através da conversão dos dados textuais em uma imagem e posteriormente sua renderização na matriz de pixels do Canvas. Esta tratativa textual se fez necessária especialmente pela limitação do servidor (API falsa do [JSON Server](https://github.com/typicode/json-server)), que como implementa uma base de dados JSON, exige que os dados seja armazenados textualmente também.

Por fim, há um arquivo [style.css](https://github.com/RicardoGPP/paw-class6-task1-ajaxcanvas/blob/main/style.css) que tem por finalidade estilizar o componente Canvas, uma vez que o Boostrap não possui ferramentas que compatibilizem a quantidade de pixels interno do componente em detrimento de seu tamanho na página.
