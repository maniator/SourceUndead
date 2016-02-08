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
		let response = {};

		//promisfy redis methods to stop sync async response issue
		let keysAsync = Promise.promisify(client.keys, {context: client});
		let smembersAsync = Promise.promisify(client.smembers, {context: client});

		//define async function
		async function getOpenLobbies() {
			//await responses from async redis keys method
			const games = await keysAsync("*game*");
			//await response from mapped smembers method
			const players = await Promise.all(games.map(game => smembersAsync(game)));
			//compile results of awaited methods into object to return
			const combined = games.map((game, i) => ({game, players: players[i]}));
			return combined.filter(game => game.players.length);
		}
		getOpenLobbies().then(data => res.send(data));
	});
export default app;
