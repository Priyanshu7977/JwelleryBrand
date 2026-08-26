import os
import zipfile

def create_shopify_zip():
    source_dir = os.path.abspath('shopify-theme')
    output_zip = os.path.abspath('celestia-shopify-theme.zip')
    
    if os.path.exists(output_zip):
        os.remove(output_zip)
        
    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            for file in files:
                file_path = os.path.join(root, file)
                # Compute relative path and normalize to POSIX forward slashes
                rel_path = os.path.relpath(file_path, source_dir)
                posix_rel_path = rel_path.replace('\\', '/')
                zipf.write(file_path, posix_rel_path)
                print(f"Added: {posix_rel_path}")

    print(f"\nSuccessfully generated Shopify OS 2.0 theme ZIP at: {output_zip}")

if __name__ == '__main__':
    create_shopify_zip()
