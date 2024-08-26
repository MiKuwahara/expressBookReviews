const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

//write code to check if username and password match the one we have in records.
const authenticatedUser = (username,password)=>{ //returns boolean
	// FIlter the users array for any user with the same username and password
	let validUsers = users.filter((user) => {
		return (user.username === username && user.password === password);
	});
	// Return true if any valid user is found, otherwise false
	if(validUsers.length > 0){
		return true;
	}else{
		return false;
	}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
	const username = req.body.username;
	const password = req.body.password;

	// CHeck if username or password is missing
	if(!username || !password){
		return res.status(404).json({message: "Please provide both username and password."});
	}

	// Authenticate user against the info in records
	if(authenticatedUser(username, password)){
		// Generate JWT access token
		let accessToken = jwt.sign(
			{
				password: password,
				username: username
			},
			'access',
			{expiresIn: 60 * 60}
		);

		// Store access token and username in session
		req.session.authorization = {
			accessToken, username
		};
		return res.status(200).json("User successfully logged in.");
	}else{
		return res.status(404).json({message: "Invalid login. Check username and password."})
	}
	
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	// Extract isbn, user review, username
	const isbn = req.params.isbn;
	const userReview = req.query.review;
	const username = req.session.authorization['username'];
	const user = req.user;
	// console.log(user);
	// return res.send(`User ${user} and username ${username}`);
	
	// Get list of reviews for the book with isbn
	let bookReviews = books[isbn];

	// Check if user already posted a review. Otherwise, create a new review
	if(bookReviews[username]){
		// Modify existing one
		bookReviews[username] = userReview;
		return res.status(200).json({
				message: "Your review has been modified successfully.",
				review: userReview
			});
	}
	
	bookReviews[username] = userReview;
	return res.status(200).json({
		message: "YOur review has been added successfully.",
		review: userReview
	});

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
