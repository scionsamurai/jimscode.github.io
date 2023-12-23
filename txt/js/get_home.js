const classes_to_strip = ['active'];
function formatMediaQueries(inputString) {
    let outputString = '';
    const regex = /@media\s*(.*?)\s*{\s*([\s\S]*?)\s*}/g;
    const queries = new Map();
    let match;
    
    // Extract and group media queries by size requirements
    while ((match = regex.exec(inputString))) {
        const sizeReq = match[1].replace(/\s+/g, ' ').trim();
        let query = match[2].replace(/\s+/g, ' ').trim();
        
        // Add closing bracket to the query
        query += '}';
    
        if (queries.has(sizeReq)) {
        queries.set(sizeReq, queries.get(sizeReq) + query);
        } else {
        queries.set(sizeReq, query);
        }
    }
    
    queries.forEach((query, sizeReq) => {
        outputString += `@media ${sizeReq} {\n${query}\n}\n\n`;
    });
    
    return outputString.trim();
}


function getHTML(element_id='all') {
    const maxClassCounts = {"stars": 1, "print": 0}; //"postVar": 10,
    const pretty_HTML = prettifyHTML(maxClassCounts, element_id);
    const name_el = document.getElementById('target');
    // console.log("name_el.getAttribute('data-name')", name_el.getAttribute('data-name'));
    // console.log(pretty_HTML);
    let data_name = name_el.getAttribute('data-name');
    window.parent.postMessage([data_name, pretty_HTML], '*');
}

function prettifyHTML(limitObject, elementID) {
    let bodyHTML = document.getElementById(elementID).innerHTML;
    let div = document.createElement('div');
    div.innerHTML = bodyHTML.trim();
    let styleText = extractStyles(div);
    insertStyles(styleText);
    return format(div, 0, limitObject, classes_to_strip).innerHTML + '<style>\n' + formatMediaQueries(styleText) + '\n</style>';
}
    
function extractStyles(node) {
    let styles = [];
    for (let i = 0; i < node.children.length; i++) {
        let child = node.children[i];
        if (child.tagName === 'STYLE') {
        styles.push(child.innerHTML);
        child.parentNode.removeChild(child);
        i--;
        } else {
        let childStyles = extractStyles(child);
        styles = styles.concat(childStyles);
        }
    }
    return styles.join(' ');
}
    
function insertStyles(styleText) {
    let head = document.head || document.getElementsByTagName('head')[0];
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = styleText;
    head.insertBefore(style, head.firstChild);
}
    
function format(node, level, limitObject, classesToStrip) {
    let indentBefore = new Array(level++ + 1).join('  '),
        indentAfter = new Array(level - 1).join('  '),
        textNode;
    
    let children = [];
    for (let i = 0; i < node.children.length; i++) {
        let child = node.children[i];
        if (child.tagName === 'SCRIPT') {
            child.parentNode.removeChild(child);
            i--;
            continue;
        }
        children.push(child);
    }
    
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        let classList = child.className.split(' ');
        let limitReached = false;

        for (let j = 0; j < classList.length; j++) {
            if (limitObject.hasOwnProperty(classList[j])) {
                if (limitObject[classList[j]] === 0) {
                    child.parentNode.removeChild(child);
                    limitReached = true;
                    break;
                } else {
                    limitObject[classList[j]]--;
                }
            }
            if (classesToStrip.includes(classList[j])) {
                child.classList.remove(classList[j]);
            }
        }
        if (limitReached) {
            continue;
        }
        // if (child.hasAttribute('data-original-css')) {
        //     child.removeAttribute('data-original-css');
        // }
        // if (child.hasAttribute('data-conditional-hover')) {
        //     child.removeAttribute('data-conditional-hover');
        // }
        // if (child.hasAttribute('data-conditional-scroll')) {
        //     child.removeAttribute('data-conditional-scroll');
        // }
        textNode = document.createTextNode('\n' + indentBefore);
        node.insertBefore(textNode, child);
        format(child, level, limitObject, classes_to_strip);
        if (node.lastElementChild == child) {
            textNode = document.createTextNode('\n' + indentAfter);
            node.appendChild(textNode);
        }
    }
    return node;
}
