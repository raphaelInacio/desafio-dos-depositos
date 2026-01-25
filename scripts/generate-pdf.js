const puppeteer = require('puppeteer');
const path = require('path');

async function generatePDF() {
    console.log('🚀 Iniciando geração do PDF...');

    const browser = await puppeteer.launch({
        headless: true
    });

    const page = await browser.newPage();

    const htmlPath = path.join(__dirname, '..', 'docs', 'guia-acesso-premium.html');
    const pdfPath = path.join(__dirname, '..', 'docs', 'Guia-Acesso-Premium-Desafio-dos-Depositos.pdf');

    console.log(`📄 Carregando HTML: ${htmlPath}`);
    await page.goto(`file://${htmlPath}`, {
        waitUntil: 'networkidle0'
    });

    console.log('💾 Gerando PDF...');
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: {
            top: '20px',
            right: '20px',
            bottom: '20px',
            left: '20px'
        }
    });

    await browser.close();

    console.log(`✅ PDF gerado com sucesso: ${pdfPath}`);
}

generatePDF().catch(error => {
    console.error('❌ Erro ao gerar PDF:', error);
    process.exit(1);
});
