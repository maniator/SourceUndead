"use strict";
import {client, io} from "../server";

//movement map for xy coordinate modifiers (thanks @rlemon)
const movement = {
	'nw':[-1,1],
	'ne':[1,1],
	'n':[0,1],
	'sw':[-1,-1],
	'se':[1,-1],
	's':[0,-1],
	'w':[-1,0],
	'e':[1,0]
};

//socket move function
//pass in the socket session and data
export function move(data, socket, bucket) {
	if (data.direction === "null") {
		return false;
	} //if no direction, ignore this function
	//destructure map collection movement
	let [x=0,y=0] = movement[data.direction];

	//check for map boundaries
	if (socket.session.player.x + x > 100 || socket.session.player.x + x < 1) x = 0;
	if (socket.session.player.y + y > 100 || socket.session.player.y + y < 1) y = 0;
	
	//apply modification to player object
	socket.session.player.x += x;
	socket.session.player.y += y;

	client.hmset(socket.session.player.id, socket.session.player);

	client.smembers("game-1", (err, reply) => {
		console.log("game keys", reply);
		reply.map(x => {
		client.hgetall(x, (err, reply) => {
				console.log("reply",reply);
				const msg = `${reply.user} is on ${reply.x}, ${reply.y}`;
				console.log("location emit", msg);
				io.sockets.emit("locations", {location:msg});
			});
		});
	});

	//string to return to client for event log
	const string = `${socket.session.player.user} has moved ${data.direction} to [${socket.session.player.x},${socket.session.player.y}]`;
	console.log(string);
	io.sockets.emit("somethingelse", {msg:string});
}

export function init(socket) {
	//redis push player to game set
		client.sadd("game-1", socket.player.id);
		client.hmset(socket.player.id, socket.player);
}