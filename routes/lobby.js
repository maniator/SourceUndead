"use strict";
import express from "express";
import {client} from "../server";
import Promise from "bluebird";
const app = express.Router();

/*
	If the user is logged in, redirect to lobby page
 */
app.route("/")
	.get((req, res) => res.render('lobby.ejs')) //render form

app.route("/games")
	.get((req, res) => {
		//get XHR from lobby, get games from redis, get player counts
		//return list style
		//step 1 iterate redis for games
		//step 2 iterate game index for players
		client.sadd("game-1", [1,2,3,4]);
		client.sadd("game-2", [1,2,3,4,5,6,7,8]);
		client.sadd("game-3", [9,0,8,4,3]);
		client.sadd("game-4", [1,5,3,2,2,2,3,4,5,5]);
		client.sadd("game-5", [1,2,3,4,5,6,7,8,90,10]);
		let response = {};
		let keysAsync = Promise.promisify(client.keys, {context: client});
		let smembersAsync = Promise.promisify(client.smembers, {context: client});
		keysAsync("*game*").then(reply => {
			reply.map(game => {
				smembersAsync(game).then(players => {
					response[game] = players.length;
					console.log("iteration");
				});
				console.log("after game");
			});
		}).then(() => {
			console.log("keys then");
			res.send(response);
		});
		/*	reply.map((game, index) => {
				client.smembers(game, (err, reply) => {
					response[game] = reply.length;
				});
			});
		});*/
	});
export default app;
