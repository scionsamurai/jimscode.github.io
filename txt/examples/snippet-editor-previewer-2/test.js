function createCodeEditor(htmlCode, cssCode, jsCode, containerId) {
    console.log('start')
    const container = document.getElementById(containerId);

    const snippetEditorContainer = document.createElement('div');
    snippetEditorContainer.id = 'snippetEditor-container';
    container.appendChild(snippetEditorContainer);

    const snippetEditorButtons = document.createElement('div');
    snippetEditorButtons.id = 'snippetEditor-buttons';
    snippetEditorButtons.style.display = 'flex';
    snippetEditorButtons.style.justifyContent = 'space-between';
    snippetEditorContainer.appendChild(snippetEditorButtons);

    const rightEditorButtons = document.createElement('div');
    snippetEditorButtons.appendChild(rightEditorButtons);

    const leftEditorButtons = document.createElement('div');
    snippetEditorButtons.appendChild(leftEditorButtons);
    
    const htmlButton = document.createElement('button');
    htmlButton.textContent = 'HTML';
    leftEditorButtons.appendChild(htmlButton);

    const cssButton = document.createElement('button');
    cssButton.textContent = 'CSS';
    leftEditorButtons.appendChild(cssButton);

    const jsButton = document.createElement('button');
    jsButton.textContent = 'JS';
    leftEditorButtons.appendChild(jsButton);

    const runButton = document.createElement('button');
    runButton.textContent = 'Run';
    rightEditorButtons.appendChild(runButton);

    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download';
    rightEditorButtons.appendChild(downloadButton);

    const popOutButton = document.createElement('button');
    popOutButton.innerHTML = '&#9974;';
    rightEditorButtons.appendChild(popOutButton);



    const htmlEditor = document.createElement('textarea');
    htmlEditor.className = 'snippetEditor';
    htmlEditor.value = htmlCode;
    snippetEditorContainer.appendChild(htmlEditor);

    const cssEditor = document.createElement('textarea');
    cssEditor.className = 'snippetEditor';
    cssEditor.value = cssCode;
    snippetEditorContainer.appendChild(cssEditor);

    const jsEditor = document.createElement('textarea');
    jsEditor.className = 'snippetEditor';
    jsEditor.value = jsCode;
    snippetEditorContainer.appendChild(jsEditor);

    let iframe = document.createElement('iframe');
    iframe.id = 'result-container';
    iframe.style.display = 'none';
    snippetEditorContainer.appendChild(iframe);

    
    function popOut(html, css, js) {
        const popOutWindow = window.open('', '_blank', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800,height=600');
        const editorCss = `body {
            margin: 0;
            overflow: hidden;
        }
        #editor-container {
            height: 20rem;
            position: fixed;
            width: 100%;
        }
        #editor-buttons {
            background-color: #f2f2f2;
            padding: 10px;
            align-items: center;
        }
        #editor-buttons button {
            margin: 5px;
        }
        #result-container {
            border: none;
            width: 100%;
            height: 100%;
        }
        .editor {
            display: none;
            width: 100%;
            height: 100%;
        }
        #snippetEditor-buttons {
            background: grey;
        }
        textarea, iframe {
            width: 100%;
            height: 98vh;
        }`;
        popOutWindow.html = html;
        popOutWindow.css = css;
        popOutWindow.js = js;

        popOutWindow.document.open();
        popOutWindow.document.write(`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${editorCss ? editorCss : ''}</style><script src="/txt/examples/snippet-editor-previewer-1/test.js"><\/script></head><body><div id="target-container"></div><script>window.onload = () => createCodeEditor(html, css, js, 'target-container');<\/script></body></html>`);

        popOutWindow.document.close();
    }
    popOutButton.addEventListener('click', () => popOut(htmlEditor.value, cssEditor.value, jsEditor.value));

    htmlButton.addEventListener('click', () => showEditor(htmlEditor));
    cssButton.addEventListener('click', () => showEditor(cssEditor));
    jsButton.addEventListener('click', () => showEditor(jsEditor));
    downloadButton.addEventListener('click', () => downloadAsHTML(htmlEditor.value, cssEditor.value, jsEditor.value));
    runButton.addEventListener('click', () => compileAndRun(htmlEditor.value, cssEditor.value, jsEditor.value));
    compileAndRun(htmlEditor.value, cssEditor.value, jsEditor.value);

    function showEditor(snippetEditor) {
        document.querySelectorAll('.snippetEditor').forEach(e => e.style.display = 'none');
        snippetEditor.style.display = 'block';
        iframe.style.display = 'none';
    }

    function compileAndRun(html, css, js) {
        const resultHTML = `<!DOCTYPE html><html><head><style>${css ? css : ''}</style></head><body>${html ? html : ''}<script>${js ? js : ''}</scr${'ipt>'}</body></html>`;
        let iframeNew = document.createElement('iframe');
        document.querySelector('iframe').replaceWith(iframeNew);
        iframe = iframeNew;
        iframe.contentDocument.open();

        iframe.contentDocument.write(resultHTML);
        iframe.contentDocument.close();

        iframe.style.display = 'block';
        document.querySelectorAll('.snippetEditor').forEach(e => e.style.display = 'none');
    }
    
    function downloadAsHTML(html, css, js, fileName = 'index.html') {
        const resultHTML = `<!DOCTYPE html><html><head><style>${css ? css : ''}</style></head><body>${html ? html : ''}<script>${js ? js : ''}</scr${'ipt>'}</body></html>`;
        const blob = new Blob([resultHTML], { type: 'text/html' });
        const link = document.createElement('a');
    
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
    
        // Append the link to the body to trigger the download
        document.body.appendChild(link);
        link.click();
    
        // Remove the link from the DOM
        document.body.removeChild(link);
    }
}

// Example usage:
const htmlCode = `<h1>Hello, World!</h1>`;
const cssCode = `body {
background-color: yellow;
}`;
const jsCode = `console.log('Hello, World!');`;

createCodeEditor(htmlCode, cssCode, jsCode, 'target-container');