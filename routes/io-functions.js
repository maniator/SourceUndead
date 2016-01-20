"use strict";
import {client} from "../server";
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
export function move(io, data, socket, bucket) {
	if (data.direction === "null") {
		return false;
	}
	let [x=0,y=0] = movement[data.direction];
	if (socket.session.player.x + x > 100 || socket.session.player.x + x < 1) x = 0;
	if (socket.session.player.y + y > 100 || socket.session.player.y + y < 1) y = 0;
	socket.session.player.x += x;
	socket.session.player.y += y;
	const string = `${socket.session.player.user} has moved ${data.direction} to [${socket.session.player.x},${socket.session.player.y}]`;
	console.log(string);
	console.log(bucket)
	io.sockets.emit("somethingelse", {msg:string});
}
