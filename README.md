# File Organizer API - Node.js

[![Node.js](https://img.shields.io/badge/Node.js-20+-green?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue?logo=express&logoColor=white)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: Ativo](https://img.shields.io/badge/Status-Ativo-brightgreen)](https://github.com/[seu-usuario]/file-organizer-api)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

Uma **API RESTful simples e poderosa** em Node.js que organiza automaticamente arquivos em uma pasta (incluindo subpastas) por tipo/extensão.  
Perfeito para limpar Downloads, Documentos, Fotos bagunçadas ou qualquer diretório cheio de arquivos misturados.

### ✨ Funcionalidades
- Separa arquivos em categorias: `images`, `documents`, `audio`, `videos`, `archives`, `code`, `executables`, `others`
- Suporte completo a **subpastas** (recursivo) — mantém a estrutura relativa ao mover
- Processamento **assíncrono e paralelo** (Promise.all + fs.promises) → rápido mesmo em pastas grandes
- Segurança reforçada: normalização de caminhos, restrição opcional a raiz permitida (ex: só Downloads)
- Tratamento de erros parcial (continua se um arquivo falhar) + relatório de erros
- Endpoint único e simples: `POST /organize`

### 🚀 Instalação Rápida

1. Clone o repositório
   ```bash
   git clone https://github.com/[seu-usuario]/file-organizer-api.git
   cd file-organizer-api
   
2. Instale depêndencias
   ```bash
   npm install
   
3. (Opcional) Configure a raiz permitida no código (em ALLOWED_ROOT) para maior segurança
4. Rode a API
   ```bash
    node server.js
   ```
   API disponível em: http://localhost:3000

### 📡 Uso (Exemplo com curl ou Postman)
Requisição:
```bash
  curl -X POST http://localhost:3000/organize \
  -H "Content-Type: application/json" \
  -d '{"folderPath": "/Users/[seu-usuario]/Downloads"}'
```
Resposta de sucesso (200):
```JSON
{
  "message": "Organização concluída! 47 arquivos movidos.",
  "summary": {
    "images": 12,
    "documents": 8,
    "videos": 5,
    "audio": 3,
    "archives": 4,
    "code": 10,
    "others": 5
  }
}
```
Resposta parcial com erros (207):
```JSON
{
  "message": "Organização parcial: 45 arquivos movidos, mas 2 erros.",
  "summary": { ... },
  "errors": ["Erro ao mover arquivo locked.exe: EBUSY: resource busy or locked"]
}
```
### 🛡️ Segurança & Boas Práticas

- Usa path.resolve() + verificação de raiz permitida para evitar directory traversal
- Processamento assíncrono não bloqueia o servidor
- Erros por arquivo não param todo o processo
- Recomendado: rode em container (Docker) ou com autenticação em produção

### 🛠️ Personalização
Edite o objeto fileTypes em server.js para adicionar/remover categorias:
```JavaScript
const fileTypes = {
  images: ['.jpg', '.png', ...],
  // sua nova categoria aqui
};
```
### 📄 Licença
MIT License — veja LICENSE
### 🤝 Contribuições
Ideias bem-vindas!

Undo (reverter organização)
Config via arquivo/env (categorias custom)
Suporte a dry-run (simular sem mover)
Integração com watch mode (organiza automaticamente ao detectar novos arquivos)

Abra uma issue ou PR!
Feito com ☕ em Curitiba, PR por Gabriel Yara Fracaro

Última atualização: Março, 2026
