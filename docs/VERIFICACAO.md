# Verificação da entrega 0.1

Data: 9 de novembro de 2026. Node 22.15.0, npm 10.9.2, Windows.

- 47 testes automatizados aprovados: tabela de compra completa, limites, orçamento, modificadores, bônus por edição, robustez anã, proficiência, perícias, salvaguardas, escolhas inválidas e separação dos catálogos.
- Persistência: ida/volta JSON, edição de personagem sem duplicação, dados locais corrompidos preservados, falha de quota, rejeição de versões, níveis e payloads incompatíveis.
- PDF: formato A4 e paginação de notas longas testados. Exemplo com Guerreiro/Anão/Acólito 2024 renderizado em duas páginas e inspecionado visualmente após ajuste de layout.
- TypeScript estrito e build Vite aprovados. Avisos de comentários `@__PURE__` internos do Zod não impedem a compilação.
- `npm audit` após atualização: zero vulnerabilidades conhecidas relatadas naquele momento. Isso não é uma garantia permanente; manter o lockfile atualizado com testes.
- Teste no navegador: nome, classe, espécie, antecedente, compra de 27 pontos, bônus +2/+1, duas perícias, revisão, download do PDF e abertura do personagem salvo após recarregar a página.
- Layout inspecionado em 1440×1000 e 390×844; formulário inicial também visto em largura estreita de aproximadamente 300 px. Nenhum erro no console durante esse fluxo. Interações verificadas principalmente por teclado.

## Limites da verificação

Não há suíte automatizada de navegador ou auditoria completa de acessibilidade. O fluxo completo 2024 foi exercitado na interface; as diferenças 2014 são cobertas pelos testes de motor e fontes. Importação foi testada no módulo de persistência, sem automatizar o seletor de arquivos do sistema. O fluxo GitHub Actions/Pages está configurado, mas só poderá ser executado após criação/autorização de um repositório remoto. Não se declara suporte às funcionalidades listadas como pendentes no README.

## Conferência manual para novas versões

1. Criar uma ficha de cada edição; conferir PV, bônus e escolhas contra a fonte.
2. Mudar classe, antecedente e edição; confirmar limpeza das escolhas dependentes e preservação do personagem anterior.
3. Exportar JSON, importar como cópia, recarregar e abrir pela biblioteca.
4. Tentar importar opção da outra edição, atributo fora do intervalo, nível 20 e arquivo grande; esperar rejeição sem perda de dados.
5. Gerar PDF com nome longo, acentos e notas extensas; revisar todas as páginas A4.
6. Testar teclado, modal, foco, telas estreitas e armazenamento indisponível.
