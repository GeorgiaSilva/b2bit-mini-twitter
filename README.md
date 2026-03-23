# Mini Twitter

Aplicação frontend em React + TypeScript para uma mini rede social com:
- autenticação (`login` e `cadastro`)
- timeline pública
- criação, edição, exclusão e like de posts
- busca e scroll infinito
- tema claro/escuro

## Stack
- React
- TypeScript
- Vite
- Axios
- TanStack Query
- React Hook Form + Zod
- Tailwind CSS

## Requisitos
- Node.js 18+
- npm 9+

## Instalação
```bash
npm install
```

## Variáveis de ambiente
Crie o arquivo `.env` na raiz:

```env
VITE_API_URL=http://localhost:3000
```

## Scripts
```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Observações
- Ações de edição/exclusão são restritas ao autor do post no frontend.
- Em caso de bloqueio no backend (403), a UI exibe mensagem amigável.
- A timeline continua acessível sem token.
