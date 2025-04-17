# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- Start server: `deno task start` or `deno run -A main.js`
- Run with permissions: `deno run --allow-net --allow-read main.js`
- For linting or testing, check documentation at https://docs.deno.com
- No specific test commands found in the codebase

## Code Structure
- Backend: Server, Connection, and Room classes in `/src/backend/`
- Frontend: WebSocketManager, UIController, MessageHandler, and Buttons classes in `/src/frontend/`
- Entry point: `main.js` in the root directory
- Static resources: CSS, fonts, images in respective directories

## Code Style Guidelines
- **Classes**: Use PascalCase for class names with `.class.js` suffix (e.g., `Server.class.js`)
- **Methods**: Use camelCase for method names (e.g., `serveSocket`, `sendServerLog`)
- **Variables**: Use camelCase for variables and properties (e.g., `wsUri`, `clientId`)
- **Comments**: Mix of German and English JSDoc-style comments for methods and classes
- **Imports**: ES modules with explicit file extensions (`import { X } from "./X.class.js"`)
- **Error handling**: Use try/catch blocks with console.error for logging
- **Frontend/Backend separation**: Maintain strict separation between code in respective directories
- **WebSockets**: Used for real-time communication between client and server
- **HTML/CSS**: Separate files for different pages (index.html, game.html, blog.html)
- **Deno API**: Use Deno's built-in HTTP and WebSocket APIs
- **JSON**: For message passing between client and server components
- **Pattern**: Class-based architecture with explicit constructor initialization
- **ES6+**: Modern JavaScript features like classes, arrow functions, async/await