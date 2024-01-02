function extractUrls(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    const urls = xmlDoc.getElementsByTagName('url');
    const locList = [];
    const locData = {};

    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const loc = url.getElementsByTagName('loc')[0].textContent;
        const lastmod = url.getElementsByTagName('lastmod')[0].textContent;
        const priority = url.getElementsByTagName('priority')[0].textContent;

        locList.push(loc);
        locData[loc] = {
        lastmod,
        priority,
        };
    }

    return {
        locList,
        locData,
    };
}

function generateHTML(obj) { // Generates html for directory tree
    let html = '<nav>\n<ul>\n';
    for (let item of obj) {
      if (item.type === 'file') {
        html += `<li class="file" aria-level="1" onclick="previewFile(this)" data-path="${item.path}">${item.name}</li>\n`;
      } else if (item.type === 'folder') {
        html += `<li>\n<details aria-level="1">\n<summary class="folder" aria-expanded="false">${item.name}</summary>\n`;
        if (item.items) {
          html += `<ul aria-level="2">\n${generateHTML(item.items)}</ul>\n`;
        }
        html += `</details>\n</li>\n`;
      }
    }
    html += '</ul>\n</nav>';
    return html;
}

function formatHTML(htmlString) {
    const noClosingTags = ['br', 'img', 'input', 'hr', 'meta', 'link']; // List of elements without closing tags
    const preserveNewlinesTags = ['script', 'style', 'pre']; // Tags to preserve newline characters
    const dontIndentTags = ['/pre', 'code', '/code','span', '/span', 'a', '/a', '/li', '/strong', '/p', 'strong', 'em', '/em', '/label', '/summary', '/title', '/h1', '/h2', '/h3', '/h4', '/h5', '/h6'];
    const dontAddNewlineTags = ['pre', 'code', '/code', 'span', '/span', 'a', '/a', 'li', 'p', 'strong', '/strong', 'em', '/em', 'label', 'summary', 'title', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    const alwaysReduceIndentTags = ['/head', '/div']
    const placeholderMap = new Map();
    let placeholderCount = 0;

    let special_quote_placeholders = [];
  
    // Replace attribute values with placeholders
    const modifiedHTML = htmlString.replace(/="[^"]*"/g, match => {
      const placeholder = `__PLACEHOLDER_${placeholderCount}__`;
      placeholderMap.set(placeholder, match);
      if (match.includes('special_quote') || match.includes('share_post_text')) special_quote_placeholders = [...special_quote_placeholders, placeholder];
      placeholderCount++;
      return placeholder;
    });
  
    const lines = modifiedHTML.split(/(<[^>]+>)/);
    let indentLevel = 0;
    let formattedHTML = '';
    let previous_line = '';
    let open_special_quote_span = false;
  
    lines.forEach(line => {
      line = line.trim();
      if (line) {
        const tag = line.substring(1, line.length - 1);
        const element = tag.split(' ')[0];
        const indentBool = !preserveNewlinesTags.includes(element) && !dontIndentTags.includes(element);
        previous_line = element;
        if (line.startsWith('<') && line.endsWith('>')) {
          const isOpeningTag = !tag.startsWith('/');
          // add space to start and end of line if it's em strong or special_quote
          let constains_special_quote = false;
          special_quote_placeholders.forEach(sqp => {
            if (line.includes(sqp)) constains_special_quote = true;
          });
          const add_space_before = ['strong', 'em', 'a'];
          const add_space_after = ['/strong', '/em', '/a'];
          if (add_space_before.includes(element) || constains_special_quote) {
            line = ' ' + line;
            if (constains_special_quote) open_special_quote_span = true;
          } else if (element == 'span' && open_special_quote_span) open_special_quote_span = false;
          if (add_space_after.includes(element) || (open_special_quote_span && element == '/span')) {
            line = line + ' ';
            if (open_special_quote_span && element == '/span') open_special_quote_span = false;
          }
          
          // add line to formattedHTML
          if (dontAddNewlineTags.includes(element)) {
            formattedHTML += indentBool ? ' '.repeat(indentLevel) + line : line;
          } else if (isOpeningTag && !noClosingTags.includes(element) && !dontAddNewlineTags.includes(element)) {
            formattedHTML += indentBool ? ' '.repeat(indentLevel) + line + '\n' : line + '\n';
            if (previous_line != 'pre' && element != '!doctype' && !noClosingTags.includes(element)) indentLevel++;
          } else if (!isOpeningTag) {
            if (alwaysReduceIndentTags.includes(element) || (indentLevel && !dontAddNewlineTags.includes(element) && !dontIndentTags.includes(element))) indentLevel--;
            formattedHTML += indentBool ? ' '.repeat(indentLevel) + line + '\n' : line + '\n';
          } else {
            formattedHTML += indentBool ? ' '.repeat(indentLevel) + line + '\n' : line + '\n';
          }
        } else {
          formattedHTML += line;
        }

      }
    });
  
    // Restore attribute values from placeholders
    formattedHTML = formattedHTML.replace(/__PLACEHOLDER_\d+__/g, placeholder => {
      const originalValue = placeholderMap.get(placeholder);
      return originalValue;
    });
  

  
    return formattedHTML.trim();
}
  
