(() => {
	"use strict";
	document.getElementById("createGame").addEventListener("click", event => {
		event.preventDefault();
		const name = document.getElementById("lobby").value;
		const priv = document.getElementById("private").checked;

		let showError = document.getElementById("error");
		let error = 0; //track number of errors
		let errorMsg = ""; //append to me!

		//check input length (basic validation)
		if (name.length < 1) {
			error++;
			errorMsg += " You can't create an no-name game lobby."
		}
		if (error) {
			showError.classList.add("error");
			showError.textContent = errorMsg;
		} else {
			xhr({
				url : "/createGame",
				data :`name=${name}&permission=${priv}`,
				method: "POST"
			}).then(data => {
				let response = JSON.parse(data);
				console.log(data);
				if (response["flag"] === true) toggleError(showError, "success", "error");
				else toggleError(showError, "error", "success");
				showError.textContent = response["msg"];
				setTimeout(() => {
					window.location.href = `/waiting/${response['id']}`;
				}, 2000)
			});
		}
	}, false);
})();
