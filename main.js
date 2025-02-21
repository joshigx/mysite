//Run with: deno run --allow-net --allow-read main.js

import { Server } from "./src/Server.class.js";

const server = new Server(80);
console.log(`Server läuft auf http://127.0.0.1:${server.port}`);