# Frontend da Central de Solicitações

Aplicação React + TypeScript + Vite em `frontend/`, independente do projeto Spring Boot.

## Executar localmente

1. Inicie o backend Spring Boot na porta `8080`.
2. Entre na pasta `frontend/` e instale as dependências com `npm install`.
3. (Opcional) Copie `.env.example` para `.env.local` e ajuste `VITE_API_BASE_URL`. Sem configuração, usa `http://localhost:8080/loading/central-solicitacoes`.
4. Execute `npm run dev` e abra a URL informada pelo Vite (normalmente `http://localhost:5173`).

Para gerar a versão de produção: `npm run build`; para servi-la localmente: `npm run preview`.

O navegador chama a API diretamente. Se o backend não aceitar a origem do Vite, será necessário configurar CORS no backend para permitir a origem do frontend (por exemplo, `http://localhost:5173`). Isso não é alterado neste projeto.

## Integração

- Chamadas HTTP estão centralizadas em `src/api.ts`; os caminhos e os DTOs seguem o controlador existente.
- O cadastro espera uma resposta textual e então recarrega a lista por `GET /consultar`.
- Filtrar envia status e prioridade juntos, pois ambos são exigidos pela API.
- Aceitar e concluir enviam somente `{ solicitationId }`; botões aparecem apenas para os status que permitem cada transição.
- Categorias são limitadas às opções definidas na interface e `GERAL` é o valor inicial.
