const express = require('express')
const app = express()
import {insert, insertValues, selectContent, selectRange, selectRandom, createTable} from "./database"

createTable.run()

//starting the server
app.listen(5000, ()=> {
    console.log("server is listening on port 5000 ...")
})

//postgresql query returns data components
//should be using a json token
app.get('/', (req, res)=>{
    doc_id = selectRandom.run()
    
    res.send()
})

//TODO(check for JSON web token and then query for )