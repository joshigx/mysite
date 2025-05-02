<script>
  let { hash } = $props();
  import SendToServerButton from "/home/deno-server/Schreibtisch/deno/server_josua/src/frontend/svelte-game/src/lib/SendToServerButton.svelte";

  let visible = $state(true);

  let roomID = $state("");
  let length = $state(6);

  function generateRoomID(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    // Konvertiere den String in ein Array von Zeichen
    const charactersArray = characters.split("");

    // Fisher-Yates Shuffle
    for (let i = charactersArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [charactersArray[i], charactersArray[j]] = [
        charactersArray[j],
        charactersArray[i],
      ];
    }

    // Nehme die ersten 'length' Zeichen vom gemischten Array
    roomID = charactersArray.slice(0, length).join("");
  }
</script>

<h1>Spielwiese</h1>
<p>Hier werden FUnktionen usw ausprobiert</p>
<h1>Zufälliger Code</h1>
<p>Zufälliger Code aus Großbuchstaben und Zahlen</p>
<p>Länge des Codes (zwischen 0 und 36) <input bind:value={length} /></p>

<p>Zufälliger Code: {roomID}</p>
<button
  onclick={() => {
    generateRoomID(length);
  }}>Generieren</button
>
<p>Hier könnte irgendwas interessantes stehen</p>
<label>
  <input type="checkbox" bind:checked={visible} />
  visible
</label>

{#if visible}
  <p>Fades in and out</p>
{/if}

<SendToServerButton />
