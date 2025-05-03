<script>
  import SendToServerButton from "/home/deno-server/Schreibtisch/deno/server_josua/src/frontend/svelte-game/src/lib/SendToServerButton.svelte"
  import Home from "./Home.svelte";
  import About from "./About.svelte";
  
  import Standard from "./default.svelte";
  import { fade } from "svelte/transition";
  import { tick } from "svelte";
  import { onMount, onDestroy } from "svelte";


  let visible = $state(true);
  let CurrentPage = $state();
  CurrentPage = Standard;
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



  <label for="seiten-auswahl">Wähle eine Seite</label>
  <select id="seiten-auswahl" bind:value={CurrentPage}>
    <option value={About}>About</option>
    <option value={Home}>Home</option>
  </select>



  <div>
<!-- {#each  as }
  
{/each} -->


  </div>



  <nav class="menu">
    <ul>
      
<li>
        <a onclick={() => {CurrentPage = About;}}
          href="#/about">About</a
        >
      </li>



      <li>
        <a onclick={() => {CurrentPage = Home;}}
          href="#/">About</a
        >
      </li>
      
    </ul>
  </nav>

  <CurrentPage />


  <label>
    <input type="checkbox" bind:checked={visible} />
    visible
  </label>

  {#if visible}
    <p>Fades in and out</p>
  {/if}

  <!-- <SendToServerButton /> -->
</main>
