
export class Room {
	constructor(name, password) {
		this.name = name;
		this.password = password;
		this.clients = new Map();
	}
	
	broadcast(msg) {
		console.log("SEND", msg);
		for(const [uuid, client] of this.clients) {
			client.send(msg);
		}
		console.log("DONE");
	}
}