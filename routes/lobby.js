"use strict";
import express from "express";
import {client, io} from "../server";
import Promise from "bluebird";
const app = express.Router();

/*
	If the user is logged in, redirect to lobby page
 */
app.route("/")
	//if player is already in a lobby, redirect to lobby waiting room
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
		let hgetallAsync = Promise.promisify(client.hgetall, {context: client});
		//define async function
		async function getOpenLobbies() {
			//await responses from async redis keys method
			const games = await keysAsync("*game*");
			//await response from mapped smembers method
			const players = await Promise.all(games.map(game => smembersAsync(game)));
			console.log(players);
			//metadata
			const metakey = await keysAsync("*metadata*");
			const data = await Promise.all(metakey.map(meta => hgetallAsync(meta)));
			//compile results of awaited methods into object to return
			const combined = games.map((game, i) => ({
				game,
				players: players[i],
				meta: data.filter(d => d.id === game.replace("game-",""))[0]
			}));
			return combined.filter(game => game.players.length);
		}
		getOpenLobbies().then(data => res.send(data));
	});

app.route("/join")
	.post((req,res) => {
		//check if player is in another lobby, if so, return
		//TODO lobby refresh on success
        const game = req.body.id;
		console.log(game)
		client.sadd(game, req.session.player.id);
        client.hmset(req.session.player.id, req.session.player, (err, reply) => {
			if (err) {
				res.send({
					msg: "There was an error joining this lobby. Please try again.",
					success: false
				});
			} else {
				io.sockets.emit("loadWaitingRoom");
				res.send({
					msg: "You have joined the game!",
					success: true
				});
			}
		});
	});
export default app;
