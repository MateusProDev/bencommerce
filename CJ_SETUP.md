# CJ (Commission Junction) Script — Setup & Notes

Este arquivo descreve o script CJ que foi adicionado ao site e como testar/gerenciar.

## Onde foi adicionado
Arquivo: `client/public/index.html` — script inserido antes do `</body>` para carregar o JS de impressões/deeplink da CJ (publisher `turvia-reservas`).

## O que o script faz
- Habilita relatórios de impressões baseados em página para os IDs/excludes listados.
- Habilita automação de deeplink (quando configurado na conta CJ) para transformar links de anunciantes em links com tracking.

## Testes Rápidos
1. Fazer o build local e servir a versão de produção:

```powershell
cd client
npm run build
# usar seu deploy habitual: por exemplo, subir o build ao servidor ou testar com um servidor local simples
npx serve -s build
```

2. Abra o site em um navegador e verifique no DevTools -> Network se `am.js` é carregado.
   - Filtre por `anrdoezrs.net` ou `am.js`.

3. Verifique Console para erros relacionados ao script.

4. No painel da CJ (sua conta), habilite relatórios de Impressões por Página se necessário e confirme recebimento de dados.

## Privacidade e Consentimento
- Implementado: Banner/modal de consentimento com opção "Aceitar" / "Recusar".
   - Ao aceitar, o site injeta dinamicamente o script CJ e salva a escolha no `localStorage` como `turvia_cookie_consent = 'accepted'`.
   - Ao recusar, a escolha é salva como `turvia_cookie_consent = 'denied'` e o script NÃO é carregado.
   - Se o usuário já aceitou antes, o script é carregado automaticamente ao abrir o site.

## Para habilitar/desabilitar temporariamente
- Para desabilitar, remova (ou comente) a linha de `<script src="...am.js"></script>` em `client/public/index.html`.

## Observações
- O script foi inserido exatamente como fornecido (com a lista de `exclude`/IDs). Se quiser ajustar a lista de anunciantes/IDs, substitua a URL do `src` conforme o painel CJ gera.
- Se preferir carregar o script somente em produção, posso alterar a inclusão para ser condicional via JS (verificando `process.env.NODE_ENV === 'production'`) e injetar dinamicamente no `index.html` ou em `src/index.js`.

---

Se quiser, eu já deixo o carregamento condicional (apenas produção) e/ou fazer o carregamento somente após consentimento de cookies — quer que eu implemente isso agora?