function generateDownload(files) {
    // Create a ZIP archive to store the files
    var zip = new JSZip();
  
    // Iterate over the files and add them to the ZIP archive
    for (const pathandname in files) {
      zip.file(pathandname.replace('.txt', '.html'), files[pathandname]);
    }
  
    // Generate the ZIP archive
    zip.generateAsync({ type: "blob" }).then(function(content) {
      // Create a temporary URL for the ZIP archive
      var url = URL.createObjectURL(content);
  
      // Create a link element and set its attributes
      var link = document.createElement("a");
      link.href = url;
      link.download = "files.zip";
  
      // Append the link element to the document body
      document.body.appendChild(link);
  
      // Simulate a click on the link to initiate the download
      link.click();
  
      // Clean up by removing the link and revoking the URL
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
}

function generateRSSFeed(items) {
    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>Jims Code Blog</title>
        <link>https://www.jimscode.blog</link>
        <description>Embark on a coding journey with Jims Code Blog - your go-to destination for insightful tutorials, innovative projects, and the latest trends in the dynamic world of software development.</description>
        <language>en-US</language>
        ${items.map(generateRSSItem).join("\n")}
      </channel>
    </rss>`;          
    return xml;
}
  
function generateRSSItem(item) {
  
    const xml = `<item>
      <title>${item.post_title}</title>
      <link>https://www.jimscode.blog${item.link}</link>
      <pubDate>${item.date}</pubDate>
      <description>${item.description.replaceAll('&', 'and')}</description>
      ${item.author ? `<author>${item.author}</author>` : ""}
      ${item.tags ? item.tags.map(tag => `<category>${tag}</category>`).join("\n") : ""}
    </item>`;
    // ${item.enclosure ? `<enclosure url="${item.enclosure.url}" type="${item.enclosure.type}" length="${item.enclosure.length}" />` : ""}
  
    return xml;
}
  
function replaceTextAfterLastBackslash(input, replacement) {
    const regex = /[^/]*$/;
    const newText = input.replace(regex, replacement);
    return newText;
}

function processFileContents(fileContents, filesArray, found_scripts, found_styles, built_HTML, blog_title, json_data, cdncss, cdnjs1, cdnjs2, after_gen_js, after_time_out_js, url_path, append_body_obj, file_path) {
  fileContents.split('-----')[0].split('\n').forEach(line => {
    line = line.trim();
    if (line.startsWith('js: ')){
      filesArray.forEach(x_var => {
        if (x_var.path == line.substring(4)) {
          found_scripts += x_var.contents + '\n';
          if (!x_var.path.includes('get_home.js') && !x_var.path.includes('my_generator.js'))
            built_HTML += `<script src='${x_var.path}'><\/script>\n`;
          // const script_x = iframe.contentDocument.createElement('script'); // create script element in iframe
          // script_x.textContent = x_var.contents;
          // extra.appendChild(script_x);
        }
      });
    } else if (line.startsWith('title: ')) {
      if (blog_title == "substring(7)") {
        built_HTML = built_HTML.replace('BlogPostTitle', line.substring(7));
      } else 
        built_HTML = built_HTML.replace('BlogPostTitle', blog_title);
    } else if (line.startsWith('css: ')) {
      filesArray.forEach(x_var => {
        if (x_var.path == line.substring(5)) {
          found_styles += '\n' + x_var.contents;
          built_HTML += `<link rel='stylesheet' href='${x_var.path}' type="text/css">\n`;
          // const style_x = iframe.contentDocument.createElement('style'); // create style element in iframe
          // style_x.textContent = x_var.contents;
          // extra.appendChild(style_x);
        }
      });

    } else if (line.startsWith('json_id: ')) {
      filesArray.forEach(x_var => {
        if (x_var.path == line.split(' in ')[1]) {
          for (const json_data of JSON.parse(x_var.contents)) {
            if (json_data.id == parseInt(line.split(' in ')[0].split('son_id: ')[1])) {
              built_HTML = built_HTML.replace('BlogMetaDesc', json_data.description);
              found_scripts += `const json_data = ${JSON.stringify(json_data)};\n`;
              filesArray.forEach(a_var => {
                if (a_var.path == replaceTextAfterLastBackslash(line.split(' in ')[1], 'authors.json')) {
                  for (const y_z of JSON.parse(a_var.contents)) {
                    if (y_z.id == json_data.authorid) {
                      found_scripts += `const author_data = ${JSON.stringify(y_z)};\n`;
                      built_HTML = built_HTML.replace('BlogMetaAuthor', y_z.name);
                    }
                  }
                }
              });
              json_data.authorid
              break;
            }
          }
          // const style_x = iframe.contentDocument.createElement('style'); // create style element in iframe
          // style_x.textContent = x_var.contents;
          // extra.appendChild(style_x);
        }
      });

    } else if (line.startsWith('path: ')) {
      url_path = line.substring(6);
      found_scripts += `const url_path = "${url_path}"\n`;
    } else if (line.startsWith('cdncss: ')) {
      cdncss += `<link rel="stylesheet" href="${line.substring(8)}">\n`;
      built_HTML += `<link rel="stylesheet" href="${line.substring(8)}">\n`;
    } else if (line.startsWith('cdnjs1: ')) {
      // cdnjs1 += `&lt;script src="${line.substring(7)}"&gt;&lt;/script&gt;\n`;
      cdnjs1 += `document.head.appendChild(document.createElement('script')).src = '${line.substring(8)}';\n`;
      built_HTML += `<script src='${line.substring(8)}'><\/script>\n`;
    } else if (line.startsWith('cdnjs2: ')) {
      // cdnjs2 += `&lt;script src="${line.substring(7)}"&gt;&lt;/script&gt;\n`;
      cdnjs2 += `document.head.appendChild(document.createElement('script')).src = '${line.substring(8)}';\n`;
      built_HTML += `<script src='${line.substring(8)}'><\/script>\n`;
    } else if (line.startsWith('ag: ')) { // add scripts after_generated

      if (line.endsWith('.js')) {
        filesArray.forEach(x_var => {
          if (x_var.path == line.substring(4)) {
            after_gen_js += x_var.contents + '\n';
            built_HTML += `<script>
              window.addEventListener('load', function() {
                var script = document.createElement('script');
                script.src = '${x_var.path}';
                document.body.appendChild(script);
              });
            <\/script>`;
          }
        });
      } else {
        after_gen_js += line.substring(4);
        built_HTML += `<script>
          window.addEventListener('load', function() {
            var script = document.createElement('script');
            script.textContent = "${line.substring(4)}";
            document.body.appendChild(script);
          });
        <\/script>`;
      }
    } else if (line.startsWith('acdnjs: ')) {
      built_HTML += `<script>${line.substring(8)}<\/script>\n`;
    } else if (line.substring(0, 'at: '.length) == 'at: ') { // add scripts after_timeout
      if (line.endsWith('.js')) {
        filesArray.forEach(x_var => {
          if (x_var.path == line.substring(4)) {
            after_time_out_js += x_var.contents + '\n';
          }
        });
      } else after_time_out_js += line.substring(4);
    } else if (line.startsWith('meta-description: ')) built_HTML = built_HTML.replace('BlogMetaDesc', line.substring(18));
    else if (line.startsWith('ab: ')) { // append_body scripts after body
      if (!append_body_obj[file_path]) append_body_obj[file_path] = { scripts: [], raw_js: ""};
      if (line.endsWith('.js')) append_body_obj[file_path].scripts = [...append_body_obj[file_path].scripts, line.substring(4)];
      else append_body_obj[file_path].raw_js += line.substring(4);
    }
  });

  return {
    found_scripts: found_scripts,
    found_styles: found_styles,
    built_HTML: built_HTML,
    json_data: json_data,
    cdncss: cdncss,
    cdnjs1: cdnjs1,
    cdnjs2: cdnjs2,
    after_gen_js: after_gen_js,
    after_time_out_js: after_time_out_js,
    url_path: url_path,
    append_body_obj: append_body_obj
  };
}

function parseDate(dateString) {
  // const dateString = "Mon, 03 Jan 2022 09:30:00 GMT";
  // const timestamp = parseDate(dateString);
  // console.log(timestamp); // Output: "1641202200000"
  
  const date = new Date(dateString);
  return date.getTime();
}

function formatTimestampToDate(timestamp) {
  // const timestamp = 1687723460047;
  // const formattedDate = formatTimestampToDate(timestamp);
  // console.log(formattedDate); // Output: "2023-06-25"

  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatTimestampToLocaleString(timestamp) {
  // const timestamp = 1687723460047;
  // const formattedDate = formatTimestampToLocaleString(timestamp);
  // console.log(formattedDate); // Output: "Sun, Jun 25, 2023, 08:04:20 PM"

  const date = new Date(timestamp);
  const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'GMT', hour12: false };
  return date.toLocaleString('en-US', options);
}

function getCurrentDateInLocaleString() {
  const currentDate = new Date();
  const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'GMT', hour12: false };
  return currentDate.toLocaleString('en-US', options).replace(/,/g, '').replace(' ', ', ');
}

function getTodayDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function processEntry(entry, input_items) {
  if (entry.isFile) {

    await new Promise((resolve) => {
      entry.file(function (file) {
        const fileData = {
          name: entry.name,
          path: entry.fullPath,
          type: 'file'
        };
        input_items.push(fileData);
        readFile(entry, file.lastModified);
        resolve(); // Resolve the promise once the file processing is complete
      });
    });

  } else if (entry.isDirectory) {
    let folder = {
      name: entry.name,
      type: 'folder',
      items: []
    };
    const directoryReader = entry.createReader();
    input_items.push(folder);
    let entries = [];
    while (true) {
      const readEntries = await new Promise((resolve, reject) => {
        directoryReader.readEntries(resolve, reject);
      });
      if (readEntries.length === 0) {
        break;
      }
      entries = entries.concat(readEntries);
    }
    await Promise.all(entries.map(async (childEntry) => {
      await processEntry(childEntry, folder.items);
    }));
  }
}

function generateSitemap(entries) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  entries.forEach((entry) => {
    xml += `  <url>\n`;
    xml += `    <loc>${entry.location}</loc>\n`;
    xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    xml += `    <priority>${entry.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;
  return xml;
}

function parseSitemapFile(fileContents) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(fileContents, 'application/xml');
  const urlElements = xmlDoc.getElementsByTagName('url');
  const sitemapEntries = [];

  for (let i = 0; i < urlElements.length; i++) {
    const urlElement = urlElements[i];
    const location = urlElement.querySelector('loc').textContent;
    const lastmod = urlElement.querySelector('lastmod').textContent;
    const changefreq = urlElement.querySelector('changefreq').textContent;
    const priority = urlElement.querySelector('priority').textContent;

    sitemapEntries.push({ location, lastmod, changefreq, priority });
  }

  return sitemapEntries;
}

function count_posts(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const postVars = doc.querySelectorAll('.postVar');
  return postVars.length
}

function removePostsFromHTML(htmlString, postsToShow, criteria) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  const postVars = doc.querySelectorAll('.postVar');
  let return_posts_added = [];

  for (let i = 0; i < postVars.length; i++) {
    const postVar = postVars[i];
    const index = parseInt(postVar.id.replace('postVar_', ''), 10);

    if (criteria.includes(index)) {
      postVar.remove();
    } else {
      if (return_posts_added.length >= postsToShow) postVar.remove();
      else return_posts_added.push(index);
    }
  }

  return { modifiedHTML: doc.documentElement.outerHTML, return_posts_added };
}

function generatePaginationLinks(totalPages, currentPage, url_loc, first_url_loc=false) {
  let paginationHTML = '';

  if (currentPage > 1) {
    if (currentPage == 2 && first_url_loc)
      paginationHTML += `<a href="${first_url_loc}">Previous</a><span class="numbered">`;
    else paginationHTML += `<a href="${url_loc.replace('[pageNum]', currentPage - 1)}">Previous</a><span class="numbered">`;
  }

  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      paginationHTML += `<span class="current">${i}</span>`;
    } else {
      if (first_url_loc && i == 1) paginationHTML += `<a href="${first_url_loc}">${i}</a>`;
      else paginationHTML += `<a href="${url_loc.replace('[pageNum]', i)}">${i}</a>`;
    }
  }
  if (currentPage < totalPages) {
    paginationHTML += `</span><a href="${url_loc.replace('[pageNum]', currentPage + 1)}">Next</a>`;
  } else paginationHTML += `</span>`;

  return paginationHTML;
}

