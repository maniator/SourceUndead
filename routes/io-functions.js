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
	if (socket.request.session.player.x + x > 100 || socket.request.session.player.x + x < 1) x = 0;
	if (socket.request.session.player.y + y > 100 || socket.request.session.player.y + y < 1) y = 0;
	
	//apply modification to player object
	socket.request.session.player.x += x;
	socket.request.session.player.y += y;

	socket.emit("location", {
		data : {
			x : socket.request.session.player.x,
			y : socket.request.session.player.y
		}
	});

	client.hmset(socket.request.session.player.id, socket.request.session.player); //re-store player object with new coordinates

	/*
		Iterate game to get all player IDs
		get player object from redis, using game-id id index
		grab location
		check for functions (same tile, proximity..)
	 */
	client.smembers("game-1", (err, reply) => {
		reply.map(x => {
			client.hgetall(x, (err, reply) => {
				if (reply.user != socket.request.session.player.user) { //no point in displaying yourself to yourself
					const msg = `${reply.user} is on ${reply.x}, ${reply.y}`;
					io.sockets.emit("locations", {location:msg});
				}
				if (reply.id != socket.request.session.player.id) {
					const tile = similarTile(reply, socket);
					let prox;
					if (!tile) { //if not on the same tile
						prox = proximity(reply, socket);
						//TODO calculate directional bearing from angle returned
						const sock = bucket[reply.id];
						console.log(`Socket id of ${reply.user} - ${sock}`);
						if (prox != -1)  {
							console.log(`Sending ${prox} bearing to ${reply.user}`);
							io.sockets.connected[sock].emit("bearing", {direction: prox});
						}
					}
				}
			});
		});
	});

	//string to return to client for event log
	const string = `${socket.request.session.player.user} has moved ${data.direction} to [${socket.request.session.player.x},${socket.request.session.player.y}]`;
	io.sockets.emit("somethingelse", {msg:string});
}

function calculateBearing(prox) {
	//function by copy
	//takes an array of bearings, and accesses them via 
	return ["n", "ne", "e", "se", "s", "sw", "w", "nw"][(prox + 360 / 16) % 360 / (360 / 8) | 0]
}
//initiate redis game
export function init(socket) {
	//redis push player to game set
	client.sadd("game-1", socket.request.session.player.id);
	client.hmset(socket.request.session.player.id, socket.request.session.player);
	socket.emit("location", {
		data : {
			x : socket.request.session.player.x,
			y : socket.request.session.player.y
		}
	});
}

//funtion to check if 2 players are standing on the same time
//return true or false
function similarTile(data, socket) {
	if (data.user == socket.session.player.user) return false;
	if (+data.x == socket.session.player.x && +data.y == socket.session.player.y) {
		const string = `${socket.session.player.user} and ${data.user} are on the same tile!`;
		io.sockets.emit("sameTile", {msg:string});
		return true;
	} else return false;
}

//check distance to player via proximity check
function proximity(data, socket) {
	// Get the distance as a unit vector
	const v = getDistance(socket.session.player, data);
	console.log("Distance to player", v)
	//boolean radius check
	const rad = withinRadius(v, socket.session.player.radius);
	if (rad) {
		const uv = makeUnit(v); //make unit vector
		const angle = angleFromAtan(Math.atan2(+uv.x, +uv.y)); //get arctangent angle
		console.log("angle",angle);
		return calculateBearing(angle);
	} else {
		return -1;
	}
}

//function to check if a player has entered another's radius
function withinRadius(v, r) {
	console.log(v.l, typeof v.l, r)
	return v.l <= r;
}

//calulate actual distance between 2 players
//return object form, and length
function getDistance(playerA, playerB) {
	const x = playerA.x - playerB.x;
	const y = playerA.y - playerB.y;
	const l = Math.sqrt((x * x) + (y * y));
	return {x, y, l};
}

//create unit vector from distance object
function makeUnit(v) {
	return {x: (+v.x / +v.l), y: (+v.y / +v.l), l: 1};
}

//calculate angle using arctangent
function angleFromAtan(a) {
	if (a > 0) {
		return (a * 360 / (2 * Math.PI));
	} else {
		return ((2*Math.PI + a) * 360 / (2*Math.PI));
	}
}
