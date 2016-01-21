"use strict";

/*
	Function to toggle a set of classes on an element. Removes, then adds.

	node: element to toggle
	remove: class name to be removed
	add: class name to be added
 */
function toggleError(node, remove, add) {
	node.classList.remove(remove);
	node.classList.add(add);
}

/*
	Function to check if a string is less than a specified length. Display error if true.

	string: string to run the check on
	length: minimum desired string length
	error: message to be displayed if the check is false
 */
function validateInputLength(string, length) {
	if (string.length < length) return true;
	else return false;
}

/*
	Function to simplify native XHR request. created by Robert Lemon

	url: nodejs route to send to
	data: data string template
	method: POST/GET/PUT
 */

function xhr(args) {
	return new Promise((resolve, reject) => {
		const hr = new XMLHttpRequest();
		hr.open(args.method || 'POST', args.url);
		hr.onload = () => {
			if( hr.status >= 200 && hr.status < 300 ) {
				return resolve(hr.responseText);
			}
			reject({
				message: hr.statusText
			});
		};
		hr.onerror = () => {
			reject({
				message: hr.responseText
			});
		};
		hr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		hr.send(args.data || null);
	});
}

//grab event log parent element
//insert new log item with message
function addEventLog(msg) {
	let log = document.getElementById("log");

	let wrapper = document.createElement("div");
	wrapper.classList.add("log-item");
	wrapper.classList.add("twelve");
	wrapper.classList.add("columns");

	let icon = document.createElement("i");
	icon.classList.add("menu-option-log");
	icon.classList.add("fa");
	icon.classList.add("fa-plus");

	let text = document.createElement("span");
	text.textContent = msg;

	wrapper.appendChild(icon);
	wrapper.appendChild(text);

	const lastLog = document.querySelector(".log-item")
	log.insertBefore(wrapper, lastLog);
}