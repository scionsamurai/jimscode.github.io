function setupTabs() {
    // Get all the tab groupings on the page
    const tabGroups = document.querySelectorAll('.tabs');
    
    // Loop through each tab grouping
    for (let i = 0; i < tabGroups.length; i++) {
        const tabGroup = tabGroups[i];
    
        // Get all the tabs in the tab grouping
        const tabs = tabGroup.querySelectorAll('.tab');
    
        // Loop through each tab
        for (let j = 0; j < tabs.length; j++) {
        const tab = tabs[j];
    
        // Get the tab panel and tab button for this tab
        const tabPanel = tab.querySelector('.content');
        const tabButton = tab.querySelector('input[type="radio"]');
    
        // Set the necessary attributes and values for the tab panel and tab button
        tabPanel.setAttribute('role', 'tabpanel');
        tabPanel.setAttribute('aria-labelledby', tabButton.getAttribute('id'));
        tabButton.setAttribute('role', 'tab');
        tabButton.setAttribute('tabindex', '0');
        tabButton.setAttribute('aria-selected', 'false');
    
        // If this is the first tab, set it to be selected by default
        if (j === 0) {
            tabButton.setAttribute('checked', 'checked');
            tabButton.setAttribute('aria-selected', 'true');
            tabPanel.removeAttribute('hidden');
        } else {
            tabPanel.setAttribute('hidden', '');
        }
    
        // Set up an event listener for when the tab button is clicked
        tabButton.addEventListener('click', function () {
            // Remove the "checked" and "aria-selected" attributes from all tabs in the group
            for (let k = 0; k < tabs.length; k++) {
            tabs[k].querySelector('input[type="radio"]').removeAttribute('checked');
            tabs[k].querySelector('input[type="radio"]').setAttribute('aria-selected', 'false');
            }
    
            // Add the "checked" and "aria-selected" attributes to the clicked tab
            tabButton.setAttribute('checked', 'checked');
            tabButton.setAttribute('aria-selected', 'true');
    
            // Hide all tab panels in the group
            for (let k = 0; k < tabs.length; k++) {
            tabs[k].querySelector('.content').setAttribute('hidden', '');
            }
    
            // Show the tab panel for the clicked tab
            tabPanel.removeAttribute('hidden');
        });
        }
    }
}
let isSmoothScrolling = false;
function highlightActiveHeader() {
    if (isSmoothScrolling) return; // Exit if smooth scroll is in progress

    const headers = document.querySelectorAll('h2');
    const navLinks = document.querySelectorAll('.nav-link');
    let activeIndex = -1;
  
    headers.forEach((header, index) => {
      if (header.getBoundingClientRect().top - 25 < 100) activeIndex = index;
    });
  
    navLinks.forEach((link, index) => {
      if (index === activeIndex) link.classList.add('active');
      else link.classList.remove('active');
    });
  
    const activeLink = navLinks[activeIndex];
    if (activeLink) {
      const nav = document.querySelector('.headers #toc nav');
      nav.scrollTop = activeLink.offsetTop - 25 - nav.offsetTop;
    }
}

function smoothScrollTo(target) {
    isSmoothScrolling = true;
  
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

  
    setTimeout(() => {
      isSmoothScrolling = false;
      highlightActiveHeader();
    }, 500); // Wait for 1 second to reset the flag
}

function escapeSelector(selector) {
    return selector.replace(/[^\w\s-]/g, '-').replace(/\s+/g, '-');
  }

function copyToClipboard(textToCopy) {
    // Navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy);
    } else {
        // Use the 'out of viewport hidden text area' trick
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
            
        // Move textarea out of the viewport so it's not visible
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
            
        document.body.prepend(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
        } catch (error) {
            console.error(error);
        } finally {
            textArea.remove();
        }
    };
}

function uncheckCheckboxById(checkboxId) {
    const checkbox = document.getElementById(checkboxId);
    if (checkbox && checkbox.checked) {
        checkbox.checked = false;
    }
}

