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
		const {name, permission} = req.body;
		console.log(name, permission);
		res.send({
			"msg":"Your lobby was created! You will be redirected to your lobby momentarily..",
			"flag":false,
			"title":": Lobby Created"
		})
	});
export default app;
