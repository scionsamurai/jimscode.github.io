#!/usr/bin/env python3
import argparse
import os
from anthropic import Anthropic
from dotenv import load_dotenv

def process_markdown_file(filepath):
    # Load environment variables from .env file
    load_dotenv()
    
    # Check for API key
    api_key = os.getenv('ANTHROPIC_API_KEY')
    if not api_key:
        print("Error: ANTHROPIC_API_KEY not found in environment variables")
        return 1
    
    # Create output filepath
    base, ext = os.path.splitext(filepath)
    output_file = f"{base}_suggestions{ext}"
    
    # Read the original file
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Initialize Anthropic client
    client = Anthropic(api_key=api_key)
    
    sections = []
    current_header = None
    current_content = []
    
    # Parse file into sections
    for line in content.split('\n'):
        if line.startswith('#'):
            if current_header:
                sections.append((current_header, '\n'.join(current_content)))
            current_header = line
            current_content = []
        elif current_header:
            current_content.append(line)
    
    # Add last section if exists
    if current_header and current_content:
        sections.append((current_header, '\n'.join(current_content)))
    
    # Process each section
    improved_content = []
    previous_sections = []  # Store previously processed sections
    
    for idx, (header, content) in enumerate(sections):
        print(f"Processing section: {header}")
        
        # Build context about document structure
        all_headers = [h for h, _ in sections]
        headers_context = "\n".join([
            "Document Structure:",
            *[f"{'→ ' if i == idx else '  '}{h}" for i, h in enumerate(all_headers)]
        ])
        
        # Get last 2 previous sections if available
        previous_context = ""
        if previous_sections:
            previous_context = "\nPrevious Sections:\n" + "\n\n".join(
                previous_sections[-2:]  # Last 2 sections
            )
        
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=4096,
            temperature=0,
            messages=[{
                "role": "user",
                "content": f"""Given a technical document with the following structure:

{headers_context}

You are currently processing the section marked with →.
{previous_context}

Revise and enhance the following markdown section to produce comprehensive, technically detailed documentation. For each code block, adhere to the following guidelines:

        1. **Introduction & Context**
        - Start with a clear problem statement or a specific use case.
        - Briefly describe the context and why this code is needed.

        2. **Conceptual Overview**
        - Explain the underlying concepts and any relevant theory before presenting the code.
        - Mention prerequisites or assumptions that the reader should be aware of.

        3. **Code Presentation**
        - Present the code with detailed inline comments that explain each significant line.
        - Highlight key decisions and rationale behind the coding choices.

        4. **Supplementary Information**
        - After the code, include:
            - An explanation of why this approach is beneficial.
            - A list of common pitfalls and issues to avoid.
            - Best practices related to the pattern used.
            - Real-world scenarios where this pattern is particularly useful.
            - (Optional) Performance, security, or scalability considerations.
            - (Optional) Troubleshooting tips and debugging strategies.

        **General Improvements:**
        - Ensure smooth transitions between sections.
        - Use concrete examples to demonstrate practical applications.
        - Incorporate intermediate-level technical details to bridge basic and advanced concepts.
        - Relate the discussion to broader TypeScript and programming principles.
        - Include cross-references to relevant TypeScript documentation where appropriate.

        Consider the document structure shown above and maintain consistent tone and terminology with previous sections where applicable. Ensure smooth transitions from previous content while keeping the section self-contained enough to be understood independently.

        Below is the markdown section to enhance. Provide only the updated markdown content without any meta-commentary:

        {content}"""
            }]
        )

        
        # Extract the string content from the message response
        response_content = str(message.content[0].text)
        
        # Store the processed section
        previous_sections.append(f"{header}\n{response_content}")
        
        # Add to improved content
        improved_content.append(header)
        improved_content.append(response_content)
        improved_content.append("")  # Empty line between sections
    
    # Write improved content to new file
    with open(output_file, 'w') as f:
        f.write('\n'.join(improved_content))
    
    print(f"Suggestions saved to: {output_file}")

def main():
    parser = argparse.ArgumentParser(description='Improve markdown blog posts using Claude')
    parser.add_argument('-f', '--file', required=True, help='Path to markdown file')
    args = parser.parse_args()
    
    if not os.path.exists(args.file):
        print(f"Error: File {args.file} does not exist")
        return 1
        
    process_markdown_file(args.file)
    return 0

if __name__ == '__main__':
    exit(main())
