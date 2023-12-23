import os
from PIL import Image

def generate_thumbnail(image_path, thumbnail_suffix='_thumb', exclusion_list=[]):
    image_dir, image_filename = os.path.split(image_path)
    image_name, image_ext = os.path.splitext(image_filename)

    if image_name.endswith(thumbnail_suffix):
        print(f"Skipping '{image_filename}' - Thumbnail already exists.")
        return

    if image_filename in exclusion_list:
        print(f"Skipping '{image_filename}' - Excluded image.")
        return

    thumbnail_name = f"{image_name}{thumbnail_suffix}{image_ext}"
    thumbnail_path = os.path.join(image_dir, thumbnail_name)

    if os.path.exists(thumbnail_path):
        print(f"Skipping '{image_filename}' - Thumbnail already exists.")
        return

    try:
        with Image.open(image_path) as image:
            image.thumbnail((460, 276))  # Adjust the size as needed
            image.save(thumbnail_path)
            print(f"Converted '{image_filename}' to '{thumbnail_name}'.")
    except Exception as e:
        print(f"Failed to generate thumbnail for '{image_filename}': {str(e)}")

def traverse_folder(folder_path, thumbnail_suffix='_thumb', exclusion_list=[]):
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                image_path = os.path.join(root, file)
                generate_thumbnail(image_path, thumbnail_suffix, exclusion_list)


if __name__ == '__main__':
    # Usage example
    folder_path = './images'
    thumbnail_suffix = '_thumb'
    exclusion_list = ['stars.png', 'colormodebutton.png', 'android-chrome-192x192.png', 'android-chrome-512x512.png', 'apple-touch-icon.png', 'favicon-16x16.png', 'favicon-32x32.png', 'mstile-150x150.png']

    traverse_folder(folder_path, thumbnail_suffix, exclusion_list)
