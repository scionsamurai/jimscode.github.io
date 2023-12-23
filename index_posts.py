import os
import json
import re

def build_search_index(folders_to_index, output_file, min_words_in_sentence=5, reindex_all=False, exclude_paths=[]):
    search_index = {}
    if not reindex_all and os.path.isfile(output_file):
        with open(output_file, 'r') as f:
            search_index = json.load(f)

    for folder in folders_to_index:
        for subdir, dirs, files in os.walk(folder):
            if any(exclude_path in subdir for exclude_path in exclude_paths):
                continue
            for file in files:
                if file.endswith('.html'):
                    file_path = os.path.join(subdir, file)
                    if not reindex_all and file_path in search_index:
                        continue

                    with open(file_path, 'r') as f:
                        content = f.read()

                    sentences = re.findall(r'\b[\w\s,]+\b\.(?=\s|$)', content)
                    sentences = [s.strip() for s in sentences if len(s.split()) >= min_words_in_sentence]

                    if sentences:
                        search_index[file_path] = ' '.join(sentences)

    with open(output_file, 'w') as f:
        json.dump(search_index, f)


if __name__ == '__main__':
    build_search_index(['./posts'], 'search.json', reindex_all=True, exclude_paths=['./posts/testSeries/seotips'])