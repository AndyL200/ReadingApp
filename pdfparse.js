import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'
import fs from 'fs'
import path from 'path'

async function readPDF(filePath) {
    //TODO(only use a partial buffer for less overhead)
    const data = new Uint8Array(fs.readFileSync(filePath))

    //Load PDF Document
    const document = await pdfjs.getDocument({
        data: data,
        //Disable worker to avoid issues with Node.js
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true
    }).promise;
    return [document, filePath]
}



//convert to stream later
async function extractPageContent(docProxy, pn){
    const document = docProxy[0];
    const page = await document.getPage(pn); //Pull from page number
    const content = await page.getTextContent();
    const text = content.items.map((item, index)=> ({
        text : item.str,
        //maybe pick a better name, this value serves as a sequence number for text on a page
        cid_seq: index
    }));

    const operatorList = await page.getOperatorList();
    const images = [];

    //TODO(images resolve later than the text, offload this process)
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
        pageNumber: pn,
        text: text,
        images: images
    };
}

//batch to reduce load on stack and prevent stack overflow
async function extractAllPages(docProxy, batchSize=5) {
    const document = docProxy[0];
    const title = path.basename(docProxy[1], path.extname(docProxy[1]))
    const numPages = document.numPages
    const pages = []
    //Extract Page Content from all pages (not 0-indexed)
    for(let i = 1; i <= numPages; i+=batchSize) {
        const batchPages = []
        for(let j = i; j < Math.min(i + batchSize, numPages+1); j++) {
            batchPages.push(extractPageContent(document, j))
        }
        const batchResults = await Promise.all(batchPages)
        pages.push(batchResults)
    }

    return {
        numPages: numPages,
        title: title || "Untitled Document",
        pages: pages
    };
}

//gets only the page content num and title must be processed separately
async function* extractAllPageContentStream(docProxy) {
    const document = docProxy[0];
    const numPages = document.numPages

    for(let i = 1; i <= numPages; i++) {
        const pageContent = await extractPageContent(docProxy, i)
        yield pageContent
    }
}

export {
    readPDF,
    extractPageContent,
    extractAllPages,
    extractAllPageContentStream
}

