"use strict";
//focus on initial input when page loads
window.onload = () => document.getElementById("name").focus();
document.getElementById("login").addEventListener("click", event => {
	//stop that event!
	event.preventDefault();

	//grab DOM elements for validation
	let username = document.getElementById("name").value;
	let password = document.getElementById("password").value;
	let showError = document.getElementById("error");
	let error = 0; //track number of errors
	let errorMsg = ""; //append to me!

	//check input length (basic validation)
	if (validateInputLength(username, 0)) {
		error++;
		errorMsg += " You can't login with no username."
	}
	if (validateInputLength(password, 0)) {
		error++;
		errorMsg += " We may not have the best security, but it's better than that!"
	}

	//if error, display it
	if (error) {
		showError.classList.add("error");
		showError.textContent = errorMsg;
	} else {
		//call xhr with form data
		xhr({
			url : "/login",
			data :`user=${username}&pass=${password}`,
			method: "POST"
		}).then(data => {
			//parse response and display success/error message
			let response = JSON.parse(data);
			console.log(data);
			if (response["flag"] === true) toggleError(showError, "success", "error");
			else toggleError(showError, "error", "success");
			showError.textContent = response["msg"];
			if (response["flag"] === false) {
				console.log("redirecting to index");
				setTimeout(() => window.location.href = "/", 2000);
			}
		});
	}
}, false);