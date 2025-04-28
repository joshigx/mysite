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

		// Liste der statischen Dateien und Verzeichnisse, die direkt bereitgestellt werden sollen
		const staticPaths = ['/style.css', '/frontend.js', '/portfolio.js', '/WebSocketManager.class.js',
			'/UIController.class.js', '/MessageHandler.class.js', '/Buttons.class.js', '/DragManager.class.js',
			'/fonts', '/images', '/stammbaum/stammbaum.js'];

		// Prüfen, ob der Pfad eine statische Ressource ist
		const isStaticResource = staticPaths.some(path => url.pathname.startsWith(path));

		// Hier routen wir die sichtbare URL (url.pathname)
		// mit den internen Dateien (filePath)


		if (isStaticResource) {
			// Statische Ressourcen direkt bereitstellen
			console.log("Statische Ressource angefragt:", url.pathname);
		}



		else {

			switch (url.pathname) {
				case "/":
					// Hauptseite (Portfolio)
					filePath = `${basePath}/index.html`;
					break;
				case "/game":
					// Hauptseite (Portfolio)
					filePath = `${basePath}/game.html`;
					break;
				case "/blog":
					// Hauptseite (Portfolio)
					filePath = `${basePath}/blog.html`;
					break;
				case "/stammbaum":
						// Hauptseite (Portfolio)
						filePath = `${basePath}/stammbaum/index.html`;
						break;
				case "/stammbaum/graph":
						// Hauptseite (Portfolio)
						filePath = `${basePath}/stammbaum/graph.html`;
						break;
				case "/stammbaum/person":
					// Hauptseite (Portfolio)
					filePath = `${basePath}/stammbaum/person.html`;
					break;

				default:
					return new Response("404: Page Not Found", {
						status: 404,
						headers: { "Content-Type": "text/plain" }
					});
					break;
			}

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
				"html": "text/html",
				"json": "application/json",
				"png": "image/png",
				"jpg": "image/jpeg",
				"jpeg": "image/jpeg",
				"svg": "image/svg+xml",
				"ico": "image/x-icon",
				"ttf": "font/ttf",
				"woff": "font/woff",
				"woff2": "font/woff2"
			};

		
			const contentType = types[ext] || "application/octet-stream";

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