let displayingTooltip = false;
const copy_anchorlink = (e, h2Element) => {
    const anchorId = h2Element.id;
    const anchorImage = h2Element.querySelector('.anchor-image');
    e.preventDefault();
    const linkText = window.location.href.split('#')[0] + '#' + anchorId;
    try {
        copyToClipboard(linkText);
        console.log('Text copied to the clipboard!');
    } catch(error) {
        console.error(error);
    }
    if (!displayingTooltip) {
        displayingTooltip = true;
        anchorImage.innerHTML = '&#x2713;';
        // const tooltip = document.createElement('span');
        // tooltip.classList.add('tooltip');
        // tooltip.innerHTML = '&#x2713;';
        // h2Element.appendChild(tooltip);
        setTimeout(() => {
            // h2Element.removeChild(tooltip);
            displayingTooltip = false;
            anchorImage.innerHTML = '&#9875;';
        }, 2000);
    }
}

function buildHeaderLinks() {
    const toc = document.getElementById('toc');
    toc.innerHTML = "";
    const h3Element = document.createElement('h3');
    const hrElement = document.createElement('hr');
    h3Element.innerText = "In this article";
    toc.appendChild(h3Element);
    toc.appendChild(hrElement);
    const mainElement = document.querySelector('.post');
    const h2Elements = mainElement.querySelectorAll('h2');
    const nav = document.createElement('nav');
    toc.appendChild(nav);
    nav.setAttribute("aria-label", "Table of Contents")
    const navList = document.createElement('ul');
    navList.setAttribute("role", "list");
    h2Elements.forEach((h2Element, index) => {
        const liElement = document.createElement('li');
        liElement.style.display = "block"
        liElement.setAttribute("role", "listitem")
        const aElement = document.createElement('a');
        aElement.classList.add("nav-link");
        aElement.tabIndex = 0;
        aElement.href = `#${escapeSelector(h2Element.textContent)}`;
        h2Element.id = `${escapeSelector(h2Element.textContent)}`;
        h2Element.classList.add("pointer");
        aElement.textContent = h2Element.textContent;

        const anchor = document.createElement('span');
        const anchorId = escapeSelector(h2Element.textContent);
        anchor.href = '#' + anchorId;
        anchor.classList.add('anchor-image');
        anchor.innerHTML = '&#9875;';
        // anchor.innerHTML = '<img src="/images/stars.png" alt="Anchor" width="16" height="16">';
        h2Element.appendChild(anchor);
        liElement.appendChild(aElement);
        navList.appendChild(liElement);
        if (index < h2Elements.length - 1) navList.appendChild(document.createElement('hr'));
    });
    nav.appendChild(navList);
    
}
function createSlug(blogTitle) {
    // Convert to lowercase and replace spaces with %20
    const encodedSlug = blogTitle.toLowerCase().replace(/\s+/g, '%20');
  
    // Remove other special characters
    const cleanSlug = encodedSlug.replace(/[^\w%20]+/g, '');
  
    return cleanSlug;
}

function closeShareLinks() {
    const shareToggle = document.getElementById('share-toggle');
    const shareLinks = document.getElementById('share-links');
    const shareBtn = document.getElementById('share-btn');

    document.addEventListener('click', function(event) {
        const target = event.target;
        if (shareToggle.checked == true && target != shareBtn && target != shareToggle && !shareLinks.contains(target)) shareToggle.checked = false;
    });
}

function updateCopyLinks() {
    // Select all elements with the "link_and_copy__copy_link" class
    const copyLinks = document.querySelectorAll(".link_and_copy__copy_link");
  
    // Loop through each element
    for (const link of copyLinks) {
      // Add the "pointer" class and set innerHTML
      link.classList.add("pointer");
      link.classList.remove("nodisplay");
      link.innerHTML = "&#x2398;&nbsp;";
  
      // Add click event listener to the link
      link.addEventListener("click", function handleClick(event) {
        // Prevent default link behavior
        event.preventDefault();
  
        // Get the closest "hljs-pre" parent element
        const codeBlock = this.closest(".hljs-pre");
        const codeTextBlock = codeBlock.querySelector('.hljs');
  
        // Get the code block's innerText content
        const codeContent = codeTextBlock.innerText;

        // Copy the content to the clipboard
        if (navigator.clipboard) {
          navigator.clipboard.writeText(codeContent).then(
            () => console.log("Code copied successfully!"),
            (error) => {
              console.error("Error copying code:", error);
              fallbackCopyTextToClipboard(codeContent);
            }
          );
        } else {
          // Fallback for browsers that do not support navigator.clipboard
          fallbackCopyTextToClipboard(codeContent);
        }
        link.innerHTML = "&#x2713;&nbsp;";
        setTimeout(() => link.innerHTML = "&#x2398;&nbsp;", 2000);
      });
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    console.log("Code copied successfully! (using fallback)");
}