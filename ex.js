import express, { text } from 'express'
const app = express()
import {
    executeSQL,
    insertPageContent,
    insertContentForPages,
    selectRange,
    selectRandomDoc,
    selectRandomRead,
    registerUser} from "./queries.js";
import { authenticateToken, generateAccessToken, generateRefreshToken } from './auth_helper.js';

async function init() {
    try {
        await executeSQL("create_reader_table.sql")
        console.log("Database initialized")
    } catch (err) {
        console.error("Database init error", err)
    }
}

init();


//tend to keep functions returning one data type for type safety
//process database query results
//O((range + nlogn)*seq_numbers + nlogn) too high?
async function textSequencing(rawPageJSON) {
    let pages = []
    let images = []
    if(!rawPageJSON) {
        return ["undefined"]
    }
    try {
        //sort by page number
        rawPageJSON.sort((a, b) => a.page_num - b.page_num);
        for (let i = 0; i < rawPageJSON.length; i++) {
            const page = rawPageJSON[i];
            //console.log("Processing page", page)
            const page_content = page.content
            let condensed_text = ""
            //sort by sequence numbers
            page_content.sort((a,b)=> a.cid_seq - b.cid_seq);
            for( let j = 0; j < page_content.length; j++) {
                condensed_text += page_content[j].text + '\n'
            }
            pages.push(condensed_text);
        }
        return pages;
    }
    catch(err) {
        console.log("ERROR")
        console.error("Misaligned text sequencing: ", err)
        return ["Error"]
    }
    
}

//starting the server
app.listen(5000, ()=> {
    console.log("server is listening on port 5000 ...")
})

app.get('/api/refresh_token', async (req, res) => {
    //issue new access token
    

})
app.get('/api/signup', async (req, res) => {
    //insert into users
    //only refresh token is stored
    await registerUser(req.body.email, req.body.password, req.body.username).then(({userId, access}) => {
        res.json({userId, accessToken: access})
    })

})
//postgresql query returns data components
//should be using a json token
//authentication middleware
app.get('/', authenticateToken, async (req, res)=>{
    const doc_id = await selectRandomDoc()
    const data = await selectRange(doc_id, 1, 10)
    //getCurrPage
    
    const sequenced = await textSequencing(data)
    
    const sequenced_content = sequenced.join('\n')
    //console.log("Sequence: ", sequenced_content)
    const response = {
        doc_id: doc_id,
        content: sequenced_content,
        page_count: 10,
        current_page: 1 
    }
    res.send(response)
})

app.get('/random', authenticateToken, async (req,res)=> {
    const data = await selectRandomRead()
    res.send(data)
})

//TODO(check for JSON web token and then query for )