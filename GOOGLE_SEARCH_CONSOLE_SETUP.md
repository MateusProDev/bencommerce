# 🔍 Configuração do Google Search Console - Turvia

## 📋 Passo a Passo Completo

### 1️⃣ Acessar o Google Search Console

1. Acesse: https://search.google.com/search-console
2. Faça login com sua conta Google (preferencialmente uma conta de negócios)

### 2️⃣ Adicionar Propriedade

1. Clique em **"Adicionar propriedade"** ou **"Add Property"**
2. Escolha o tipo de propriedade:
   - **Domínio** (recomendado): `turvia.com.br`
   - **Prefixo do URL**: `https://turvia.com.br/`

### 3️⃣ Verificar Propriedade

#### ✅ Opção A: Verificação por Registro TXT no DNS (RECOMENDADA - JÁ CONFIGURADA)

**Este é o método mais recomendado e que você está usando!**

1. No Google Search Console, escolha o tipo **"Domínio"**
2. Digite: `turvia.com.br`
3. O Google fornecerá um registro TXT como:
   ```
   google-site-verification=CODIGO_ALEATORIO_AQUI
   ```

4. Adicione esse registro TXT no seu provedor de DNS (onde o domínio está registrado):
   - **Tipo**: TXT
   - **Nome/Host**: @ ou turvia.com.br
   - **Valor**: O código fornecido pelo Google
   - **TTL**: 3600 (ou padrão)

5. Aguarde a propagação DNS (pode levar de 5 minutos a 48 horas)
6. Volte ao Google Search Console e clique em **"Verificar"**

**Vantagens deste método**:
- ✅ Verifica todo o domínio (com e sem www)
- ✅ Verifica automaticamente todos os subdomínios
- ✅ Mais seguro e permanente
- ✅ Não precisa mexer no código do site

#### Opção B: Verificação por Meta Tag (Alternativa)

1. No Google Search Console, escolha o método **"Tag HTML"**
2. Copie o código de verificação que aparece como:
   ```html
   <meta name="google-site-verification" content="CODIGO_AQUI" />
   ```
3. O código já está preparado no arquivo:
   - **Arquivo**: `client/public/index.html` (linha 21)
   - **Substitua**: `SEU_CODIGO_DE_VERIFICACAO_AQUI` pelo código real

4. Faça o build e deploy:
   ```bash
   cd client
   npm run build
   ```

5. Volte ao Google Search Console e clique em **"Verificar"**

#### Opção C: Verificação por Arquivo HTML

1. Baixe o arquivo HTML fornecido pelo Google
2. Coloque o arquivo em `client/public/`
3. Faça o build e deploy
4. Clique em "Verificar" no Google Search Console

### 4️⃣ Enviar Sitemap

Após a verificação ser aprovada (o status mudará para "Propriedade verificada"):

1. No menu lateral, clique em **"Sitemaps"**
2. No campo "Adicionar um novo sitemap", digite: `sitemap.xml`
3. Clique em **"Enviar"**

**URLs do Sitemap**:
- Principal: `https://turvia.com.br/sitemap.xml`
- Com www: `https://www.turvia.com.br/sitemap.xml`

**Status esperado**: "Sucesso" (pode levar algumas horas para processar)

⚠️ **Importante**: Como você verificou pelo método de domínio, o Google automaticamente reconhece tanto `turvia.com.br` quanto `www.turvia.com.br`!

### 5️⃣ Configurar robots.txt

O arquivo `robots.txt` já está configurado em `client/public/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /dashboard
Disallow: /api/

Sitemap: https://turvia.com.br/sitemap.xml
Crawl-delay: 10
```

**URL**: `https://turvia.com.br/robots.txt`

### 6️⃣ Solicitar Indexação Manual (Opcional)

Para acelerar a indexação:

1. Vá em **"Inspeção de URL"** no menu lateral
2. Digite a URL que deseja indexar (ex: `https://turvia.com.br/`)
3. Clique em **"Solicitar indexação"**

Repita para as principais páginas:
- https://turvia.com.br/
- https://turvia.com.br/planos
- https://turvia.com.br/solucoes
- https://turvia.com.br/sobre
- https://turvia.com.br/blog

## 📊 Recursos Importantes do Search Console

### 1. **Desempenho**
- Monitore cliques, impressões, CTR e posição média
- Analise quais palavras-chave estão trazendo tráfego
- Veja quais páginas têm melhor desempenho

### 2. **Cobertura**
- Verifique se há erros de indexação
- Identifique páginas válidas e excluídas
- Corrija problemas de rastreamento

### 3. **Melhorias**
- **Usabilidade móvel**: Verifique se o site é mobile-friendly
- **Core Web Vitals**: Analise métricas de velocidade e experiência
- **Breadcrumbs**: Confira a estrutura de navegação

### 4. **Links**
- Veja links externos apontando para seu site
- Monitore links internos
- Identifique oportunidades de link building

## 🎯 Boas Práticas Implementadas

✅ **Verificação por registro TXT no DNS** (método mais seguro)  
✅ **Meta tags SEO** completas no `index.html`  
✅ **Sitemap.xml** com todas as páginas principais  
✅ **Robots.txt** configurado corretamente  
✅ **Structured Data (Schema.org)** para Organization  
✅ **Open Graph** para redes sociais  
✅ **Twitter Cards** configuradas  
✅ **Canonical URLs** definidas  
✅ **Google Analytics** (G-1HMMH0L3QH) integrado  

## 📝 Status da Verificação DNS

### Como verificar se o registro TXT foi propagado:

Você pode usar ferramentas online para verificar:

1. **Google Admin Toolbox**: https://toolbox.googleapps.com/apps/dig/#TXT/turvia.com.br
2. **WhatsMyDNS**: https://www.whatsmydns.net/
3. **Via terminal (Windows)**:
   ```bash
   nslookup -type=TXT turvia.com.br
   ```
4. **Via terminal (Linux/Mac)**:
   ```bash
   dig turvia.com.br TXT
   ```

**O que você deve ver**: O registro TXT do Google começando com `google-site-verification=`

## 📱 Páginas Indexadas

Páginas principais no sitemap:
- ✅ Homepage (/)
- ✅ Soluções (/solucoes)
- ✅ Planos (/planos)
- ✅ Sobre (/sobre)
- ✅ Contato (/contato)
- ✅ Blog (/blog)
- ✅ Tutoriais (/tutoriais)
- ✅ FAQ (/faq)

## 🚀 Próximos Passos

### Após Configuração:

1. **Aguardar 24-48h** para o Google processar o sitemap
2. **Monitorar** o painel de cobertura semanalmente
3. **Analisar** palavras-chave e otimizar conteúdo
4. **Verificar** Core Web Vitals e corrigir problemas
5. **Criar conteúdo** regular no blog para melhorar SEO

### Otimizações Recomendadas:

- [ ] Adicionar mais páginas de conteúdo (artigos de blog)
- [ ] Criar páginas para palavras-chave específicas
- [ ] Otimizar velocidade de carregamento
- [ ] Adicionar mais structured data (artigos, FAQs, etc)
- [ ] Conseguir backlinks de sites relevantes
- [ ] Criar descrições únicas para cada página

## 📞 Contatos Técnicos

**WhatsApp**: +55 85 99147-0709
**Email**: contato@turvia.com.br
**Instagram**: @turvia.com.br
**Facebook**: facebook.com/turvia

## 🔗 Links Úteis

- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics](https://analytics.google.com/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

---

**Última atualização**: 13 de Novembro de 2025
