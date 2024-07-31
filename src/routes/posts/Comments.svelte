<script>
    export let showComments;
  </script>
  
  {#if showComments}
    <div class="giscus"></div>
  {/if}