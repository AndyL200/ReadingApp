const pool = require('./postgres')
const fs = require('fs')
const path = require('path')


function loadSQL(filename) {
    return fs.readFileSync(path.join(__dirname, 'sql', filename), 'utf-8')
}

async function executeSQL(filename) { 
    const query = loadSQL(filename)
    await pool.query(query)
}


async function insertPageContent(docId, pageNum, content) {
    const query = loadSQL("insertContent.sql")
    return await pool.query(query, [docId, pageNum, JSON.stringify(content)])
}

async function insertContentForPages(docId, pages) {
    const client = await pool.connect()
    try {
        await client.query('BEGIN');

        for (const page of pages) {
            const query = loadSQL("insertContent.sql")
            await client.query(query, [docId, page.pageNumber, JSON.stringify(page)])
        }

        await client.query('COMMIT')
    } catch(err) {
        await client.query('ROLLBACK')
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

module.exports = {
    loadSQL,
    executeSQL,
    insertPageContent,
    insertContentForPages,
    selectRange,
    selectRandomDoc
}