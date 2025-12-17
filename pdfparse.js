import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'
import {createCanvas} from 'canvas'
import fs from 'fs'
import path from 'path'

class BaseCanvasFactory {
  constructor() {
    if (this.constructor === BaseCanvasFactory) {
      (0, _util.unreachable)("Cannot initialize BaseCanvasFactory.");
    }
  }
  create(width, height) {
    if (width <= 0 || height <= 0) {
      throw new Error("Invalid canvas size");
    }
    const canvas = this._createCanvas(width, height);
    return {
      canvas,
      context: canvas.getContext("2d")
    };
  }
  reset(canvasAndContext, width, height) {
    if (!canvasAndContext.canvas) {
      throw new Error("Canvas is not specified");
    }
    if (width <= 0 || height <= 0) {
      throw new Error("Invalid canvas size");
    }
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }
  destroy(canvasAndContext) {
    if (!canvasAndContext.canvas) {
      throw new Error("Canvas is not specified");
    }
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
  _createCanvas(width, height) {
    (0, _util.unreachable)("Abstract method `_createCanvas` called.");
  }
}

class CanvasFactoryCustom extends BaseCanvasFactory {
    create(width, height) {
        const canvas = createCanvas(width, height)
        const context = canvas.getContext('2d')
        return {canvas, context}
    }
    reset(canvasAndContext, width, height) {
        const {canvas, context} = canvasAndContext
        canvas.width = width
        canvas.height = height
        context.clearRect(0, 0, width, height)
    }
    destroy(canvasAndContext) {
        canvasAndContext.canvas.width = 0
        canvasAndContext.canvas.height = 0
    }
}

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
    console.log("Canvas Factory: ", await document.canvasFactory)
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
async function extractPageContent(docProxy, pn, scale=1.0){
    const document = docProxy[0];
    //const title = path.basename(docProxy[1], path.extname(docProxy[1]))
    const page = await document.getPage(pn);
    const viewport = page.getViewport({scale: scale})
    const factory = document.canvasFactory
    const {canvas, context} = factory.create(viewport.width | 0, viewport.height | 0);
    
   
    await page.render({
        canvasContext: context,
        canvas: canvas,
        viewport: viewport
    }).promise;

    const res = {
        pageNumber: pn,
        width: viewport.width,
        height: viewport.height,
        canvas_data: canvas.toDataURL('image/jpeg'),
        //title: title
        }
    console.log("result: ", res)
    return res;
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

// const pathToPDF = path.join('.', 'pdfs', 'JavaScriptNotesForProfessionals.pdf')
// const prox = await readPDF(pathToPDF)
// extractPageContent(prox, 1)