from pathlib import Path
import shutil

EXTENSIONS={'images':{'.png','.jpg','.jpeg','.gif','.webp'},'documents':{'.pdf','.doc','.docx','.txt','.md'},'archives':{'.zip','.tar','.gz'},'audio':{'.mp3','.wav'},'video':{'.mp4','.mov','.mkv'}}

def category(path):
    return next((name for name,exts in EXTENSIONS.items() if path.suffix.lower() in exts),'other')

def organize(folder):
    root=Path(folder).expanduser().resolve()
    for path in root.iterdir():
        if not path.is_file(): continue
        target=root/category(path);target.mkdir(exist_ok=True)
        destination=target/path.name
        if destination.exists(): continue
        shutil.move(str(path),destination)

if __name__=='__main__':
    import argparse
    parser=argparse.ArgumentParser(description='Organize files by type')
    parser.add_argument('folder')
    args=parser.parse_args();organize(args.folder)
