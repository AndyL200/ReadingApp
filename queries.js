import pool from './postgres.js'
import fs from 'fs'
import path from 'path'


function loadSQL(filename) {
    return fs.readFileSync(path.join('./sql', filename), 'utf8')
}

async function executeSQL(filename) { 
    const query = loadSQL(filename)
    await pool.query(query)
}


async function insertDocument(title, page_count) {
    const query = loadSQL("insertDocument.sql")
    //return docId
    const result = await pool.query(query, [title, page_count])
    return result.rows[0].doc_id
}

async function insertPageContent(docId, pageNum, content) {
    const query = loadSQL("insertContent.sql")
    if (!docId || !pageNum || !content) {
        return;
    }
    try {
        await pool.query(query, [docId, pageNum, JSON.stringify(content)])
    }
    catch (err) {
        console.error(`Failed to insert page content. docId=${docId}, pageNum=${pageNum}: `, err)
    }

    return; 
}

async function insertContentForPages(docId, pages) {
    const client = await pool.connect()
    try {
        await client.query('BEGIN');

        const query = loadSQL("insertContent.sql")

        for (const page of pages) {
            
            if (!page || !page.pageNumber || !page.text) {
                console.warn(`Skipping invalid page for docId=${docId}:`, page);
                continue;
            }
            //handle images later
            await client.query(query, [docId, page.pageNumber, JSON.stringify(page.text)])
        }

        await client.query('COMMIT')
    } catch(err) {
        await client.query('ROLLBACK')
        console.error(`Transaction failed`, err)
    } finally {
        client.release();
    }
}

async function selectRange(docId, start, end) {
    const query = loadSQL("contentRange.sql")
    const result = await pool.query(query, [docId, start, end]);
    return result.rows;
}

//Grab a random document for testing
async function selectRandomDoc() {
    const query = 'SELECT * FROM READERS ORDER BY RANDOM() LIMIT 1';
    try {
    const result = await pool.query(query);
    return result.rows[0];
    }
    catch (err) {
        console.error("Error selecting random document: ", err);
    }
    
}

export {
    loadSQL,
    executeSQL,
    insertPageContent,
    insertContentForPages,
    selectRange,
    selectRandomDoc,
    insertDocument
}