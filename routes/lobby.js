"use strict";
import express from "express";
const app = express.Router();

/*
	If the user is logged in, redirect to index page
	Else, render the login page
 */
app.get('/', (req, res) => {
	res.render('lobby.ejs');
});

export default app;
