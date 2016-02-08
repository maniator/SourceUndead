"use strict";
import express from "express";
import {client} from "../server";
import Promise from "bluebird";
const app = express.Router();

/*
	If the user is logged in, redirect to lobby page
 */
app.route("/")
	.get((req, res) => res.render('createGame.ejs')) //render form
	.post((req, res) => {

	});
export default app;
