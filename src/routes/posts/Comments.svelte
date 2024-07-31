<script>
  import { onMount } from 'svelte';
  import { changeGiscusTheme } from './post.js';

  onMount(() => {
    let theme = localStorage.getItem('color-scheme');
    let giscusAttributes = {
      src: 'https://giscus.app/client.js',
      'data-repo': 'scionsamurai/jimscode.github.io',
      'data-repo-id': 'R_kgDOK8_rSw',
      'data-category': 'Announcements',
      'data-category-id': 'DIC_kwDOK8_rS84Cb9LP',
      'data-mapping': 'pathname',
      'data-strict': '1',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      'data-theme': theme == 'dark' ? 'noborder_gray' : 'noborder_light',
      'data-lang': 'en',
      'data-loading': 'lazy',
      crossorigin: 'anonymous',
      async: ''
    };

    let giscusScript = document.createElement('script');
    Object.entries(giscusAttributes).forEach(([key, value]) =>
      giscusScript.setAttribute(key, value)
    );
    document.body.appendChild(giscusScript);

    const day_input = document.getElementById("day");
    day_input.addEventListener('click', () => changeGiscusTheme());
    const night_input = document.getElementById("night");
    night_input.addEventListener('click', () => changeGiscusTheme());
  });
</script>
  
<div class="giscus"></div>
