const express = require('express')
const app = express()
const {
    executeSQL,
    insertPageContent,
    insertContentForPages,
    selectRange,
    selectRandomDoc} = require("./queries");

async function init() {
    try {
        await executeSQL("create_reader_table.sql")
        console.log("Database initialized")
    } catch (err) {
        console.error("Database init error", err)
    }
}

init();

//starting the server
app.listen(5000, ()=> {
    console.log("server is listening on port 5000 ...")
})

//postgresql query returns data components
//should be using a json token
app.get('/', async (req, res)=>{
    const data = await selectRange(doc_id, [1, 10])
    res.send(data)
})

app.get('/random', async (req,res)=> {
    const data = await selectRandomDoc()
    res.send(data)
})

//TODO(check for JSON web token and then query for )