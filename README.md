# Forja de Heróis

Construtor conversacional em português, React + TypeScript, compatível com quinta edição. **Versão 0.1: fundação funcional de nível 1.** O Cronista guia escolhas determinísticas; não há modelo de IA, chave de API, conta ou servidor.

## Executar no Windows

Pré-requisito: Node.js 22.12 ou posterior (recomendado Node 22 LTS) com npm.

```powershell
cd C:\Users\Clauber\Downloads\forjadosherois
npm.cmd ci
npm.cmd run dev
```

Abra o endereço local exibido, normalmente http://127.0.0.1:5173. Use sempre a mesma origem/porta para acessar a biblioteca local. Não abra `index.html` pelo Explorador: os módulos precisam do servidor.

```powershell
npm.cmd run check     # testes + TypeScript + compilação de produção
npm.cmd run build     # gera dist/
npm.cmd run preview   # confere dist/ em servidor local
```

O lockfile fixa a instalação. `.npmrc` usa `legacy-peer-deps=true` para contornar uma falha do npm 10 ao resolver dependências opcionais de Vitest; nenhuma dependência de execução depende desse contorno. A instalação e a compilação foram verificadas com Node 22.15.0.

## O que funciona

- Sete etapas em português, navegação livre e prévia reativa responsiva.
- Catálogos distintos: **2014 / SRD 5.1** e **2024 / SRD 5.2.1**, IDs com namespace e rejeição de opções de outra edição.
- Guerreiro, Ladino, Clérigo e Mago em cada catálogo, com dados de vida, salvaguardas e escolhas de perícias.
- 2014: Humano, Anão da colina, Halfling pés-leves; antecedente Acólito.
- 2024: Humano, Anão e Halfling; antecedentes Acólito, Criminoso, Sábio e Soldado.
- Compra de 27 pontos, valores base 8–15, custo 0/1/2/3/4/5/7/9; bônus raciais em 2014 e bônus válidos de antecedente em 2024.
- Modificadores, PV base incluindo robustez anã, proficiência de nível 1, salvaguardas, perícias concedidas/escolhidas, CA sem armadura, iniciativa e percepção passiva **base**.
- Biblioteca local (até 100 personagens), salvamento automático após nomear, importação JSON validada e exportação para cópia de segurança.
- PDF A4 paginado com valores, notas, fontes, atribuição e pendências.
- CI de testes/build e publicação manual no GitHub Pages.

**Não é uma ficha completa pronta para jogo.** Magias, talentos (incluindo Alerta), equipamentos, ataques, estilos de luta, especialização, idiomas, subclasses e traços não numéricos ainda não são automatizados. Suas pendências são mostradas e exportadas. CA e iniciativa são intencionalmente identificadas como valores base. Anotações não alteram cálculos. Níveis 2–20 e multiclasse não são aceitos pelo formato de dados desta versão. Não há rolagens, sincronia entre dispositivos ou recuperação remota.

A compra de 27 pontos é o método solicitado para este projeto. A tabela consta no SRD 5.2.1, p. 21; **não consta no SRD 5.1**. No modo 2014 é uma convenção explícita do construtor, não uma alegação de conteúdo do SRD 5.1. Nenhuma raça, antecedente, talento ou regra de classe de 2024 é aplicada ao modo 2014. Ver [fontes](docs/FONTES.md).

## Salvamento e privacidade

Personagens ficam em `localStorage`, chave `forja-de-herois.characters.v1`. Limpar dados do navegador remove a biblioteca; exporte JSON regularmente. A aplicação não faz telemetria nem envia personagens para serviços externos. Links de fonte abrem o documento oficial. Hospedagem serve somente arquivos estáticos; não inclua chaves de API no frontend.

Importações têm limite de 100 KB, esquema estrito e validação semântica. Versões desconhecidas, níveis não suportados, custos ilegais e opções de outra edição são rejeitados. Importar cria uma cópia com ID novo. Bibliotecas corrompidas não são sobrescritas automaticamente. Falhas de quota/armazenamento aparecem na interface. O PDF usa Helvetica/WinAnsi: português é suportado, caracteres fora do repertório latino (ex.: emoji) são substituídos por `?`; JSON preserva Unicode.

## Estrutura

```text
src/
  data/srd51.ts           # opções licenciadas de 2014
  data/srd521.ts          # opções licenciadas de 2024
  data/catalog.ts         # registro e atribuições
  domain/types.ts         # contrato de personagens e regras
  domain/engine.ts        # cálculos puros e validações
  persistence/characters.ts # esquema, biblioteca e JSON
  export/pdf.ts           # PDF A4 independente da interface
  App.tsx                 # conversa, escolhas, biblioteca e prévia
  styles.css              # tema e layout responsivo
```

Leia [arquitetura](docs/ARQUITETURA.md), [fontes e cobertura](docs/FONTES.md), [plano de expansão](docs/ROADMAP.md) e [verificação](docs/VERIFICACAO.md).

## Versionar e publicar

A pasta local foi preparada para Git; **nenhum repositório remoto foi criado e nada foi publicado**. Não há credenciais no projeto. Para preparar o primeiro commit, se ainda não existir Git:

```powershell
git init -b main
git add .
git commit -m "Cria fundação da Forja de Heróis"
```

Se o Git solicitar identidade, configure nome/e-mail da sua preferência. Crie um repositório vazio no GitHub (sem README/licença gerados pelo GitHub), escolha visibilidade e substitua `SEU_USUARIO`:

```powershell
git remote add origin https://github.com/SEU_USUARIO/forjadosherois.git
git push -u origin main
```

Para hospedagem: **Settings → Pages → Build and deployment → GitHub Actions**. Em **Actions → Publicar no GitHub Pages → Run workflow**, execute a publicação. Ela é manual, não disparada por cada push. A CI valida todos os pushes e PRs. `base: './'` permite servir também sob `/forjadosherois/`. Disponibilidade de Pages depende do plano/visibilidade do repositório; confirme nas configurações da sua conta. Repositório privado não implica site privado.

Outras hospedagens estáticas: comando `npm run build`, diretório publicado `dist`. Não há rotas de servidor nem banco a provisionar.

## Licenças

Código original: [MIT](LICENSE). Material adaptado dos SRDs: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/legalcode), com os créditos integrais em [NOTICE.md](NOTICE.md), na interface e nos PDFs. Traduções e descrições em português são adaptações próprias e não oficiais. Ícones Lucide: ISC; demais dependências mantêm suas licenças. Não incorporar material de livros comerciais ou acervos sem licença compatível. Projeto independente, sem afiliação oficial.
