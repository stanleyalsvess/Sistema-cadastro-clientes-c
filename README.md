# Sistema de cadastro de clientes

Painel web para acompanhar e cadastrar clientes. A primeira versão funciona sem backend: novos registros são salvos no `localStorage` do navegador.

## Executar

Abra o `index.html` no navegador ou rode um servidor local na pasta do projeto:

```bash
python3 -m http.server 8000
```

Acesse `http://localhost:8000`.

## Painel web

O painel também oferece:

- Configurações gerais do sistema, administrador, formato de data e notificações
- Relatório do cliente que mais comprou
- Relatório do produto mais comprado
- Histórico com cliente, produto, quantidade, valor e data da compra
- Exportação do relatório de compras em `.txt`

As configurações são salvas no `localStorage` do navegador. Os dados de compras exibidos atualmente são demonstrativos e podem ser substituídos pela integração com o sistema em C ou uma API.