function insertElementIntoTarget(htmlString, targetElementID, replacingElements) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  const targetElement = doc.getElementById(targetElementID);
  if (!targetElement) {
    console.error(`Target element with ID '${targetElementID}' not found.`);
    return null;
  }

  const fragment = parser.parseFromString(replacingElements, 'text/html').body;
  const elements = Array.from(fragment.childNodes);

  targetElement.innerHTML = '';
  for (const el of elements) {
    targetElement.appendChild(el);
  }

  return doc.documentElement.outerHTML;
}

function addSitemapEntry(sitemapContents, parentLocation, location, priority, changefreq) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(sitemapContents, 'text/xml');
  parentLocation = parentLocation.trim();

  const existingEntries = xmlDoc.querySelectorAll('url');
  for (const entry of existingEntries) {
    const locValue = entry.querySelector('loc')?.textContent;
    if (locValue.endsWith(parentLocation)) {
      const lastmodValue = entry.querySelector('lastmod')?.textContent;
      const newEntry = xmlDoc.createElementNS('http://www.sitemaps.org/schemas/sitemap/0.9', 'url');
      const loc = xmlDoc.createElement('loc');
      loc.textContent = location;

      const priorityElem = xmlDoc.createElement('priority');
      priorityElem.textContent = priority;

      const changefreqElem = xmlDoc.createElement('changefreq');
      changefreqElem.textContent = changefreq;

      const lastmodElem = xmlDoc.createElement('lastmod');
      lastmodElem.textContent = lastmodValue;

      newEntry.appendChild(loc);
      newEntry.appendChild(priorityElem);
      newEntry.appendChild(changefreqElem);
      newEntry.appendChild(lastmodElem);

      entry.parentNode.insertBefore(newEntry, entry.nextSibling);

      return new XMLSerializer().serializeToString(xmlDoc);
    }
  }
  console.log(existingEntries);
  console.log(`Failed to find entry for ${parentLocation}`);

  // If the entry with the specified location is not found, return the original XML
  return sitemapContents;
}

function getParentPath(path) {
  const lastSlashIndex = path.lastIndexOf('/');
  if (lastSlashIndex !== -1) return path.substring(0, lastSlashIndex);
  return path;
}
