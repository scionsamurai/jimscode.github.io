<script>
    export let githubLink = '';
  </script>
  
  <div class="feedback-box">
    <h3>Help Improve This Page</h3>
    <p>
      Spot an error or have a suggestion? This page is a Markdown file, making it easy to contribute:
    </p>
    <ol>
      <li>Click the "Edit on GitHub" button below</li>
      <li>Look for the pencil icon in the GitHub interface</li>
      <li>Make your changes and submit a pull request</li>
    </ol>
    <a href={githubLink} class="edit-button">Edit on GitHub</a>
    <p class="alternative">
        <strong>Can't edit directly?</strong> Share your feedback or report issues in the comments below. We appreciate your input!
    </p>
  </div>
  
  <style>
    .feedback-box {
      border-radius: 4px;
      padding: 1rem;
      margin-top: 2rem;
    }
  
    h3 {
      margin-top: 0;
    }
  
    .edit-button {
      display: inline-block;
      background-color: #0366d6;
      color: white;
      padding: 0.5rem 1rem;
      text-decoration: none;
      border-radius: 4px;
      margin-top: 1rem;
    }
    .edit-button:visited {
        color: white;
    }
  
    .alternative {
      font-style: italic;
      margin-top: 1rem;
    }
  </style>