(() => {
	"use strict";
	//create the socket connection
	//xhr to /lobby POST
	//return list of games, and number of players waiting
	xhr({
		url : "/lobby/games",
		method: "GET"
	}).then(data => {
		console.log(data);
	});
})();
