<style lang='scss'>
	@import 'src/styles/SinglePage.scss';
    div[contenteditable] {
      border: 1px solid #ccc;
      padding: 10px;
      min-height: 200px;
      margin-top: 20px;
      font-family: monospace;
      white-space: pre-wrap;
      
      & > div {

        overflow-x: scroll;
      }
    }
    .instructions {
      font-family: Arial, sans-serif;
      margin-bottom: 20px;
    }
  
    .instructions h2 {
      margin-top: 0;
    }
  
    .instructions p {
      margin: 5px 0;
    }
  
    .instructions ol {
      margin: 15px 0;
    }
  
    .instructions pre {
      padding: 10px;
      border-radius: 5px;
      overflow-x: auto;
    }
  
    .note {
      padding: 10px;
      border-left: 5px solid #ffeeba;
      margin-bottom: 20px;
    }
  </style>
  
<div role="main" class="singlePage">
  <div class="instructions">
    <br>
    <h2>Using Grammarly with VSCode</h2>
    <p>
      This page provides a simple yet effective trick to use Grammarly to check your Markdown files from VSCode. Follow these steps:
    </p>
    <div class="note">
      <strong>Note:</strong> You need to have the Grammarly web browser plugin installed and activated for this to work.
    </div>
    <ol>
      <li>Open your Markdown file in VSCode.</li>
      <li>Copy all the Markdown content from your file.</li>
      <li>Paste the copied content into the input box below. See your theme highlighted copy over, too? How exciting!</li>
      <li>Grammarly will automatically start checking the text, and you can make corrections directly within the input box.</li>
      <li>Once you're done with the corrections, copy the updated Markdown from the input box.</li>
      <li>Paste the corrected Markdown back into your Markdown file in VSCode.</li>
    </ol>
    <p>
      Use the input box below to paste and edit your Markdown content:
    </p>
  </div>
  
  <div contenteditable="true" class="contenteditable"></div>
  
  <p>
    Copy the corrected text back to your Markdown file in VSCode once you're done.
  </p>
  
</div>