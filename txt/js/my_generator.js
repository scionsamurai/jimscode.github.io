
function includesValue(obj, val) {
    return Object.values(obj).includes(val);
}

let generate_UID = () => Date.now().toString(36) + Math.random().toString(36).substring(2,4);


const get_foldable_rows = (input_list) => {
    let main_list = [];
    let reading_list_item = '';
    let return_items_dict = {};
    input_list.forEach(list_item => {
        if ((list_item.substring(0,4) == "@s: " && list_item.substring(list_item.length-4) == " :s@") || list_item.substring(0,4) == "@g: " || 
            list_item.substring(0,4) == "@ds " || list_item.substring(0,4) == "@cd " || list_item.substring(0,4) == "@tg " || list_item.substring(0,4) == "@md ") {
            if (!reading_list_item) { // if we aren't already reading a foldable item
                const new_id = generate_UID();
                reading_list_item = new_id;
                return_items_dict[new_id] = {
                    input_string: list_item,
                    folded_list: []
                };
                main_list = [...main_list, 'id: ' + new_id];

            } else if (return_items_dict[reading_list_item]['input_string'] == list_item) { // we are reading a foldable item and we have reached the closing tag
                reading_list_item = "";
            } else if (reading_list_item) // we are reading a foldable item and haven't reached the closing tag
                return_items_dict[reading_list_item]['folded_list'] = [...return_items_dict[reading_list_item]['folded_list'], list_item];

        } else if (reading_list_item) {
            return_items_dict[reading_list_item]['folded_list'] = [...return_items_dict[reading_list_item]['folded_list'], list_item];
        } else {
            main_list = [...main_list, list_item];
        }

    });
    return { main_list, return_items_dict }
};

