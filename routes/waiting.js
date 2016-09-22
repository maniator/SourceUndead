"use strict";
import express from "express";
import {client, io} from "../server";
import Promise from "bluebird";
const app = express.Router();

/*
	If the user is logged in, redirect to waiting room page
 */
app.route("/:id")
	.get((req, res) => res.render('waiting.ejs')) //render form
	
app.route("/:id")
	.post((req, res) => {
		let response = {};
		const id = req.params.id;
		//promisfy redis methods to stop sync async response issue
		let keysAsync = Promise.promisify(client.keys, {context: client});
		let smembersAsync = Promise.promisify(client.smembers, {context: client});
		let hgetallAsync = Promise.promisify(client.hgetall, {context: client});
		//define async function
		async function getPlayers() {
			const games = await keysAsync("*game*");
			//await response from mapped smembers method
			const players = await Promise.all(games.map(game => smembersAsync(game)));
			console.log("Waiting room", players);
			//metadata
			const playerData = await Promise.all(players[0].map(player => hgetallAsync(player)));
			console.log("Waiting room", playerData);
			const metakey = await keysAsync("*metadata*");
			const data = await Promise.all(metakey.map(meta => hgetallAsync(meta)));
			//compile results of awaited methods into object to return
			const combined = games.map((game, i) => ({
				game,
				players: playerData,
				meta: data.filter(d => d.id === game.replace("game-",""))[0]
			}));
			return combined.filter(game => game.players.length);
		}
		getPlayers().then(data => res.send(data[0]));
	});
export default app;
