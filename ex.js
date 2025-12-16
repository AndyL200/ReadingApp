import express, { text } from 'express'
const app = express()
import {
    executeSQL,
    insertPageInfo,
    selectRange,
    selectRandomDoc,
    selectRandomRead,
    registerUser,
    loginUser,
    checkForToken,
    selectFilePath,
    hasEmail,
    selectPageCount
} from "./queries.js";
import { extractPageContent } from './pdfparse.js';
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
        return res.json({user_id: success.user_id, accessToken: generateAccessToken({id: success.user_id}), LOGIN_SUCCESS: success.LOGIN_SUCCESS, ERROR: success.ERROR})
    }
})


app.get('/api/me', async (req, res) => {
    //asking for an access token
    return res.send((req.headers.authorization?.split(' ')[1] != null)? "valid" : "invalid")
})
app.get('/api/refresh_token', authenticateToken, async (req, res) => {
    //issue new access token
    const has_token = await checkForToken(req.body.user_id)

    if(has_token) {
        const access = generateAccessToken({id: req.body.user_id})
        return res.json({user_id: req.body.user_id, accessToken: access})
    }

})
app.post('/api/signup', async (req, res) => {
    //insert into users
    //only refresh token is stored
    if (await hasEmail(req.body.email)) {
        console.log("REDIRECTING DUE TO EXISTING EMAIL")
        return res.json({user_id: null, accessToken: null, SIGNUP_SUCCESS: false, ERROR: "Email already exists"})
    }
    const response = await registerUser(req.body.email, req.body.password, req.body.username)
    console.log("REGISTER RESPONSE: ", response)
    return res.json({user_id: response.user_id, accessToken: response.accessToken, SIGNUP_SUCCESS: response.SIGNUP_SUCCESS, ERROR: response.ERROR})

    //Remember to trigger auth context when this is handled

})
//postgresql query returns data components
//should be using a json token
//authentication middleware
app.get('/', authenticateToken, async (req, res)=>{
    const doc_id = await selectRandomDoc()
    //getCurrPage
    const filePath = await selectFilePath(doc_id)
    const pageCount = await selectPageCount(doc_id)
    const range = await selectRange(doc_id, 1, 10)
    let pages = []
    for(let i = 0; i < range.length; i++) {
        const pageData = await extractPageContent(filePath, range[i].page_num)
        pages.push(pageData);
    }
    return res.json({doc_id: doc_id, page_count: pageCount, content: pages, current_page: null})
})

app.get('/api/more_doc', authenticateToken, async (req,res)=> {
    const doc_id = req.body.doc_id
    const filePath = await selectFilePath(doc_id)
    //take the difference of current_page in req.body and current_page in READERS
    const range = await selectRange(doc_id, req.body.current_page, req.body.current_page + 10)

     let pages = []
    for(let i = 0; i < range.length; i++) {
        const pageData = await extractPageContent(filePath, range[i].page_num)
        pages.push(pageData);
    }
    return res.json({doc_id: doc_id, page_count: pageCount, content: pages, current_page: null})
})

app.get('/api/random', async (req,res)=> {
    const doc_id = await selectRandomDoc()
    const filePath = await selectFilePath(doc_id)
    const pageData = await extractPageContent(filePath, range[i].page_num)
    return res.json(pageData)
})

//Use this method for production (OLD)
// app.get('/api/random', authenticateToken, async (req,res)=> {
//     const data = await selectRandomRead()
//     res.json(data)
// })
//TODO(check for JSON web token and then query for )