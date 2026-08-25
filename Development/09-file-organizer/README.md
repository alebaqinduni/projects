# File Organizer

A Python command-line utility that sorts files into folders by extension.

## Usage

```bash
python organizer.py /path/to/folder
```

## Safety

The current implementation moves files and skips destinations that already exist. Test it on a disposable directory before using it on important data.

## Development roadmap

- Add a dry-run mode.
- Add collision-safe renaming.
- Add configuration files.
- Add unit tests.
- Add logging.
- Improve error handling and permissions reporting.
