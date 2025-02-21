let output = null;

addEventListener("load", () => {
	output = document.querySelector("#output");
});

const wsUri = `ws://${window.location.host}/`;
const websocket = new WebSocket(wsUri);

let page = "login";

function send(msg)
{
	websocket.send(JSON.stringify(msg))
}

function createRoom() {
	send({
		type: "createRoom",
		nameRoomToCreate: document.getElementById("create-room-name").value,
		passwordRoomToCreate: document.getElementById("create-room-password").value
	})
	console.log("Erstellung eines Raumes beim Server angefragt");
}

function sendServerLog(log) {
	send({
		type: "log",
		log: log,
	})
}
function createUser() {
	send({
		type: "createUser",
		id: document.getElementById("user-name").value,
	})
}




function joinRoom() {
	send({
		type: "login",
		roomToJoin: document.getElementById("room-id").value,
		passwordOfRoom: document.getElementById("room-password").value,
	})
	console.log("Raum-Beitrittsanfrage an Server gesendet.");

}

function chatAll() {
	//Legt fest, welche Infos in der Nachricht msg drinnen sind
	//Typ, Text, ID(=Nutzername), Zeit
	send({
		type: "message",
		text: document.getElementById("input").value,
		date: Date.now(),
	})

	document.getElementById("input").value = "";
}


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
			break;
		case "redirect":
			document.getElementById(page).style.display = "none";
			page = msg.page;
			document.getElementById(page).style.display = "block";
			break;
		case "reject-username":
			text = `Your username has been set to <em>${msg.name}</em> because the name you chose is in use.<br>`;
			break;
		case "user-list":
			document.getElementById("user-list-box").innerText = msg.users.join("\n");
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
