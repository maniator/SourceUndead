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
		reply.map(x => {
		client.hgetall(x, (err, reply) => {
				const msg = `${reply.user} is on ${reply.x}, ${reply.y}`;
				io.sockets.emit("locations", {location:msg});
				if (reply.id != socket.session.player.id) {
					const tile = similarTile(reply, socket);
					let prox;
					if (!tile) prox = proximity(reply, socket);
					console.log(prox);
				}
			});
		});
	});

	//string to return to client for event log
	const string = `${socket.session.player.user} has moved ${data.direction} to [${socket.session.player.x},${socket.session.player.y}]`;
	io.sockets.emit("somethingelse", {msg:string});
}

export function init(socket) {
	//redis push player to game set
		client.sadd("game-1", socket.player.id);
		client.hmset(socket.player.id, socket.player);
}

function similarTile(data, socket) {
	if (data.user == socket.session.player.user) return false;
	if (+data.x == socket.session.player.x && +data.y == socket.session.player.y) {
		const string = `${socket.session.player.user} and ${data.user} are on the same tile!`;
		io.sockets.emit("sameTile", {msg:string});
		return true;
	} else return false;
}

function proximity(data, socket) {
	// Get the distance as a unit vector
	const v = getDistance(data, socket.session.player);
	console.log("Distance to player", v)
	const rad = withinRadius(v, socket.session.player.radius);
	console.log(rad)
	if (rad) {
		const uv = makeUnit(v);
		const angle = angleFromAtan(Math.atan2(+uv.y, +uv.x));
		return angle;
	} else {
		return -1;
	}
}

function withinRadius(v, r) {
	console.log(v.l, typeof v.l, r)
	return v.l <= r;
}

function getDistance(playerA, playerB) {
	const x = playerA.x - playerB.x;
	const y = playerA.y - playerB.y;
	const l = Math.sqrt((x * x) + (y * y));
	return {x, y, l};
}

function makeUnit(v) {
	return {x: (+v.x / +v.l), y: (+v.y / +v.l), l: 1};
}

function angleFromAtan(a) {
	if (a > 0) {
		return (a * 360 / (2 * Math.PI));
	} else {
		return ((2*Math.PI + a) * 360 / (2*Math.PI));
	}
}