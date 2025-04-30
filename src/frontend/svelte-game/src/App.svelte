<script>
  import SendToServerButton from "./lib/SendToServerButton.svelte";
  import { fade } from 'svelte/transition';

  let visible = $state(true);



  let nachricht = $state("");
</script>

<main>
  <h1>Hey</h1>

  <label>
    <input type="checkbox" bind:checked={visible} />
  visible
  </label>

  {#if visible}

  <p transition:fade>
    Fades in and out
  </p>

  {/if}
  

  





  <SendToServerButton/>
  
  <p>Folgende Nachricht erhalten: {nachricht}</p>

</main>
