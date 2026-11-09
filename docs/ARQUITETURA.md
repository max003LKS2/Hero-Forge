# Arquitetura e invariantes

O fluxo é `interface → personagem → motor puro → prévia/PDF`. Fontes externas e texto livre nunca são executados nem alteram os cálculos. O catálogo de cada edição é um módulo próprio; o registro escolhe apenas um deles. `edition` está no personagem, na fonte e no prefixo de todo ID de regra.

## Regras de manutenção

1. A fonte deve ser um SRD licenciável, com documento, URL, página, seção e licença. Ler o texto integral antes de transcrever um efeito.
2. Não adicionar uma regra de 2024 ao catálogo 2014 para preencher uma lacuna. Não usar spread/herança de um catálogo no outro. Algoritmos matemáticos sem mudança podem ser compartilhados, com testes de ambas as edições.
3. A persistência aceita rascunhos incompletos, mas rejeita estados ilegais. `integrityErrors` valida legalidade; `creationErrors` aponta escolhas faltantes. Mesmo uma base preenchida permanece provisória enquanto há pendências não implementadas.
4. Armazenar escolhas, não valores derivados. Recalcular PV, atributos e perícias na abertura e na exportação.
5. Trocar classe limpa perícias; trocar antecedente limpa bônus e perícias; trocar edição cria outro personagem e preserva o anterior. Importações recebem ID novo.
6. Não acumular bônus iguais por acidente. Perícias da classe são escolhidas excluindo as já concedidas pelo antecedente. Outras fontes de proficiência e regras de substituição serão acrescentadas com o módulo correspondente.
7. Para novos níveis, modificar o esquema com migração explícita e testes. Nunca reinterpretar silenciosamente `schemaVersion: 1`.
8. Guardar segredos apenas em backend futuro. Nenhuma variável `VITE_*` é secreta.

## Evolução modular

Novos domínios previstos: `features`, `equipment`, `spells`, `advancement`. Cada efeito precisa de origem, condição, cálculo, escolha e testes. Recursos não suportados devem permanecer pendentes, nunca produzir valores fictícios. Contas/sincronia exigirão autorização, controle de acesso e resolução de conflitos antes de substituir a biblioteca local.
