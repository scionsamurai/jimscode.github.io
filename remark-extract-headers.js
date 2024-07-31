import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';

export function remarkExtractHeaders() {
  return (tree, file) => {
    file.data.headers = [];
    let currentHeader = null;
    let headerCounter = 0;

    const generateId = (text, index) => {
      // Convert to lowercase and replace spaces with hyphens
      let id = text.toLowerCase().replace(/\s+/g, '-');
      
      // Remove any characters that are not alphanumeric, underscore, or hyphen
      id = id.replace(/[^a-z0-9_-]/g, '');
      
      // Ensure the ID doesn't start with a number or hyphen
      id = id.replace(/^[0-9-]/, '');
      
      // Add the index
      id += `-${index}`;
      
      // Ensure the ID is not empty
      if (id === '') {
        id = `header-${index}`;
      }
      
      return id;
    };

    const addIdToNode = (node, id) => {
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      node.data.hProperties.id = id;
      node.data.hProperties.class = node.data.hProperties.class || [];
      if (!node.data.hProperties.class.includes('header')) {
        node.data.hProperties.class.push('header');
      }
    };

    const getHeaderText = (node) => {
      return toString(node);
    };

    visit(tree, 'heading', (node) => {
      const headerText = getHeaderText(node);
      headerCounter++
      const headerId = generateId(headerText, headerCounter);

      if (node.depth <= 2) {
        currentHeader = {
          text: headerText,
          id: headerId,
          depth: node.depth,
          children: [],
        };

        file.data.headers.push(currentHeader);
        addIdToNode(node, headerId);
      } else if (node.depth === 3 && currentHeader) { 
        const childText = headerText;
        const childId = generateId(childText, headerCounter);

        currentHeader.children.push({
          text: childText,
          id: childId,
          depth: node.depth,
        });

        addIdToNode(node, childId);
      }
    });

    if (!file.data.fm) file.data.fm = {};
    file.data.fm.headers = file.data.headers;
  };
}
