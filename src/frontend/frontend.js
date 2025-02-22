const wsUri = `ws://${window.location.host}/`;
const websocket = new WebSocket(wsUri);

let page = "login";
let output = null;

document.addEventListener('DOMContentLoaded', init);
addEventListener("load", () => {
	output = document.querySelector("#output");
});


//Initialfunktion
function init() {

	
	//verknüoft die buttons aus dem html mit den funktionen in diesem dokument
	const btn = {
		createUser: find('create-user'),
		createRoom: find('create-room'),
		joinRoom: find('join-room'),
		submit: find('submit'),
	};
	const action = 'click';
	btn.createUser.addEventListener(action, createUser);
	btn.createRoom.addEventListener(action, createRoom);
	btn.joinRoom.addEventListener(action, joinRoom);
	btn.submit.addEventListener(action, submit);

};

//Hkilfsfunktionen
function send(msg) {
	websocket.send(JSON.stringify(msg))
}
function find(obj) {
		const found = document.getElementById(obj);
		return found;
	}
function sendServerLog(log) {
	send({
		type: "log",
		log: log,
	})
}

//Button-Funktionen	
function createUser() {
	send({
		type: "createUser",
		id: find("user-name").value,
	})
}

function createRoom() {
	send({
		type: "createRoom",
		nameRoomToCreate: find("create-room-name").value,
		passwordRoomToCreate: find("create-room-password").value
	})
	console.log("Erstellung eines Raumes beim Server angefragt");
}

function joinRoom() {
	send({
		type: "login",
		roomToJoin: find("room-id").value,
		passwordOfRoom: find("room-password").value,
	})
	console.log("Raum-Beitrittsanfrage an Server gesendet.");

}

function submit() {
	send({
		type: "submit",
		text: find("input").value,
	})

	document.getElementById("input").value = "";
	//Weiterleitung Serverseitig einbauen
}

//Socket-Handler

websocket.onopen = (e) => {
	sendServerLog("Vom client aus: CONNECTED");
};

websocket.onclose = (e) => {
	writeToScreen("DISCONNECTED");
};

//Hier steht drin, was der Client macht, wenn er vom Server eine Nachricht empfängt
websocket.onmessage = (e) => {
	console.log(e.data);
	let text = "";
	const msg = JSON.parse(e.data);
	const time = new Date(msg.date);
	const timeStr = time.toLocaleTimeString();


	//Überprüft, welches "Protokoll" auf die vom Server eingehenden Nachrichten anzuwenden ist
	switch (msg.type) {
		case "id":
			clientID = msg.id;
			setUsername();
			break;
		case "message":
			output.insertAdjacentHTML("afterbegin", `(${timeStr}) ${msg.userName}: ${msg.text} <br>`);
			//text = `(${timeStr}) ${msg.id} : ${msg.text} <br>`;
			break;c
		case "redirect":
			document.getElementById(page).style.display = "none";
			page = msg.page;
			document.getElementById(page).style.display = "block";
			break;
		case "reject-username":
			text = `Your username has been set to <em>${msg.name}</em> because the name you chose is in use.<br>`;
			break;
		case "login-info":
			console.log("Login-Info bekommen" + msg.name + msg.raum);
			//Hiermit werden die Login-Information angezeigt
			document.getElementById("show-user-name").innerHTML += msg.name;
			document.getElementById("show-room-id").innerHTML += msg.raum;
			break;
		case "alert":
			alert(msg.alert);

			break;

		default:
			text = `Unknown message type: ${msg.type}`;
	}
};

websocket.onerror = (e) => {
	writeToScreen(`ERROR: ${e.data}`);
};
