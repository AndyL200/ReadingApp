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
    selectPageCount,
    getCurrPage
} from "./queries.js";
import { extractPageContent, readPDF } from './pdfparse.js';
import { authenticateToken, generateAccessToken } from './auth_helper.js';

async function init() {
    try {
        await executeSQL("create_reader_table.sql")
        await executeSQL("create_user_table.sql")
        await executeSQL("create_user_attributes.sql")
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
        //TODO(Stop sending user_id)
        return res.json({accessToken: generateAccessToken({id: success.user_id}), LOGIN_SUCCESS: success.LOGIN_SUCCESS, ERROR: success.ERROR})
    }

    return res.json({accessToken: null, LOGIN_SUCCESS: false, ERROR: "Invalid credentials"})
})


app.get('/api/me', async (req, res) => {
    //asking for an access token
    return res.send((req.headers.authorization?.split(' ')[1] != null)? "valid" : "invalid")
})
app.get('/api/refresh_token', authenticateToken, async (req, res) => {
    //issue new access token
    const user_id = req.user_id
    if (!user_id) {
        return res.status(400).json({ERROR: "User authentication failed"})
    }
    const has_token = await checkForToken(user_id)

    if(has_token) {
        const access = generateAccessToken({id: user_id})
        return res.json({user_id: user_id, accessToken: access})
    }

})
app.post('/api/signup', async (req, res) => {
    //insert into users
    //only refresh token is stored
    //check for valid password and email
    
    if (await hasEmail(req.body.email)) {
        const success = await loginUser(req.body.email, req.body.password, req.body.username)

        if (success) {
            //check for refresh token
            //if expired refresh
            //TODO(Stop sending user_id)
            return res.json({accessToken: generateAccessToken({id: success.user_id}), LOGIN_SUCCESS: success.LOGIN_SUCCESS, ERROR: success.ERROR})
        }

        return res.json({user_id: null, accessToken: null, LOGIN_SUCCESS: false, ERROR: "Invalid credentials"})
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
    const user_id = req.user_id
    if (!user_id) {
        return res.status(400).json({ERROR: "User authentication failed"})
    }
    //getCurrPage
    const current_page = await getCurrPage(doc_id, user_id)
    const filePath = await selectFilePath(doc_id)
    const pageCount = await selectPageCount(doc_id)
    const range = await selectRange(doc_id, 1, 10)
    const docProxy = await readPDF(filePath)
    let pages = []
    for(let i = 0; i < range.length; i++) {
        const pageData = await extractPageContent(docProxy, range[i].page_num)
        pages.push(pageData);
    }
    return res.json({doc_id: doc_id, page_count: pageCount, content: pages, current_page: current_page})
})

app.post('/api/user_like', authenticateToken, async (req, res) => {
    let doc_id;
    try {
        doc_id = req.query.doc_id
    }
    catch (err) {
        return res.status(400).json({ERROR: "doc_id is required in the request body"})
    }
    const user_id = req.user_id

})

app.get('/api/up_doc', authenticateToken, async (req,res)=> {
    let doc_id;
    try {
        doc_id = req.query.doc_id
        var temp = req.query.current_page
    }
    catch (err) {
        return res.status(400).json({ERROR: "error grabbing doc_id and current_page"})
    }
    if(!doc_id || !req.query.current_page) {
        return res.status(400).json({ERROR: "doc_id and current_page are required in the request body"})
    }
    //passed through authenticate token or by the user
    const user_id = req.user_id
    const filePath = await selectFilePath(doc_id)
    //take the difference of current_page in req.body and current_page in READERS
    const pageCount = await selectPageCount(doc_id)
    const current_page = await getCurrPage(doc_id, user_id)
    const diff = req.query.current_page - current_page
    let range;
    if(diff > 10) {
        range = await selectRange(doc_id, req.query.current_page, req.query.current_page + 10)
    }
    else {
        range = await selectRange(doc_id, req.query.current_page, req.query.current_page + 10)
    }
    const docProxy = await readPDF(filePath)
    let pages = []
    for(let i = 0; i < range.length; i++) {
        const pageData = await extractPageContent(docProxy, range[i].page_num)
        pages.push(pageData);
    }
    return res.json({doc_id: doc_id, page_count: pageCount, content: pages, current_page: current_page})
})

app.get('/api/less_doc', authenticateToken, async (req,res)=> {
    let doc_id;
    try {
        doc_id = req.query.doc_id
        var temp = req.query.current_page
    }
    catch (err) {
        return res.status(400).json({ERROR: "error grabbing doc_id and current_page"})
    }
    if(!doc_id || !req.query.current_page) {
        return res.status(400).json({ERROR: "doc_id and current_page are required in the request body"})
    }
    //passed through authenticate token or by the user
    //TODO(just rely on authenticateToken to set user_id and stop returning it to the client)
    const user_id = req.user_id
    const filePath = await selectFilePath(doc_id)
    const pageCount = await selectPageCount(doc_id)
    //take the difference of current_page in req.body and current_page in READERS
    const current_page = await getCurrPage(doc_id, user_id)
    //diff expected to be negative
    const diff = req.query.current_page - current_page
    let range;
    if(diff < -10 && req.query.current_page + (diff-10) > 1) {
        range = await selectRange(doc_id, req.query.current_page, req.query.current_page)
    }
    else if (diff < -10 && req.query.current_page + diff > 1) {
        range = await selectRange(doc_id, req.query.current_page + diff, req.query.current_page)
    }
    else if (req.query.current_page - 10 > 1) {
        range = await selectRange(doc_id, req.query.current_page - 10, req.query.current_page)
    }
    else {
        range = await selectRange(doc_id, 1, req.query.current_page)
    }
    const docProxy = await readPDF(filePath)
    let pages = []
    for(let i = 0; i < range.length; i++) {
        const pageData = await extractPageContent(docProxy, range[i].page_num)
        pages.push(pageData);
    }
    return res.json({doc_id: doc_id, page_count: pageCount, content: pages, current_page: current_page})
})

app.get('/api/random', async (req,res)=> {
    const doc_id = await selectRandomDoc()
    const filePath = await selectFilePath(doc_id)
    const docProxy = await readPDF(filePath)
    const pageData = await extractPageContent(docProxy, 1)
    return res.json(pageData)
})


//Use this method for production (OLD)
// app.get('/api/random', authenticateToken, async (req,res)=> {
//     const data = await selectRandomRead()
//     res.json(data)
// })
//TODO(check for JSON web token and then query for )