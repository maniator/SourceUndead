(() => {
	"use strict";
	//create the socket connection
	//xhr to /waiting POST
	//return list of games, and number of players waiting
	function loadWaitingRoom() {
		//first remove all waiting room stuff
		//grab wiaitng room element
		xhr({
			url : "",
			method: "POST",
		}).then(data => {
			let waiting = document.getElementById("waiting");
			while (waiting.firstChild) {
				waiting.removeChild(waiting.firstChild);
			}
			let game = JSON.parse(data);
			console.log(game);
			let count = document.createElement("span");
			count.textContent = `(${game.players.length}/15)`;
			waiting.appendChild(count);
			game.players.forEach(index => {
				console.log(index.user)
				let row = document.createElement("div");
				row.classList.add("row");

				let column = document.createElement("div");
				column.className = "twelve columns";

				//show game player data here
				let player = document.createElement("span");
				player.textContent = index.user;

				//append all to document
				column.appendChild(player);
				row.appendChild(column);
				waiting.appendChild(row);
				//parse string response to JSON and sort by most full lobby first
			});
		});
	}
	loadWaitingRoom();

	//create socket for lobby refresh triggers
	const socket = io();
	socket.on("waitingRoomRefresh", loadWaitingRoom)
})();