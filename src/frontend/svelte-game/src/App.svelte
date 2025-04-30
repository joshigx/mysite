<script>
  import SendToServerButton from "./SendToServerButton.svelte";
  let nachricht = $state("");
</script>

<main>
  <h1>Hey</h1>

  


  <SendToServerButton/>
  
  <p>Folgende Nachricht erhalten: {nachricht}</p>

</main>
