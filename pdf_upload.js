import {readPDF, storePages} from './pdfparse.js'
import {uploadDocument, insertPageInfo} from './queries.js'
import fs from 'fs'
import path from 'path'

async function uploadPDFStream(filePath) {
    if(!filePath.endsWith('.pdf'))
    {
        return;
    }
    try {
        const docProxy = await readPDF(filePath)
        const document = docProxy[0];
        const pageCount = document.numPages
        const fileSize = docProxy[2]
        const title = path.basename(filePath, path.extname(filePath))
        const renderedPages = await storePages(docProxy, 1.0)
        const docId = await uploadDocument(title || "Untitled Document", pageCount, filePath, fileSize, 'pdf')
        for (const page of renderedPages) {
            insertPageInfo(docId, page.pageNumber, page.width, page.height)
        }
    }
    catch (err) {

    }
}
async function uploadPDFBatch() {

}
async function uploadsStream() {
    const pdfFiles = './pdfs'
    console.log("Uploading PDFs from ", pdfFiles)
    const files = fs.readdirSync(pdfFiles)
    for (const file of files) {
        if(file.endsWith('.pdf')) {
            const filePath = path.join(pdfFiles, file)
           await uploadPDFStream(filePath)
        }
    }
}

uploadsStream()
