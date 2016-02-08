(() => {
	"use strict";
	function showId(event) {
		event.preventDefault();
		console.log(this.parentNode.parentNode.parentNode);
	}
	//create the socket connection
	//xhr to /lobby POST
	//return list of games, and number of players waiting
	xhr({
		url : "/lobby/games",
		method: "GET"
	}).then(data => {
		//grab lobby element
		let lobby = document.getElementById("lobby");
		
		//parse string response to JSON and sort by most full lobby first
		let parsed = JSON.parse(data).sort((a,b) => b.players.length - a.players.length);
		parsed.map(obj => {
			//iterate the games, create a form, and respective skeleton elements
			let form = document.createElement("form");
			form.id = obj.id; //use this id when posting player to game
			
			let row = document.createElement("div");
			row.classList.add("row");

			let column = document.createElement("div");
			column.className = "twelve columns";

			//show game player data here
			let game = document.createElement("input");
			game.value = obj.game + " ("+obj.players.length+"/15)";
			game.disabled = true;
			game.type = "text";

			let button = document.createElement("button");
			button.textContent = "Join Game"
			button.className = "button";
			button.addEventListener("click", showId, false);

			//append all to document
			column.appendChild(game);
			column.appendChild(button);
			row.appendChild(column);
			form.appendChild(row);
			lobby.appendChild(form);
		});
	});
})();
