(() => {
	"use strict";
	const socket = io();

	socket.on("somethingelse", (data) => {
		addEventLog(data.msg);
	});
	Array.from(document.getElementsByClassName("grid-element")).forEach(element => {
		element.addEventListener("click", (event) => {
			socket.emit("move", {
				direction : event.target.getAttribute("data-direction")
			});
		});
	});
})();