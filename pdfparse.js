const fs = require('fs')
const pdfjs = require('pdfjs-dist')


async function readPDF(path) {
    //TODO(only use a partial buffer for less overhead)
    const data = fs.readFileSync(path);

    //Load PDF Document
    const document = await pdfjs.getDocument({
        data: data,
        //Disable worker to avoid issues with Node.js
        worker: false
    }).promise;
    return document
}

async function extractPageContent(document, pn){
    const page = await document.getPage(pn); //Pull from page number
    const content = await page.getTextContent();
    const text = content.items.map((item, index)=> ({
        text : item.str,
        cid_base: index
    }));

    const operatorList = await page.getOperatorList();
    const images = [];

    for(let i = 0; i < operatorList.fnArray.length; i++) {
        if(operatorList.fnArray[i] === pdfjs.OPS.paintImageXObject || operatorList.fnArray[i] === pdfjs.OPS.paintInlineImageXObject) {
            const imageName = operatorList.argsArray[i][0];
            try {
                const image = await page.objs.get(imageName);

                images.push({
                    name: imageName,
                    width: image.width,
                    height: image.height,
                    data: Buffer.from(image.data).toString('base64'),
                    kind: image.kind
                });
            }
            catch (err) {
                console.error(`Failed to extract image ${imageName}:`, err);
                }
            }
        }

        return {
        pageNumber: pageNum,
        text: text,
        images: images
    };
}

async function extractAllPages(document) {
    const numPages = document.numPages
    const pages = []
    //Extract Page Content from all pages (not 0-indexed)
    for(let i = 1; i <= numPages; i++) {
        const pageContent = await extractPageContent(document, i)
        pages.push(pageContent)
    }

    return {
        numPages: numPages,
        pages: pages
    };
}

module.exports = {
    readPDF,
    extractPageContent,
    extractAllPages
}