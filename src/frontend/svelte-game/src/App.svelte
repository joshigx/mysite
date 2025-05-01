<script>
  
  import About from "./routes/About.svelte";
  import Home from "./routes/Home.svelte";
  import Playground from "./routes/Playground.svelte"
  import Game from "./routes/Game.svelte";
  import Standard from "./routes/default.svelte";
  import { onMount, onDestroy } from "svelte";



  let CurrentPage = $state();
  CurrentPage = Home;
  // Initialisiere den Hash-Wert
  let hash = $state(window.location.hash.substring(1) || "/");



  onMount(() => {
    // Event-Listener für Hash-Änderungen hinzufügen
    window.addEventListener("hashchange", updateHash);
  });

  onDestroy(() => {
    window.removeEventListener("hashchange", updateHash);
  });

  // Funktion zum Aktualisieren des Hash-Werts
  function updateHash() {
    hash = window.location.hash.substring(1) || "/";
  }
</script>

<main>
  <p>Aktueller Pfad: {hash}</p>
  <a onclick={()=> {CurrentPage=Home}} href="#/">Home</a>
  <br>
  <a onclick={()=> {CurrentPage=Playground}} href="#/playground">Spielwiese</a>
  <br>
  <a onclick={()=> {CurrentPage=Game}} href="#/game">Wer denkt was?</a>

  <CurrentPage />



</main>
