"use strict";
import express from "express";
import {client, io} from "../server";
import Promise from "bluebird";
const app = express.Router();

function uuid() {
	let d = new Date().getTime();
	let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		let r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
	return uuid;
}
/*
	If the user is logged in, redirect to lobby page
 */
app.route("/")
	.get((req, res) => res.render('createGame.ejs')) //render form
	.post((req, res) => {
		const {name, permission} = req.body;
		const id = uuid();
		client.sadd("game-"+id, req.session.player.id);
		client.hmset(req.session.player.id, req.session.player);
		console.log("Player id",req.session.player.id)
		client.hmset("metadata-"+id, {
			"id":id,
			"name":name,
			"permission": permission
		});

		io.sockets.emit("loadWaitingRoom");

		res.send({
			"msg":"Your lobby was created! You will be redirected to your lobby momentarily..",
			"flag":false,
			"title":": Lobby Created",
			"id":`game-${id}`
		})
	});
export default app;
