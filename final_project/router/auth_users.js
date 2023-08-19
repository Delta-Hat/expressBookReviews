const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //retrieves all users who have same username and password.
    //really ought to have only one valid entry imo
    let validusers = users.filter((user) => user.username === username && user.password === password);
    //checks that there's at least one valid user
    return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    //unpack req
    const username = req.body.username;
    const password = req.body.password;
    //check if req has require inputs
    if(!username || !password){
        return res.status(400).send("Missing username or password!");
    }
    if(authenticatedUser(username,password)){
        let accessToken = jwt.sign(
            {data: password},
            "wakistan",//this is a test secret string
            {expiresIn: 60 * 10}
        );
        /*
        "Session data is not saved in the cookie itself,
        just the session ID. Session data is stored server-side."
        So basically, the token is saved in the server but the session ID is stored as a cookie.
        Does that mean a hacker could retrieve and forge the session ID?
         */
        req.session.authorization = {
            accessToken,username
        }
        return res.status(200).send("Logged in!");
    }
    return res.status(208).send("Invalid user credentials.");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
