import express, { text } from 'express'
const app = express()
import {
    executeSQL,
    insertPageContent,
    insertContentForPages,
    selectRange,
    selectRandomDoc,
    selectRandomRead,
    registerUser,
    loginUser,
    checkForToken
} from "./queries.js";
import { authenticateToken, generateAccessToken } from './auth_helper.js';

async function init() {
    try {
        await executeSQL("create_reader_table.sql")
        console.log("Database initialized")
    } catch (err) {
        console.error("Database init error", err)
    }
}

init();

app.use(express.json())


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

app.post('/api/login', async (req, res) => {
    //verify user credentials
    const success = await loginUser(req.body.email, req.body.password, req.body.username)

    if (success) {
        //check for refresh token
        //if expired refresh
        res.json({user_id: success.user_id, accessToken: generateAccessToken({id: success.user_id}), LOGIN_SUCCESS: success.LOGIN_SUCCESS, ERROR: success.ERROR})
    }
})


app.get('/api/me', async (req, res) => {
    //asking for an access token
    res.redirect(302, '/api/refresh_token')
})
app.get('/api/refresh_token', authenticateToken, async (req, res) => {
    //issue new access token
    const has_token = await checkForToken(req.body.user_id)

    if(has_token) {
        const access = generateAccessToken({id: req.body.userId})
        res.json({user_id: req.body.user_id, accessToken: access})
    }

})
app.post('/api/signup', async (req, res) => {
    //insert into users
    //only refresh token is stored
    const response = await registerUser(req.body.email, req.body.password, req.body.username)

    res.json({user_id: response.user_id, accessToken: response.accessToken, SIGNUP_SUCCESS: response.SIGNUP_SUCCESS, ERROR: response.ERROR})

    //Remember to trigger auth context when this is handled

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
    res.json(response)
})

app.get('/api/random', authenticateToken, async (req,res)=> {
    const data = await selectRandomRead()
    res.json(data)
})

//TODO(check for JSON web token and then query for )