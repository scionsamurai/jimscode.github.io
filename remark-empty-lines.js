import { visit } from 'unist-util-visit';

export function emptyLinesToBr() {
    return (tree) => {
    
        function insertBrs(node) {
          if (!Array.isArray(node.children)) return;
    
          const newChildren = [];
          for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            newChildren.push(child);
    
            if (i < node.children.length - 1) {
              const nextChild = node.children[i + 1];
              const emptyLines = getEmptyLinesBetween(child, nextChild);
    
              for (let j = 0; j < emptyLines; j++) {
                newChildren.push({
                  type: 'html',
                  value: '<br>'
                });
              }
            } else if (child.type === 'code') {
              // Handle empty lines after the last code block in a section
              const emptyLines = getEmptyLinesAfterCode(child, node);
              for (let j = 0; j < emptyLines; j++) {
                newChildren.push({
                  type: 'html',
                  value: '<br>'
                });
              }
            }
    
            // Recursively process child nodes
            insertBrs(child);
          }
          node.children = newChildren;
        }
    
        function getEmptyLinesBetween(node1, node2) {
          if (!node1.position || !node2.position) return 0;
    
          const endLine = node1.position.end.line;
          const startLine = node2.position.start.line;
    
          // Special handling for code blocks
          if (node1.type === 'code' || node2.type === 'code') {
            return Math.max(0, startLine - endLine - 1);
          }
    
          // Special handling for list items
          if (node1.type === 'listItem' || node2.type === 'listItem') {
            return Math.max(0, startLine - endLine - 1);
          }
    
          return Math.max(0, startLine - endLine - 1);
        }
    
        function getEmptyLinesAfterCode(codeNode, parentNode) {
          const codeEndLine = codeNode.position.end.line;
          const parentEndLine = parentNode.position.end.line;
          return Math.max(0, parentEndLine - codeEndLine);
        }
    
        insertBrs(tree);
      };
  }
  