(() => {
	"use strict";
	//create the socket connection
	const socket = io();
	
	function setLocation(x,y) {
		document.getElementById("x").textContent = x;
		document.getElementById("y").textContent = y;
	}
	//emission routes
	//init location
	socket.on("location", data => {
		console.log(data)
		setLocation(data.data.x, data.data.y)
	});
	//I need to rename this one...
	socket.on("somethingelse", data => addEventLog(data.msg));
	//broadcasted player locations
	socket.on("locations", data => addEventLog(data.location));
	//if players are on the same tile, this will trigger
	socket.on("sameTile", data => addEventLog(data.msg));
	//on bearing event
	socket.on("bearing", data => {
		const bearing = data.direction;
		console.log(bearing)
		let el = document.querySelector("[data-direction='"+bearing.toLowerCase()+"']");
		el.style.backgroundColor = "red";
		setTimeout(() => {
			el.style.backgroundColor = "white";
		},1000);

	});
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