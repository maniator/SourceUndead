(() => {
	"use strict";
	function join(event) {
		event.preventDefault();
		const game = this.parentNode.parentNode.parentNode.id;
		xhr({
			url: "/lobby/join/",
			method: "POST",
			data: `id=${game}`
		}).then(data => {
			console.log(data);
		});
	}
	//create the socket connection
	//xhr to /lobby POST
	//return list of games, and number of players waiting
	function loadLobby() {
		//first remove all lobby stuff
		//grab lobby element
		let lobby = document.getElementById("lobby");
		while (lobby.firstChild) {
			lobby.removeChild(lobby.firstChild);
		}
		xhr({
			url : "/lobby/games",
			method: "GET"
		}).then(data => {
			console.log(data)
			//parse string response to JSON and sort by most full lobby first
			let parsed = JSON.parse(data).sort((a,b) => b.players.length - a.players.length);
			parsed.map(obj => {
				//iterate the games, create a form, and respective skeleton elements
				let form = document.createElement("form");
				form.id = obj.game; //use this id when posting player to game
				
				let row = document.createElement("div");
				row.classList.add("row");

				let column = document.createElement("div");
				column.className = "twelve columns";

				//show game player data here
				let game = document.createElement("input");
				game.value = obj.meta.name + " ("+obj.players.length+"/15)";
				game.disabled = true;
				game.type = "text";

				let button = document.createElement("button");
				button.textContent = "Join Game"
				button.className = "button";
				button.addEventListener("click", join, false);

				//append all to document
				column.appendChild(game);
				column.appendChild(button);
				row.appendChild(column);
				form.appendChild(row);
				lobby.appendChild(form);
			});
		});
	}
	loadLobby();

	//create socket for lobby refresh triggers
	const socket = io();
	socket.on("refresh", loadLobby)
	socket.on("loadWaitingRoom", data => {
		console.log(data);
		window.location.href= `waiting/${data.id}`;
	})
})();