let codeEditorObject = {};
function replaceMarkdownLinks(inputString) {
    // Regular expression to match [text](url) pattern
    var regex = /\[([^)]+)\]\(([^)]+)\)/g;

    // Replace [text](url) with <a href='url'>text</a>
    var replacedString = inputString.replace(regex, "<a href='$2'>$1</a>");

    return replacedString;
}
const custom_render_function = (input_unrendered_txt, target_div_id, open_files, inp_doc=document) => { // target_div_id should be passed in without "_div" at the end but should contain that in target div
    const initial_innerHTML = inp_doc.getElementById(target_div_id).innerHTML;
	let {main_list: first_level_list, return_items_dict: first_level_dict} = get_foldable_rows(input_unrendered_txt.split('\n').map(str_ing => str_ing.trim())); //.replaceAll('"','~')
	//console.log('--------------------', input_unrendered_txt.split('\n').map(str_ing => str_ing.trim()));
    let return_items_dict = {...first_level_dict};

    let unpacking_containers = [];

    const get_txt_f = (target_e, f) => {
        open_files.forEach(h => {
            if (h.path == f) {
                let return_list = h.contents.split('\n').map(str_ing => str_ing.trim());
                render_foldable(return_list ,target_e, false);
            }
        })
        // var req = new XMLHttpRequest();
        // req.onload = function(){
        //     let return_list = this.responseText.split('\n').map(str_ing => str_ing.trim());
        //     render_foldable(return_list ,target_e, false);
        //     //let {return_list: tab_names, return_dict: tab_dict} = get_foldable_rows(input_unrendered_txt.split('\n').map(str_ing => str_ing.trim().replace('"','~')), "~:# ");
        // };
        // req.open('GET', f);
        // req.send();
    };

    const render_slot = (target_e) => {
        const target_string = return_items_dict[target_e]['input_string'] + ' :s@';
        let render_list = [];
        for (const r_i in return_items_dict) {
                if (return_items_dict[r_i]['input_string'] == target_string) {
                    render_list = return_items_dict[r_i]['folded_list'];
                }
        }
        render_foldable(render_list, target_e, false);
    };

    // const get_html_f = (target_e, f) => {
    //     var req = new XMLHttpRequest();
    //     req.onload = function(){
    //         render_foldable(this.responseText ,target_e, true);
        
    //         //let {return_list: tab_names, return_dict: tab_dict} = get_foldable_rows(input_unrendered_txt.split('\n').map(str_ing => str_ing.trim().replace('"','~')), "~:# ");
    //     };
    //     req.open('GET', f);
    //     req.send();
    // }

    const reverseArr = (input) => {
        var ret = new Array;
        for(var i = input.length-1; i >= 0; i--) {
            ret.push(input[i]);
        }
        return ret;
    };

    const get_x = (values, inp_str) => {
        let return_str = '';
        let pulled_vals = '';
        if (values == 'styles') {
            if (inp_str.includes('[:') && inp_str.includes(':]')) {
                pulled_vals = inp_str.substring(inp_str.indexOf('[:')+2, inp_str.indexOf(':]'));
                return_str = inp_str.substring(0, inp_str.indexOf('[:')) + inp_str.substring(inp_str.indexOf(':]')+2);
            } else {
                return_str = inp_str;
            }
        } else if (values == 'classes') {
            if (inp_str.includes('{:') && inp_str.includes(':}')) {
                pulled_vals = inp_str.substring(inp_str.indexOf('{:')+2, inp_str.indexOf(':}'));
                return_str = inp_str.substring(0, inp_str.indexOf('{:')) + inp_str.substring(inp_str.indexOf(':}')+2);
            } else {
                return_str = inp_str;
            }
        } else if (values == 'ID') {
            if (inp_str.includes('#:') && inp_str.includes(':#')) {
                pulled_vals = inp_str.substring(inp_str.indexOf('#:')+2, inp_str.indexOf(':#'));
                return_str = inp_str.substring(0, inp_str.indexOf('#:')) + inp_str.substring(inp_str.indexOf(':#')+2);
            } else {
                return_str = inp_str;
            }
        } else if (values == 'question_type') {
            if (inp_str.includes('|:') && inp_str.includes(':|')) {
                pulled_vals = inp_str.substring(inp_str.indexOf('|:')+2, inp_str.indexOf(':|'));
                return_str = inp_str.substring(0, inp_str.indexOf('|:')) + inp_str.substring(inp_str.indexOf(':|')+2);
            } else {
                return_str = inp_str;
            }
        } else if (values == 'variables') {
            if (inp_str.includes('{#') && inp_str.includes('#}')) {
                return_str = inp_str;
                while (return_str.includes('{#') && return_str.includes('#}')) {
                    pulled_vals = return_str.substring(return_str.indexOf('{#')+2, return_str.indexOf('#}'));
                    return_str = return_str.substring(0, return_str.indexOf('{#')) + eval(pulled_vals.trim()) + return_str.substring(return_str.indexOf('#}')+2);
                }
            } else {
                return_str = inp_str;
            }

        }
        return {
            return_str,
            pulled_vals: pulled_vals.trim()
        }
    };

    const get_variables_loop = (target_e) => {
        let {return_str: inp_str} = get_x("variables", return_items_dict[target_e]['input_string']);
        let {return_str: input_string_minus2, pulled_vals: pulled_styles} = get_x("styles" ,inp_str);
        pulled_styles = pulled_styles ? ` style="${pulled_styles}" ` : pulled_styles;
        let {return_str: input_string_minus} = get_x("classes" ,input_string_minus2);
        const as_split = input_string_minus.split(' as ')[0];
        const as_val = input_string_minus.split(' as ')[1];
        if (as_split.substring(as_split.length-5) == '.json') {

            open_files.forEach(h => {
                if (h.path == as_split.split(' each ')[1]) {

                    const data = reverseArr(JSON.parse(h.contents));
                    eval(`${as_split.includes('/') ? as_split.split('/')[as_split.split('/').length -1].split('.json')[0] : as_split.split('each ')[1]} = data;`);
                    const target_div = inp_doc.getElementById(target_e);
                    for (const dt in data) {
                        target_div.innerHTML += `<li id="${as_val}_${data[dt]['id']}" class="${as_val}" ${pulled_styles}></li>`;
                        eval(`${as_val} = data[dt];`);
                        render_foldable(return_items_dict[target_e]['folded_list'], `${as_val}_${data[dt]['id']}`, false);
                    }
                    
                }
            });
        } else {
            // right here! need to parse list
            const target_div = inp_doc.getElementById(target_e);
            const target_array = JSON.parse(as_split.split(' each ')[1]);
            for (const dt in target_array) {
                target_div.innerHTML += `<li id="${as_val}_${target_array[dt]}" class="${as_val}" ${pulled_styles}></li>`;
                eval(`${as_val} = target_array[dt];`);
                render_foldable(return_items_dict[target_e]['folded_list'], `${as_val}_${target_array[dt]}`, false);

            }
        }
    }
    
    const render_foldable = (inp_info, parent_id, raw_html) => {
        let inner_HTML = '';
        let extra_files_to_load = [];
		let target_element = inp_doc.getElementById(parent_id);
        if (!raw_html) {
            let {main_list: collapsed_list, return_items_dict: cl_dict} = get_foldable_rows(inp_info);
            if (return_items_dict[parent_id]) return_items_dict[parent_id]['folded_list'] = collapsed_list;
            return_items_dict = {...return_items_dict, ...cl_dict};
            let html_array = [];
            let data_conditional_rules = {};
            let data_conditional_scroll = {};
            let data_responsive_rules = {};
    
            const convert_to_html = (inp_str, css_cond_rules, inp_id, r_rules, s_rules) => {
                const str_first_chars = inp_str.substring(0,4);
                let css_conditional_rules = css_cond_rules;
                let scroll_rules = s_rules
                let responsive_rules = r_rules;
                let returned_html = '';
                let conditional_css = '';
                let conditional_rules = '';
                let condition_type = '';
                let extra_lines = '';
    
    
                let {return_str: adapting_str4} = get_x("variables", inp_str);
                let {return_str: adapting_str, pulled_vals: styles} = get_x("styles", adapting_str4);
                let {return_str: adapting_str2, pulled_vals: classes} = get_x("classes", adapting_str);
                let {return_str: adapting_str3, pulled_vals: ID} = get_x("ID", adapting_str2);
                let {return_str: adapted_string, pulled_vals: question_type} = get_x("question_type", adapting_str3);
                let extra_elements = styles ? [`data-original-css="${styles}"`] : [];
                const update_extra_attributes = (object_to_review, attribute_name) => {
                    if (Object.keys(object_to_review).length !== 0 && object_to_review.constructor === Object &&
                            str_first_chars != '@r: ' && str_first_chars != '-~- ' && str_first_chars != '~s: ') {
                        // if there are conditional_css_rules and this is a chained conditional line
                        let combined_in_string = '';
                        for (let hr in object_to_review) {
                            if (hr != '' && hr != 'includes') {
                                combined_in_string = combined_in_string + `${hr}:::${object_to_review[hr]}\\|/`;
                            }
                        }
                        if (combined_in_string) extra_elements = [...extra_elements, `${attribute_name}="${combined_in_string}"`];
                    }
                };
                const get_extra_html = (object_to_review, specify_id=false) => {
                    if (Object.keys(object_to_review).length !== 0 && object_to_review.constructor === Object &&
                            str_first_chars != '@r: ' && str_first_chars != '-~- ' && str_first_chars != '~s: ') {
                        let extrahtml = '';
                        if (!ID) ID = generate_UID();
                        const apply_to = specify_id ? specify_id : ID;
                        for (let obj_to_rev in object_to_review) {
                            let extraconditions = '';
                            if (typeof object_to_review[obj_to_rev] != 'function') {
                                obj_to_rev.split(' ').forEach(w_rule => {
                                    let width_rule = w_rule.trim();
                                    if (width_rule) {
                                        extraconditions += ` and (${width_rule.substring(0,2) == 'w<' ? 'max' : 'min'}-width : ${width_rule.substring(2)}px)`;
                                    }
                                });
                                extrahtml += `@media only screen ${extraconditions} {
                                    #${apply_to}{
                                        ${object_to_review[obj_to_rev]}
                                    }
                                }`;
    
                            }
                        };
                        return extrahtml
                    }
    
                }
                update_extra_attributes(css_conditional_rules, 'data-conditional-css');
                update_extra_attributes(scroll_rules, 'data-conditional-scroll');
                let additional_html = get_extra_html(responsive_rules);
                if (typeof additional_html == 'undefined') additional_html = ''; else additional_html = '<style>' + additional_html + '</style>';
                const all_attribs = `${styles ? 'style="'+styles+'"' : ''} ${classes ? 'class="'+classes+'"' : ''} ${ID ? 'id="'+ID+'"' : ''}`;
                if (inp_str == "")
                    returned_html = '<br>'
                else if (inp_str.substring(2,4) == "# " && inp_str.substring(0,1).toLowerCase() == "h")
                    returned_html = `<${inp_str.substring(0,2)} ${all_attribs} ${extra_elements.join(" ")}>${adapted_string.substring(4)}</${inp_str.substring(0,2)}>` + additional_html;
                else if (str_first_chars == "~:q "){
                    if (!styles && !classes && !ID) returned_html = `</${question_type}>`; else returned_html = `<${question_type} ${all_attribs}  ${extra_elements.join(" ")}>` + additional_html;
                } else if (str_first_chars == "~:a ")
                    returned_html = `<${question_type} ${all_attribs} ${extra_elements.join(" ")} >${adapted_string.substring(4)}</${question_type}>` + additional_html;
                else if (inp_str.substring(0,1) == "|")
                    returned_html = `${adapted_string.substring(1)}` + additional_html;
                else if (str_first_chars == "@i: ")
                    returned_html = initial_innerHTML + additional_html;
                else if (str_first_chars == "@f: ") {
                    if (inp_str.substring(inp_str.length - 4) == ' :f@') {
                        let slot_container = inp_str.substring(4,inp_str.length - 4);
                        if (unpacking_containers.includes(slot_container)) {
                            unpacking_containers = unpacking_containers.filter(x => x != slot_container);
                        } else {
                            unpacking_containers = [...unpacking_containers, slot_container];
                            const new_id = generate_UID();
                            additional_html = get_extra_html(responsive_rules, new_id);
                            additional_html = typeof additional_html == 'undefined' ? '' : '<style>' + additional_html + '</style>';
                            extra_lines = new_id;
                            return_items_dict[new_id] = {
                                input_string: slot_container,
                                parent_id,
                                folded_list: []
                            };
                            returned_html = `<div id="${new_id}"  ${all_attribs}></div>` + additional_html;
                        };
                    } else {
                        const new_id = generate_UID();
                        additional_html = get_extra_html(responsive_rules, new_id);
                        if (typeof additional_html == 'undefined') additional_html = ''; else additional_html = '<style>' + additional_html + '</style>';
                        extra_lines = new_id;
                        return_items_dict[new_id] = {
                            input_string: adapted_string.substring(4),
                            parent_id,
                            folded_list: []
                        };
                        returned_html = `<div id="${new_id}"  ${all_attribs}></div>` + additional_html;
                    };
                } else if (str_first_chars == "@g: ") {
                    let new_id = '';
                    for (const r_i in return_items_dict) {
                        if (return_items_dict[r_i]['input_string'] == inp_str) {
                            new_id = r_i;
                            break;
                        }
                    }

                    let {return_str: input_string_minus2} = get_x("styles" ,return_items_dict[new_id]['input_string']);
                    let {return_str: input_string_minus} = get_x("classes" ,input_string_minus2); 

                    eval(input_string_minus.split(' as ')[1] + '= "";');
                    additional_html = get_extra_html(responsive_rules, new_id);
                    if (typeof additional_html == 'undefined') additional_html = ''; else additional_html = '<style>' + additional_html + '</style>';
                    extra_lines = new_id;
                    returned_html = `<ul id="${new_id}"  ${all_attribs}></ul>` + additional_html;

                } else if (str_first_chars == "@s: ") {

                    if (inp_str.substring(inp_str.length - 4) == ' :s@') {
                        returned_html = '';
                    } else {
                        const new_id = generate_UID();
                        additional_html = get_extra_html(responsive_rules, new_id);
                        if (typeof additional_html == 'undefined') additional_html = ''; else additional_html = '<style>' + additional_html + '</style>';
                        extra_lines = new_id;
                        return_items_dict[new_id] = {
                            input_string: adapted_string,
                            folded_list: []
                        };
                        returned_html = `<div id="${new_id}"></div>` + additional_html;
                    };

                } else if (str_first_chars == "@tg ") {
                    const new_id = generate_UID();
                    additional_html = get_extra_html(responsive_rules, new_id);
                    if (typeof additional_html == 'undefined') additional_html = ''; else additional_html = '<style>' + additional_html + '</style>';
                    extra_lines = new_id;
                    return_items_dict[new_id] = {
                        input_string: adapted_string,
                        folded_list: return_items_dict[inp_id]['folded_list']
                    };
                    const radio_id = generate_UID();
                    returned_html = `<div class="tab" role="tab"><input type="radio" id="${ID ? ID : radio_id}" name="${question_type}"><label for="${ID ? ID : radio_id}" tabindex="0" style="outline: none;">${adapted_string.substring(4)}</label><div class="content" role="tabpanel" aria-labelledby="${ID ? ID : radio_id}" id="${new_id}"></div></div>` + additional_html;

                } else if (str_first_chars.substring(0,2) == "![") {
                    returned_html = `<img src="${adapted_string.split('(')[1].split(')')[0]}" alt="${adapted_string.split(']')[0].slice(2)}">`;
                } else if (str_first_chars == "@md ") {
                    const new_id = generate_UID();
                    additional_html = get_extra_html(responsive_rules, new_id);
                    if (typeof additional_html == 'undefined') additional_html = ''; else additional_html = '<style>' + additional_html + '</style>';
                    extra_lines = new_id;
                    let new_list = [];
                    let in_code_block = false;
                    let open_list_block = false;
                    return_items_dict[inp_id]['folded_list'].forEach(line => {
                        line = line.replaceAll(/</g, "&lt;").replaceAll(/>/g, "&gt;");
                        if (open_list_block && !line.startsWith('- ')) {
                            open_list_block = false;
                            new_list = [...new_list, '~:q |: ul :|'];
                        }
                        
                        if (!line.startsWith("'''") && !in_code_block)
                            line = replaceMarkdownLinks(line.replaceAll(/~~(.*?)~~/g, "<span class=special_quote>$1</span>").replaceAll(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replaceAll(/\*(.*?)\*/g, '<em>$1</em>'));
                        if (in_code_block && !line.startsWith("'''")) {
                            new_list = [...new_list, line.startsWith('|') ? line : '|' + line];
                        } else if (line.startsWith("'''")) {
                            if (line == "'''") {
                                new_list = [...new_list, in_code_block];
                                in_code_block = false;
                            } else {
                                const updated_line = '@cd ' + line.slice(3);
                                new_list = [...new_list, updated_line];
                                in_code_block = updated_line;
                            }
                        } else if (line.startsWith('#')) {
                            const headingLevel = line.split(' ')[0].length;
                            const headingTag = `h${headingLevel}#`;
                            new_list = [...new_list, `${headingTag} ${line.slice(headingLevel + 1)}`];
                        } else if (line.startsWith('- ')) {
                            if (!open_list_block) {
                                open_list_block = true;
                                new_list = [...new_list, '~:q |: ul :| {: ul_class :}',  `li# ${line.slice(2)}`];
                            } else
                                new_list = [...new_list, `li# ${line.slice(2)}`];
                        } else if (line.startsWith('*') && line.endsWith('*') && line.includes('](')) {
                            new_list = [...new_list, `<a href="${line.split('(')[1].split(')')[0]}">${line.split(':')[0].slice(1)}</a>`];
                        } else {
                            new_list = [...new_list, line];
                        }

                    });
                    return_items_dict[new_id] = {
                        input_string: adapted_string,
                        folded_list: new_list
                    };
                    returned_html = `<span id="${new_id}"></span>` + additional_html;

                } else if (str_first_chars == "@ds ") {
                    const new_id = generate_UID();
                    additional_html = get_extra_html(responsive_rules, new_id);
                    if (typeof additional_html == 'undefined') additional_html = ''; else additional_html = '<style>' + additional_html + '</style>';
                    extra_lines = new_id;
                    return_items_dict[new_id] = {
                        input_string: adapted_string,
                        folded_list: return_items_dict[inp_id]['folded_list']
                    };
                    returned_html = `<details role="group"><summary role="button" aria-expanded="false" onclick="toggleExpanded()">${adapted_string.substring(4)}</summary><div id="${new_id}"></div></details>` + additional_html;

                } else if (str_first_chars == "@ce ") {
                    const specified_ID = adapted_string.substring(4);
                    let files_to_load = [];
                    for (const x in return_items_dict[specified_ID]) {
                        if (x.toLowerCase().endsWith('css') || x.toLowerCase().endsWith('html') || x.toLowerCase().endsWith('js')) {
                            files_to_load = [...files_to_load, return_items_dict[specified_ID][x]];
                        }
                    }
                    returned_html = `<div id='${adapted_string.substring(4)}' class='codeEditor' data-files='${JSON.stringify(files_to_load)}'></div>` + additional_html;

                } else if (str_first_chars == ":ce ") {
                    let per_split_string = adapted_string.split('/');
                    if (question_type in return_items_dict) {
                        return_items_dict[question_type][per_split_string[per_split_string.length-1]] = adapted_string.substring(4);
                    } else {
                        return_items_dict[question_type] = {
                            [per_split_string[per_split_string.length-1]]: adapted_string.substring(4),
                        };
                    }
                    returned_html = '';

                } else if (str_first_chars == "@cd ") {
                    const new_id = generate_UID();
                    additional_html = get_extra_html(responsive_rules, new_id);
                    if (typeof additional_html == 'undefined') additional_html = ''; else additional_html = '<style>' + additional_html + '</style>';
                    extra_lines = new_id;
                    return_items_dict[new_id] = {
                        input_string: adapted_string,
                        folded_list: return_items_dict[inp_id]['folded_list']
                    };
                    returned_html = `<pre class="hljs-pre" style="position: relative;"><code class="hljs language-${adapted_string.substring(4)}" id="${new_id}"></code><span class="hljs__link_and_copy nodisplay"><span class="link_and_copy__copy_link"></span><span class="link_and_copy__text">${adapted_string.substring(4)}</span></span></pre>` + additional_html;

                } else if (str_first_chars == "@d: ") {
                    extra_lines = adapted_string.substring(4);
                    returned_html = `<div id="${adapted_string.substring(4)}"></div>` + additional_html;
    
                } else if (str_first_chars == "-~- ") {
                    returned_html = '';
                    conditional_css = styles;
                    condition_type = 'data-responsive-css';
                    conditional_rules = adapted_string.substring(4);
                } else if (str_first_chars == "id: ") {
                    let {returned_html: new_html, extra_lines: ex_lines} = convert_to_html(return_items_dict[inp_str.substring(4)]['input_string'], css_cond_rules, inp_str.substring(4), r_rules, s_rules);
                    extra_lines = ex_lines;
                    returned_html = new_html;
                    conditional_css = styles;
                    condition_type = 'data-conditional-css';
                    conditional_rules = adapted_string.substring(4);
                } else if (str_first_chars == "@r: ") {
                    returned_html = '';
                    conditional_css = styles;
                    condition_type = 'data-conditional-css';
                    conditional_rules = adapted_string.substring(4);
                } else if (str_first_chars == "~s: ") {
                    returned_html = '';
                    conditional_css = classes;
                    condition_type = 'data-conditional-scroll';
                    conditional_rules = adapted_string.substring(4);

                } else if (str_first_chars == "li# ") returned_html = `<li ${all_attribs}  ${extra_elements.join(" ")}>${ adapted_string.substring(4) }</li>` + additional_html;
                else returned_html = `<p ${all_attribs}  ${extra_elements.join(" ")}>${ adapted_string }</p>` + additional_html;
    
                return {returned_html, conditional_css, conditional_rules, condition_type, extra_lines}
            };
            // 
            for (let i=0; i<collapsed_list.length; i++) {
                let l_item = collapsed_list[i];
                let {returned_html, conditional_css, conditional_rules, condition_type, extra_lines} = convert_to_html(l_item, data_conditional_rules, target_element.id, data_responsive_rules, data_conditional_scroll);
                if (extra_lines) extra_files_to_load = [...extra_files_to_load, extra_lines];
                if (Object.keys(conditional_css).length === 0 && Object.keys(data_conditional_rules).length !== 0) data_conditional_rules = {}; // should these be reseting
                if (Object.keys(conditional_rules).length === 0 && Object.keys(data_responsive_rules).length !== 0) data_responsive_rules = {};
                if (Object.keys(conditional_rules).length === 0 && Object.keys(data_conditional_scroll).length !== 0) data_conditional_scroll = {};
                if (condition_type == 'data-conditional-css') data_conditional_rules[conditional_rules] = conditional_css;
                if (condition_type == 'data-conditional-scroll') data_conditional_scroll[conditional_rules] = conditional_css;
                if (condition_type == 'data-responsive-css') data_responsive_rules[conditional_rules] = conditional_css;
                html_array = [...html_array, returned_html+"\n"];
            };
    
            html_array = [...html_array];
            inner_HTML = html_array.join(" ")
            
        } else inner_HTML = inp_info;
        target_element.innerHTML = inner_HTML;

        const get_var_d = (item) => {
            render_foldable(return_items_dict[item]['folded_list'].map(str_ing => str_ing.trim()), item, false); //eval(item).split('\n')
        };

        if (extra_files_to_load) {
            extra_files_to_load.forEach(extra_file => {
                if (return_items_dict[extra_file]['input_string'].includes('.txt')) 
                    get_txt_f(extra_file, return_items_dict[extra_file]['input_string'], return_items_dict[extra_file]['slot_loc']);
                else if (return_items_dict[extra_file]['input_string'].includes('.html')) 
                    get_html_f(extra_file, return_items_dict[extra_file]['input_string'], return_items_dict[extra_file]['slot_loc']);
                else if (return_items_dict[extra_file]['input_string'].includes('@s: '))
                    render_slot(extra_file);
                else if (return_items_dict[extra_file]['input_string'].substring(0,4) == '@g: ')
                    get_variables_loop(extra_file);
                else get_var_d(extra_file);
            });
        }
        
        update_conditional_css();
    };
    
    render_foldable(first_level_list, target_div_id, false);


    const checkVisible = (elm) => {
        var rect = elm.getBoundingClientRect();
        var viewHeight = Math.max(inp_doc.documentElement.clientHeight, window.innerHeight);
        return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
    }
     
}