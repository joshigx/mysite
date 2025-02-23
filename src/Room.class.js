
export class Room {
	constructor(name, password, admin) {
		this.name = name;
		this.password = password;
		this.clients = new Map();
		this.allAnswers = [];
		this.admin = admin;
		this.open = true;
	}

	broadcast(msg) {
		console.log("SEND", msg);
		for (const [uuid, client] of this.clients) {
			client.send(msg);
		}
		console.log("DONE");
	}

	randomize(arr) {

		// Start from the last element and swap 
		// one by one. We don't need to run for 
		// the first element that's why i > 0 
		for (let i = arr.length - 1; i > 0; i--) {

			// Pick a random index from 0 to i inclusive
			let j = Math.floor(Math.random() * (i + 1));

			// Swap arr[i] with the element 
			// at random index 
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
	}

	waitForCondition(checkFunction, interval = 100) {
		return new Promise(resolve => {
			let check = setInterval(() => {
				if (checkFunction()) {
					clearInterval(check);
					resolve();
				}
			}, interval);
		});
	}

	redirectAll(page) {
		for (const [uuid, client] of this.clients) {
			client.redirect(page);
		}

	}




	showResults() {
		console.log("showResults() wurde aufgerufen");

		//Die Bedingung die gecheckt wird
		const conditionFunction = () => {

			const condition = (this.clients.size === this.allAnswers.length);
			return condition;

		}

		// Prüfen, ob alle Clients bereit sind
		const waitForAllClients = async () => {
			console.log("Warte, bis alle Clients geantwortet haben");
			await this.waitForCondition(conditionFunction);
			//Sobald alle die Antwort abgeschickt haben, wird folgender Code ausgeführt:
			{
				this.redirectAll("resolve");
				this.open = false;
				this.randomize(this.allAnswers);
				function getAnswers(array) { 
					const result = array.map((el, i) => `${String.fromCharCode(65 + i)}: ${el}`).join("\n"); 
					return result;
				}
				const msg = {
					type: "show-answers",
					answers: getAnswers(this.allAnswers),
				}

				this.broadcast(msg);

				const msgAdmin = {
					type: "show-admin-panel",
					msg
				}

				console.log("Alle CLients haben geantwortet und wurden weitergeleitet");
				//Hier muss dieser Fisher Shuffle ALogrhytmus rein
			}


		};






		waitForAllClients();

	}




}