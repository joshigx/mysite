<script>
  import SendToServerButton from "./lib/SendToServerButton.svelte";
  import About from "./routes/About.svelte";
  import Home from "./routes/Home.svelte";
  import Standard from "./routes/Standard.svelte";
  import { fade } from "svelte/transition";

  let visible = $state(true);

  let nachricht = $state("");

  let CurrentPage = $state(Standard);
</script>

<main>
  <label for="seiten-auswahl"></label>

  <select id="seiten-auswahl" bind:value={CurrentPage}>
    <option value={About}>About</option>
    <option value={Home}>Home</option>
  </select>

  <CurrentPage />

  <label>
    <input type="checkbox" bind:checked={visible} />
    visible
  </label>

  {#if visible}
    <p>Fades in and out</p>
  {/if}

  <SendToServerButton />

  <p>Folgende Nachricht erhalten: {nachricht}</p>
</main>
