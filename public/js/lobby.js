(() => {
	"use strict";
	//create the socket connection
	//xhr to /lobby POST
	//return list of games, and number of players waiting
	xhr({
		url : "/lobby/games",
		method: "GET"
	}).then(data => {
		let select = document.getElementById("lobbies");
		JSON.parse(data).map(obj => {
			let option = document.createElement("option");
			option.value = obj.game;
			option.textContent = obj.game + " ("+obj.players.length+"/11)";
			select.appendChild(option)
		});
	});
})();
