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
        //is this the best method?
        await pool.query(query, [docId, pageNum, JSON.stringify(content)])
    }
    catch (err) {
        console.error(`Failed to insert page content. docId=${docId}, pageNum=${pageNum}: `, err)
    }

    return; 
}

async function createUser() {

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
    //grab doc_id, page_nums, content from range of pages
    const result = await pool.query(query, [docId, start, end]);
    //attach current page value for user to the result
    return result.rows;
}

async function user_selectRange(docId, start, end, userId) {

}

async function getCurrPage(docId, userId) {
    const query = loadSQL("getCurrPage.sql")
    try {
        const result = await pool.query(query, [docId, userId]);
        if(!result.rows[0]) {
            throw new Error("New user-document pair");
        }
        return result.rows[0].curr_page;
    }
    catch (err) {
        if (err.message === "New user-document pair") {
            let subquery = loadSQL("insertUserDocPair.sql");
            await pool.query(subquery, [userId, docId, 1]); //default curr_page to 1
            return null; // Indicate that this is a new pair
        }
        else {
        console.error("Error getting current page: ", err);
        }
    }
}

async function selectRandomDoc() {
    const query = `SELECT doc_id FROM DOCUMENTS ORDER BY RANDOM() LIMIT 1`
    try {
        const result = await pool.query(query);
        return result.rows[0].doc_id;
    }
    catch (err) {
        console.error("Error selecting random document: ", err);
    }
}
//Grab a random document for testing
async function selectRandomRead() {
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
    selectRandomRead,
    selectRandomDoc,
    insertDocument
}

const doc = await selectRandomDoc()
console.log("Random Document:", doc)