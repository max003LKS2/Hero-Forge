# Fontes e cobertura

Documentos consultados em 9 de novembro de 2026. As páginas são as impressas nos PDFs em inglês. Os downloads foram usados para conferência; o projeto distribui dados selecionados com atribuição, não cópias de livros comerciais.

| Documento | Fonte oficial | Licença |
| --- | --- | --- |
| SRD 5.1 | https://media.wizards.com/2023/downloads/dnd/SRD_CC_v5.1.pdf | CC BY 4.0 |
| SRD 5.2.1 | https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf | CC BY 4.0 |

Portal: https://www.dndbeyond.com/srd. Atribuições integrais: `NOTICE.md`. Licença: https://creativecommons.org/licenses/by/4.0/legalcode.

## Cobertura (versão 0.2)

| Domínio | 2014 (SRD 5.1) | 2024 (SRD 5.2.1) |
| --- | --- | --- |
| Classes | as 12, com a subclasse única do SRD, níveis 1–20 | as 12, com a subclasse única do SRD, níveis 1–20 |
| Espécies/raças | Humano, Anão da colina, Elfo alto, Halfling pés-leves, Draconato, Gnomo das rochas, Meio-elfo, Meio-orc, Tiefling | Humano, Anão, Elfo, Gnomo, Golias, Halfling, Draconato, Orc, Tiefling (com linhagens/ancestrais) |
| Antecedentes | Acólito + Antecedente livre (convenção do app, com temas narrativos) | Acólito, Criminoso, Sábio, Soldado |
| Armas e armaduras | tabelas do SRD 5.1 | tabelas do SRD 5.2.1, com Maestria de Arma |
| Estilos de luta | 6 (Fighter/Paladin/Ranger) | os 4 talentos "Fighting Style" do SRD 5.2.1 |

Cada opção traz seu próprio objeto `source`. Descrições são resumos próprios em português. Unidades de deslocamento são pés. Os textos de orientação ("como é jogar", conselhos por atributo, recomendações de espécie e antecedente) são originais do projeto, não texto do SRD.

## Antecedentes além do SRD

O SRD 5.1 só traz o Acólito e o SRD 5.2.1 só quatro antecedentes. Os demais antecedentes (Livro do Jogador e suplementos) são conteúdo comercial e **não** foram copiados. Para 2014, o "Antecedente livre" permite escolher duas perícias e um tema de história (`src/data/themes.ts`: nomes e descrições fornecidos pelo usuário do projeto, sem benefícios mecânicos). É uma convenção do aplicativo.

## Compra de 27 pontos

Tabela 8/9/10/11/12/13/14/15 → 0/1/2/3/4/5/7/9, documentada no SRD 5.2.1, p. 21. O SRD 5.1 não inclui essa seção. O projeto oferece esse método no modo 2014 como convenção solicitada do aplicativo, explicitamente comunicada na tela e PDF. Isso não transfere bônus raciais, antecedentes ou talentos entre edições.

## Cálculos

- Modificador = piso((atributo − 10)/2). Proficiência = 2 + piso((nível − 1)/4).
- PV: dado da classe no máximo no nível 1; média arredondada para cima (dado/2 + 1) nos níveis seguintes; + modificador de Constituição por nível; + robustez anã e efeitos de subclasse por nível.
- CA: armadura + Destreza (limitada pela categoria), escudo +2, Estilo de Luta Defesa +1 com armadura; sem armadura, considera 10 + Des, Defesa sem Armadura de Bárbaro/Monge e Resiliência Dracônica.
- Ataque = modificador (Força, Destreza ou o melhor em armas com Acuidade) + proficiência, quando a classe a possui; Arquearia e Duelismo aplicados.
- Iniciativa = Destreza (+ proficiência com o talento Alerta do antecedente Criminoso 2024).
- Conjuração: CD = 8 + proficiência + modificador; espaços e truques/magias por nível conforme a tabela da classe.

## Limites conhecidos

- A **lista de magias específicas** (truques e magias de círculo) ainda não está catalogada; a ficha mostra quantas o personagem conhece/prepara e seus espaços.
- **Talentos** não substituem Aumento de Atributo; o talento de Origem aparece descrito, sem escolhas internas (ex.: Iniciado em Magia).
- Escolhas internas de classe (Ordem Divina, Especialização, Metamagia, Invocações etc.) aparecem como pendências.
- A subclasse única do SRD é aplicada automaticamente a partir do nível em que a classe a concede.
