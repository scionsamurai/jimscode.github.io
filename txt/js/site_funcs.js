function toggleExpanded() {
    var summary = event.target;
    var expanded = summary.getAttribute('aria-expanded') === 'true' || false;
    summary.setAttribute('aria-expanded', !expanded);
}

const update_conditional_css = () => {
    const condtnl_elmnts = document.querySelectorAll('*[data-conditional-css]');
    let checked_ids = {};
    [...condtnl_elmnts].forEach(cond_elmnt => {
        // const required_css = cond_elmnt.getAttribute('data-conditional-css'); conditional_css_string
        const conditional_css_string = cond_elmnt.getAttribute('data-conditional-css'); 
        const ccs_split_conditions = conditional_css_string.split('\\|/');
        let apply_css = cond_elmnt.getAttribute('data-original-css');
        // let apply_css = '';
        // if (t_kl.includes('[:') && t_kl.includes(':]'))
        //     apply_css = t_kl.substring(t_kl.indexOf('[:')+2, t_kl.indexOf(':]'));
        const check_condition = cond => {
            let r_css = '';
            let any_true = false;
            cond.split('||').forEach(css_rule_set => {
                let all_true = true;
                css_rule_set.trim().split('&&').forEach(cs_rule => {
                    let target_id = '';
                    let rule_opt = [];
                    let split_on = '';
                    if (cs_rule.includes('+')) split_on = '+'; else split_on = '-';
                    cs_rule.split(split_on).forEach((itm, indx) => {
                        if (!indx) target_id = itm.trim(); else rule_opt = [...rule_opt, itm.trim()];
                    });
                    
                    if (!includesValue(checked_ids, target_id.trim())) {
                        const target_el = document.getElementById(target_id);
                        if (target_el) { // should i return false on an else for this if
                            if (target_el.nodeName == "SELECT")
                                checked_ids[target_id] = target_el.value;
                            else if (target_el.type == "checkbox")
                                checked_ids[target_id] = target_el.checked.toString();
                        }
    
                    };
                    if (cs_rule.includes('+') && !rule_opt.includes(checked_ids[target_id])) all_true = false;
                    if (cs_rule.includes('-') && rule_opt.includes(checked_ids[target_id])) all_true = false;
                });
                if (all_true) any_true = true;
            });
            return any_true
        }
        ccs_split_conditions.forEach(ccs_condition => {
            if (ccs_condition) {
                let condition = ccs_condition.split(':::')[0];
                let cond_styls = ccs_condition.split(':::')[1];
                if (check_condition(condition)) {
                    apply_css = apply_css + cond_styls;
                }
            }
        });
        cond_elmnt.style.cssText = apply_css;
    });
}

const inputs_to_check = ['[type|="checkbox"]', 'select'];
inputs_to_check.forEach(input_str => {
    const inputs_found = document.querySelectorAll(input_str);
    [...inputs_found].forEach(found_input => {
        if (!found_input.classList.contains('listener')) {
            found_input.classList.add('listener');
            found_input.addEventListener('change', t => {
                update_conditional_css();
            })
        }
    });
});

update_conditional_css();

const scrollFunc = () => {
    var stickyElement = document.getElementsByClassName("widget-sticky")[0];
    if (stickyElement) this.scrollY > stickyElement.parentElement.offsetHeight -50 ? stickyElement.style.position = 'fixed' : stickyElement.style.position = 'inherit';
    const sticky_widgets = document.querySelectorAll('*[data-conditional-scroll]');
    [...sticky_widgets].forEach(sw => {
        const conditional_class_string = sw.getAttribute('data-conditional-scroll'); 

        conditional_class_string.split('\\|/').forEach(cond_class => {
            if (cond_class) {
                const query_x = cond_class.split(':::')[0];
                const class_x = cond_class.split(':::')[1];
                eval(`${query_x} ? sw.classList.add('${class_x}') : sw.classList.remove('${class_x}');`);
            }
        });
        //this.scrollY > 650 ? sw.style.display = 'block' : sw.style.display = 'none';
    })

}

window.addEventListener("scroll", scrollFunc , false);

function updateThemeCache() {
    const dayRadio = document.getElementById('day');
    const nightRadio = document.getElementById('night');

    if (dayRadio.checked) {
      localStorage.setItem('theme', 'day');
    } else if (nightRadio.checked) {
      localStorage.setItem('theme', 'night');
    }   
}

function loadThemeCache() {
    const theme = localStorage.getItem('theme');
    if (theme === 'day') {
      document.getElementById('day').checked = true;
      document.getElementById('night').checked = false;
    } else if (theme === 'night') {
      document.getElementById('day').checked = false;
      document.getElementById('night').checked = true;
    }
}

function search() {
    const input = document.getElementById("search").value.toLowerCase();
    const searchPopup = document.getElementById('searchPopup');
    searchPopup.style.display = 'block';

    fetch("/search.json")
    .then(response => response.json())
    .then(data => {
        const matchingLinks = [];
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const matches = data[key].toLowerCase().includes(input);
                if (matches) {
                    const updated_link = key.slice(1).replace('.html','');
                    matchingLinks.push(updated_link);
                }
            }
        }

        // Fetch data from the /txt/json/posts.json endpoint
        fetch("/txt/json/posts.json")
        .then(response => response.json())
        .then(postsData => {
            const matchingPosts = postsData.filter(post => matchingLinks.includes(post.link));
            // Clear previous search results
            searchPopup.innerHTML = '';

            if (matchingPosts.length === 0) {
                // If no matching posts, insert a "No results" message
                const noResultsHTML = `
                    <div class="search-post-container">
                        <h3 class="no-results-text">No results</h3>
                    </div>
                `;
                searchPopup.insertAdjacentHTML('beforeend', noResultsHTML);
            } else {
                // Create and append HTML elements for each matching post using template literals
                matchingPosts.forEach(post => {
                    const postHTML = `
                        <div class="search-post-container">
                            <a href="${post.link}">
                                <div class="post-title-date-container">
                                    <h3>${post.post_title}</h3>
                                    <span>${post.date}</span>
                                </div>
                                <img src="${post.image_thumb}" alt="Post Image" class="post-image">
                            </a>
                        </div>
                    `;
                    searchPopup.insertAdjacentHTML('beforeend', postHTML);
                });
            }
        })
        .catch(error => console.error(error));

    })
    .catch(error => console.error(error));
}


document.addEventListener('mousedown', function(event) {
    const searchPopup = document.getElementById('searchPopup');
    const searchInput = document.getElementById('search');
    
    if (!searchPopup.contains(event.target) && event.target !== searchInput) {
      searchPopup.style.display = 'none';
    }
  });
  
function generateSearchElements(containerID) {
    const container = document.getElementById(containerID);
  
    // HTML template for the search elements
    const searchElementsHTML = `
      <label for="search" class="visually-hidden">Search</label>
      <input type="search" id="search" name="search" placeholder="Search Input">
      <button onclick="search()" role="button">Search</button>
      <div class="search-popup" id="searchPopup"></div>
    `;
  
    // Set the innerHTML of the container to the search elements template
    container.innerHTML = searchElementsHTML;
}


function addHeaderListeners() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
              uncheckCheckboxById('sidebar_checkbox');
              smoothScrollTo(target);
            }
        });
    });
    
    // Add event listeners for copying anchor links
    document.querySelectorAll('h2').forEach(h2Element => {
        const anchor = h2Element.querySelector('.anchor-image');
        anchor.addEventListener('click', (event) => {
            copy_anchorlink(event, h2Element);
        });
        h2Element.addEventListener('click', (event) => {
            copy_anchorlink(event, h2Element);
        });
    });
}