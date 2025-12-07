import {readPDF, extractPageContent, extractAllPages, extractAllPageContentStream} from './pdfparse.js'
import {insertContentForPages, insertPageContent, insertDocument} from './queries.js'
import fs from 'fs'
import path from 'path'

async function uploadPDFStream(filePath) {
    if(!filePath.endsWith('.pdf'))
    {
        return;
    }
    try {
        const docProxy = await readPDF(filePath)
        const document = docProxy[0]
        const title = path.basename(filePath, path.extname(filePath))
        //insert title and page_count into DOCUMENTS
        const res = await insertDocument(title || "Untitled Document", document.numPages)
        let docId;
        if(typeof res === "number") {
            //insert documents returns the docId
            docId = res
        }
        if (docId) {
            //extract pages from the pdf
            for await (const page of extractAllPageContentStream(docProxy)) {
                    //all pages page content inserted into READERS
                    insertPageContent(docId, page.pageNumber, page.text)
                    //handle images later
            }
        }
    } catch (err) {
        console.error("PDF upload error:", err)
    }
}
async function uploadPDFBatch() {

}
async function uploadsStream() {
    const pdfFiles = './pdfs'
    const files = fs.readdirSync(pdfFiles)
    for (const file of files) {
        if(file.endsWith('.pdf')) {
            const filePath = path.join(pdfFiles, file)
           await uploadPDFStream(filePath)
        }
    }
}

uploadsStream()
