const Database = require("better-sqlite3")
const db = new Database("Reading.db", {verbose : console.log});

const createTable = 
    db.prepare(`
    CREATE TABLE IF NOT EXISTS READERS (
    doc_id INT,
    page_num INT,
    content JSONB,
    PRIMARY KEY (doc_id, page_num)
    );
    `
)

const insert = db.prepare(`INSERT INTO READERS (content) VALUES (?)`)

const insertValues = db.transaction((values)=> {
    for(var v of values) {
        insert.run(v)
    }
})

const selectContent = db.prepare(`SELECT content from READERS WHERE doc_id == ? and page_num > ? and page_num < ? ORDER BY page_num`)

const selectRange = db.transaction((doc_id, range) => {
    selectContent.run(doc_id, range[0], range[1])
})
//Grab a random document
const selectRandom = db.prepare(`SELECT doc_id FROM READERS`)

module.exports = {
    createTable,
    insertValues,
    insert,
    selectContent,
    selectRange,
    selectRandom
}