# Guia: Como Gerar o PDF de Instruções

O arquivo HTML foi criado com sucesso em:
`docs/guia-acesso-premium.html`

## Opção 1: Conversão Manual (Mais Simples)

1. **Abra o arquivo HTML no navegador:**
   - Navegue até `c:\Users\conta\developer\desafio-dos-depositos\docs\`
   - Clique duas vezes em `guia-acesso-premium.html`

2. **Imprima como PDF:**
   - Pressione `Ctrl + P` (ou `Cmd + P` no Mac)
   - Em "Destino", selecione **"Salvar como PDF"**
   - Clique em "Salvar"
   - Nomeie como: `Guia-Acesso-Premium-Desafio-dos-Depositos.pdf`

## Opção 2: Usando Puppeteer (Automatizado)

Se preferir automatizar, podemos criar um script Node.js:

```bash
# Instalar puppeteer
npm install --save-dev puppeteer

# Executar script de conversão
node scripts/generate-pdf.js
```

Quer que eu crie o script automatizado?

## Opção 3: Ferramentas Online

Você também pode usar serviços online como:
- https://www.html2pdf.com/
- https://pdfcrowd.com/
- https://cloudconvert.com/html-to-pdf

Basta fazer upload do arquivo `guia-acesso-premium.html`
