<script>
  import SendToServerButton from "../lib/SendToServerButton.svelte";

let { hash } = $props();
let t = $state(0);


let roomID = $state("");






</script>



<main>
<h1>Wer denkt was?</h1>
<p>aktueller Raum: </p>

<SendToServerButton btnLabel = {"Dieses Label komm aus der Game.svelte-Datei"} msgType = {"testPropmsgType"} defaultMsg = {"default prop message"}/>


</main>


<style>


</style>