# Segurança: como evitar commitar segredos

Se um segredo foi comprometido (chave de serviço, API key), você já fez bem em revogar/rotacionar. Para evitar que isso aconteça novamente, siga os passos abaixo e peça que a equipe os adote.

## 1) Atualize o `.gitignore`
- Não commite arquivos de credenciais. Exemplos adicionados:
  - `server/*.json`, `*.pem`, `*.key`, `*.p12`, `.env*`

## 2) Configure ganchos Git para prevenção local
- Este repositório inclui um hook em `.githooks/pre-commit` que procura por padrões óbvios ("-----BEGIN PRIVATE KEY-----", `AIza...`, `"private_key"`).
- Para ativar localmente (executar uma vez por clone):

```bash
# na raiz do repo
git config core.hooksPath .githooks
```

- Após isso, qualquer tentativa de commitar arquivos com segredos será bloqueada localmente.

## 3) Ferramentas recomendadas
- `git-secrets` ou `detect-secrets` (Yelp) para scan mais robusto.
- `BFG Repo-Cleaner` ou `git-filter-repo` para limpar histórico caso necessário.

## 4) Em caso de vazamento
1. Revogue/rotacione a chave imediatamente (GCP / Firebase / APIs).
2. Remova o arquivo do repo (`git rm --cached path/to/secret`) e commite.
3. Limpe o histórico (BFG/git-filter-repo) e force-push.
4. Atualize as variáveis de ambiente em produção (Vercel, etc.).

## 5) Boas práticas
- Nunca armazene chaves secretas no repositório.
- Use variáveis de ambiente nos serviços de hospedagem (Vercel, Heroku).
- Restrinja APIs por referrer/IP e limite permissões de service accounts.

