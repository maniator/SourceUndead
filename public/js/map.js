(() => {
	"use strict";
	//create the socket connection
	const socket = io();
	
	//emission routes
	//I need to rename this one...
	socket.on("somethingelse", data => addEventLog(data.msg));
	//broadcasted player locations
	socket.on("locations", data => addEventLog(data.location));
	//if players are on the same tile, this will trigger
	socket.on("sameTile", data => addEventLog(data.msg));
	//disconnection event
	socket.on("disconnect", data => addEventLog(data.data));
	
	//attach event listener to elements that emit a socket connection
	Array.from(document.getElementsByClassName("grid-element")).forEach(element => {
		element.addEventListener("click", (event) => {
			socket.emit("move", {
				direction : event.target.getAttribute("data-direction")
			});
		});
	});
})();