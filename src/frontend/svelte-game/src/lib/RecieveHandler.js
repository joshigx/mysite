export class RecieveHandler {


constructer () {

}


handleIncomingMessage(e) {
    console.log("handleIncomingMessage wurde erreicht");
    
    //Zuerst wird die Nachricht in ein JSON-Objekt umgewandelt
    try {
        const string = e.data
        const msg = JSON.parse(e.data);
        console.log(string);


        //Hier werden die Typen mit den Funktionen verknüpft
        //Hier kommt rein, bei welche Aktion ausgelöst wird je nachdem, welcher Typ von Nachricht reinkommt
        const handlers = {
            //"redirect": () => this.handleRedirect(msg),
           // "login-info": () => this.handleLoginInfo(msg),
            "alert": () => this.handleAlert(msg),
           //"show-answers": () => this.handleShowAnswers(msg),
          //"show-admin-panel": () => this.handleShowAdminPanel(msg),
            // "": () => this. (),
            // "": () => this. (),
            // "": () => this. (),
            // Hier kommen die ganzen Handler rein

        };


        if (handlers[msg.type]) {
            handlers[msg.type]();

        }

        else {
            console.log("Nachricht unbekannten Typs ist eingetroffen");

        }




    }

    catch (e) {
        console.error(e);
    }


}


//Message Handler Funktionen

handleAlert(msg) {
    console.log("handleAlert wurde erreicht");
    
    alert(msg.alert);

}




}