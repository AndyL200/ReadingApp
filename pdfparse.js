import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'
import {createCanvas} from 'canvas'
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
    return [document, filePath, data.byteLength]
}

//leaving other functions here for custom parsing (faster and more secure)
async function storePages(docProxy, scale = 1.0) {
    const document = docProxy[0];
    let p = []
    for (let pn = 1; pn <= document.numPages; pn++) {
        const page = await document.getPage(pn);
        const viewport = page.getViewport({scale: scale})

        // const canvas = createCanvas(viewport.width, viewport.height)
        // const context = canvas.getContext('2d');

        // const renderContext = {
        //     canvasContext: context,
        //     viewport: viewport
        // };

        //await page.render(renderContext).promise;

        p.push({
            pageNumber: pn,
            width: viewport.width,
            height: viewport.height,
        })
    }
    return p;
}






//convert to stream later
async function extractPageContent(docProxy, pn){
   const document = docProxy[0];
    const title = path.basename(docProxy[1], path.extname(docProxy[1]))
    const page = await document.getPage(pn);
    const viewport = page.getViewport({scale: scale})

    const canvas = createCanvas(viewport.width, viewport.height)
    const context = canvas.getContext('2d');

    const renderContext = {
        canvasContext: context,
        viewport: viewport
    };

    await page.render(renderContext).promise;

    return {
        pageNumber: pn,
        width: viewport.width,
        height: viewport.height,
        canvas_data: canvas.toDataURL('image/jpeg')
        }
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




// ----------------------- DEPRECIATED ----------------------- //

//batch to reduce load on stack and prevent stack overflow
async function extractAllPages(docProxy, batchSize=5) {
    const document = docProxy[0];
    const title = path.basename(docProxy[1], path.extname(docProxy[1]))
    const numPages = document.numPages
    let p = []
    for (let pn = 1; pn <= numPages; pn++) {
        const page = await document.getPage(pn);
        const viewport = page.getViewport({scale: scale})

        const canvas = createCanvas(viewport.width, viewport.height)
        const context = canvas.getContext('2d');

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        await page.render(renderContext).promise;

        p.push({
            pageNumber: pn,
            width: viewport.width,
            height: viewport.height,
            canvas_data: canvas.createPDFStream({title: title})
        })
    }
    return p;
}

export {
    readPDF,
    extractPageContent,
    extractAllPages,
    extractAllPageContentStream,
    storePages
}

