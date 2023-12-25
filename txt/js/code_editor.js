
function createCodeEditor(file_list, containerId) { // htmlCode, cssCode, jsCode
    let htmlCode = '';
    let cssCode = '';
    let jsCode = '';
    let files_loaded = Array(file_list.length).fill(false);
    const container = document.getElementById(containerId);
    
    file_list.forEach((file_href, index) => {
        fetch(file_href).then(response => response.text()).then(data => {
            if (file_href.toLowerCase().endsWith('css')) {
                cssCode += data;
                files_loaded[index] = true;
                generate_editor();
            } else if (file_href.toLowerCase().endsWith('html')) {
                htmlCode += data;
                files_loaded[index] = true;
                generate_editor();
            } else if (file_href.toLowerCase().endsWith('js')) {
                jsCode += data;
                files_loaded[index] = true;
                generate_editor();
            }
        });
    });


    const generate_editor = () => {
        if (files_loaded.every(v => v === true)) {
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
            htmlButton.className = 'btn-cta';
            leftEditorButtons.appendChild(htmlButton);

            const cssButton = document.createElement('button');
            cssButton.textContent = 'CSS';
            cssButton.className = 'btn-cta';
            leftEditorButtons.appendChild(cssButton);

            const jsButton = document.createElement('button');
            jsButton.textContent = 'JS';
            jsButton.className = 'btn-cta';
            leftEditorButtons.appendChild(jsButton);

            const popOutButton = document.createElement('button');
            popOutButton.innerHTML = '&#9974;';
            popOutButton.className = 'btn-cta';
            rightEditorButtons.appendChild(popOutButton);

            const downloadButton = document.createElement('button');
            downloadButton.textContent = 'Download';
            downloadButton.className = 'btn-cta';
            rightEditorButtons.appendChild(downloadButton);

            const runButton = document.createElement('button');
            runButton.textContent = 'Run';
            runButton.className = 'btn-cta';
            rightEditorButtons.appendChild(runButton);

            const htmlEditor = document.createElement('textarea');
            htmlEditor.setAttribute('spellcheck', false);
            htmlEditor.className = 'snippetEditor';
            htmlEditor.value = htmlCode;
            snippetEditorContainer.appendChild(htmlEditor);

            const cssEditor = document.createElement('textarea');
            cssEditor.setAttribute('spellcheck', false);
            cssEditor.className = 'snippetEditor';
            cssEditor.value = cssCode;
            snippetEditorContainer.appendChild(cssEditor);

            const jsEditor = document.createElement('textarea');
            jsEditor.setAttribute('spellcheck', false);
            jsEditor.className = 'snippetEditor';
            jsEditor.value = jsCode;
            snippetEditorContainer.appendChild(jsEditor);

            let iframe = document.createElement('iframe');
            iframe.id = 'result-container';
            iframe.style.display = 'none';
            snippetEditorContainer.appendChild(iframe);

            function popOut(html, css, js) {
                const popOutWindow = window.open('', '_blank', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800,height=600');
                popOutWindow.html = html;
                popOutWindow.css = css;
                popOutWindow.js = js;
        
                popOutWindow.document.open();
                popOutWindow.document.write(`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="/txt/css/snippettester.css"><link rel="stylesheet" href="/txt/css/snippettester_popup.css"><script src="/txt/js/popout_code_editor.js"><\/script></head><body><div id="target-container"></div><script>window.onload = () => createCodeEditor(html, css, js, 'target-container');<\/script></body></html>`);
        
                popOutWindow.document.close();
            }

            popOutButton.addEventListener('click', () => popOut(htmlEditor.value, cssEditor.value, jsEditor.value));
            htmlButton.addEventListener('click', () => showEditor(htmlEditor));
            cssButton.addEventListener('click', () => showEditor(cssEditor));
            jsButton.addEventListener('click', () => showEditor(jsEditor));
            downloadButton.addEventListener('click', () => downloadAsHTML(htmlEditor.value, cssEditor.value, jsEditor.value));
            runButton.addEventListener('click', () => compileAndRun(htmlEditor.value, cssEditor.value, jsEditor.value));
            compileAndRun(htmlEditor.value, cssEditor.value, jsEditor.value);
        }
    }

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
