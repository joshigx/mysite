import { Connection } from "./Connection.class.js";

// Definiere eine neue Klasse "Server" und exportiere diese, so dass sie in andere Dateien eingebunden werden kann.
export class Server {
	/**
	 * Der Konstruktor wird aufgerufen, sobald die Klasse mit "new Server(80)" instanziert wird.
	 * Der Port wird hierbei als erstes Argument erwartet und ist im Beispiel 80.
	 */
	constructor(port) {
		/**
		 * Mit "this" wird auf die Instanz der Klasse zugegriffen.
		 * Jede Instanz kann eigene Eigenschaften wie Variablen und Methoden (Klassenbezogene Funktionen) halten.
		 */
		this.port = port;
		this.clients = new Map();
		this.rooms = new Map();

		/**
		 * Serves HTTP requests with the given handler
		 */
		Deno.serve({
			port: this.port,
			handler: async (request) => {
				if (request.headers.get("upgrade") === "websocket") {
					return this.serveSocket(request);
				} else {
					return await this.serveWeb(request);
				}
			}
		});
	}

	/**
	 * Diese Methode kümmert sich um alle Websocket Anfragen
	 * @param {Request} request 
	 * @returns 
	 */
	serveSocket(request) {
		// If the request is a websocket upgrade,
		// we need to use the Deno.upgradeWebSocket helper
		const { socket, response } = Deno.upgradeWebSocket(request);
		socket.addEventListener("open", () => {
			console.log("CONNECTED");
			// Erstelle eine neue Instanz der Connection Class 
			const connection = new Connection(socket, this);
			connection.send({
				"type": "init",
				clientId: connection.uuid
			})
			this.clients.set(connection.uuid, connection);
		});
		return response;
	}

	/**
	 * Diese Methode kümmert sich um alle Webserver Anfragen
	 * @param {Request} request 
	 * @returns 
	 */
	async serveWeb(request) {
		// Wenn es eine normale HTTP-Anfrage ist, prüfen wir den Pfad der angeforderten Datei
		const url = new URL(request.url);

		const basePath = "./src/frontend";
		let filePath = `${basePath}${url.pathname}`;

		//Hier routen wir die sichtbare URL (url.pathname)
		//mit den interenen Dateinen (filePath)

		//if(url.pathname === "/" || url.pathname.startsWith("/login")) {
			if(url.pathname === "/") {
			filePath = `${basePath}/index.html`;
		} 
		
		//Wenn die angefragte URL /impressum ist
		else if (url.pathname === "/impressum")
			
			{

				//senden wir die Datei mit folgendem Pfad zurück
				filePath = `${basePath}/impressum.html`;
		}

		else if (url.pathname === "/game")
			
			{

				//senden wir die Datei mit folgendem Pfad zurück
				filePath = `${basePath}/game.html`;
		}
				
		
		else if (url.pathname.endsWith(".html")) {
			console.log("URL mit html Endung angefragt");

			return new Response(null, {
				status: 301,
				headers: { Location: "/" },
			})
		}

		console.log("Der Datei-Pfad ist: ", filePath);

		try {
			// Den Inhalt der Datei lesen
			const file = await Deno.open(filePath, { read: true });
			const ext = filePath.split(".").pop();

			// Den richtigen Content-Type für die Datei festlegen
			// Über ein JSON Objekt können wir die Typen dynamischer nachpflegen :)
			const types = {
				"js": "application/javascript",
				"css": "text/css",
				"html": "text/html"
			};
			const contentType = types[ext] !== null ? types[ext] : "application/octet-stream";

			return new Response(file.readable, {
				headers: { "Content-Type": contentType },
			});
		} catch (e) {
			console.error(e);
			// Wenn die Datei nicht gefunden wird, eine 404-Antwort senden
			return new Response("404: Datei nicht gefunden", { status: 404 });
		}
	}
}