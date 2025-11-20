import sys
import os
from pathlib import Path
from yt_dlp import YoutubeDL
import json

def get_downloads_folder():
    """Get the system's Downloads folder path"""
    home = Path.home()
    downloads = home / "Downloads" / "YouTube Video"
    downloads.mkdir(parents=True, exist_ok=True)
    return str(downloads)

def progress_hook(d):
    """Hook to track download progress"""
    try:
        if d['status'] == 'downloading':
            # Extract progress information
            percent = d.get('_percent_str', '0%').strip()
            speed = d.get('_speed_str', 'N/A').strip()
            eta = d.get('_eta_str', 'N/A').strip()
            
            progress_data = {
                'status': 'downloading',
                'percent': percent,
                'speed': speed,
                'eta': eta,
                'filename': d.get('filename', 'Unknown')
            }
            print(f"PROGRESS:{json.dumps(progress_data)}")
            sys.stdout.flush()
        
        elif d['status'] == 'finished':
            progress_data = {
                'status': 'finished',
                'message': 'Download complete! Finalizing...'
            }
            print(f"PROGRESS:{json.dumps(progress_data)}")
            sys.stdout.flush()
    except Exception as e:
        # Don't let progress hook break the download
        pass

def download_video(url):
    try:
        # Get system downloads folder
        output_dir = get_downloads_folder()
        
        # Print initial status
        initial_status = {
            'status': 'starting',
            'message': 'Fetching video information...'
        }
        print(f"PROGRESS:{json.dumps(initial_status)}")
        sys.stdout.flush()
        
        # Configure yt-dlp options
        ydl_opts = {
            'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
            'outtmpl': os.path.join(output_dir, '%(title)s.%(ext)s'),
            'progress_hooks': [progress_hook],
            'quiet': False,
            'no_warnings': False,
            'noplaylist': True,
            'merge_output_format': 'mp4',
        }
        
        # Download the video
        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)
            
            # Print success message that the Node.js script expects
            success_data = {
                'filepath': filename,
                'filename': os.path.basename(filename),
                'folder': output_dir
            }
            print(f"SUCCESS:{json.dumps(success_data)}")
            sys.stdout.flush()
            return 0
            
    except Exception as e:
        # Print detailed error message
        import traceback
        error_details = traceback.format_exc()
        error_data = {
            'message': str(e),
            'details': error_details
        }
        print(f"ERROR:{json.dumps(error_data)}", file=sys.stderr)
        sys.stderr.flush()
        return 1

if __name__ == "__main__":
    if len(sys.argv) < 2:
        error_data = {'message': 'No URL provided'}
        print(f"ERROR:{json.dumps(error_data)}", file=sys.stderr)
        sys.stderr.flush()
        sys.exit(1)
    
    url = sys.argv[1]
    exit_code = download_video(url)
    sys.exit(exit_code)
