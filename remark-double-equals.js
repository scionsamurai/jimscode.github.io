import { visit } from 'unist-util-visit';

export function remarkDoubleEquals() {
  return (tree) => {
    visit(tree, 'text', (node) => {
      if (node.value.includes('==')) {
        const regex = /==(.+?)==/g;
        node.value = node.value.replace(regex, (match, p1) => {
          return `<span class="double-equals">${p1}</span>`;
        });

        // Convert the node to a 'html' type
        node.type = 'html';
      }
    });
  };
}
