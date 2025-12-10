import pool from './postgres.js'
import fs from 'fs'
import path from 'path'
import { generateRefreshToken, generateAccessToken } from './auth_helper.js'


function loadSQL(filename) {
    return fs.readFileSync(path.join('./sql', filename), 'utf8')
}

async function executeSQL(filename) { 
    const query = loadSQL(filename)
    await pool.query(query)
}


async function insertDocument(title, page_count) {
    const query = loadSQL("insert_document.sql")
    //return docId
    const result = await pool.query(query, [title, page_count])
    return result.rows[0].doc_id
}

async function insertPageContent(docId, pageNum, content) {
    const query = loadSQL("insert_content.sql")
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

async function checkForToken(user_id) {
    //only refresh the hash if the user is found in JWT_KEYS with an expired token
    const query = loadSQL("check_for_token.sql")
    const result = await pool.query(query, [user_id])

    const token_data = result.rows[0];
    if(!token_data.token_hash) {
        console.error("This user has no token")
        return false;
    }
    //refresh if token is expired
    if(token_data.expires_at < new Date().getTime()) {
        const update_query = loadSQL("refresh_token.sql")
        await pool.query(update_query, [user_id, generateRefreshToken({id: user_id}), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)])
    }

    return true;
}

async function loginUser(email, password, username = null) {
    if (username) {
        //Login with username
        try {
        const query = loadSQL("grab_user_by_uname.sql")
        const result = await pool.query(query, [username, password])
        return {user_id: result.rows[0].user_id, LOGIN_SUCCESS: true, ERROR: null}
        }
        catch (err) {
            return {user_id: null, LOGIN_SUCCESS: false, ERROR: err.message}
        }
    }
    else if (email) {
        //Login with email
        try {
            const query = loadSQL("grab_user_by_email.sql")
            const result = await pool.query(query, [email, password])
            return {user_id: result.rows[0].user_id, LOGIN_SUCCESS: true, ERROR: null}
        }
        catch (err) {
            return {user_id: null, LOGIN_SUCCESS: false, ERROR: err.message}
        }
        
    }

    return {user_id: null, LOGIN_SUCCESS: false, ERROR: null}
}
async function getToken(token_hash) {
    const query = loadSQL("get_token.sql")
    const result = await pool.query(query, [token_hash])
    return result.rows[0].token_hash
}
async function registerUser(email, password, username = null) {
    const client = await pool.connect()
    try {
        await client.query('BEGIN');
        //check if user exists
        const query_user = loadSQL("insert_user.sql")
        const result_user = await client.query(query_user, [email, username, password])

        const userId = result_user.rows[0].user_id;

        const query_jwt = loadSQL("insert_jwt_key.sql")
        const refresh = generateRefreshToken({id: userId})
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        console.log("Generated refresh token: ", refresh)
        await client.query(query_jwt, [userId, refresh, expires])

        const access = generateAccessToken({id: userId})

        await client.query('COMMIT');
        //don't return refresh, managed by database only
        return {userId, access, SIGNUP_SUCCESS: true, ERROR: null};
    }
    catch (err) {
        await client.query('ROLLBACK');
        console.error("Transaction failed: ", err)
        return {userId: null, access: null, SIGNUP_SUCCESS: false, ERROR: err.message};
    }
    finally {
        client.release();
    }

}

async function insertContentForPages(docId, pages) {
    const client = await pool.connect()
    try {
        await client.query('BEGIN');

        const query = loadSQL("insert_content.sql")

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
    const query = loadSQL("content_range.sql")
    console.log("Executing selectRange with docId:", docId, "start:", start, "end:", end);
    //grab doc_id, page_nums, content from range of pages
    const result = await pool.query(query, [docId, start, end]);
    //attach current page value for user to the result
    return result.rows;
}

async function user_selectRange(docId, start, end, userId) {

}

async function getCurrPage(docId, userId) {
    const query = loadSQL("get_curr_page.sql")
    try {
        const result = await pool.query(query, [docId, userId]);
        if(!result.rows[0]) {
            throw new Error("New user-document pair");
        }
        return result.rows[0].curr_page;
    }
    catch (err) {
        if (err.message === "New user-document pair") {
            let subquery = loadSQL("insert_user_doc_pair.sql");
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
    insertDocument,
    registerUser,
    loginUser,
    checkForToken
}

const doc = await selectRandomDoc()
console.log("Random Document:", doc)