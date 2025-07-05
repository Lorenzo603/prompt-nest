# Prompt Styles Setup

The Prompt Styles page now reads from the filesystem instead of hardcoded data. Here's how to add new prompt styles:

## Directory Structure

All prompt styles are stored in `dam/prompt-styles/` directory:
```
dam/prompt-styles/
├── style-name.png          # Image file (or .jpg, .jpeg, .webp)
├── style-name.json         # Metadata file with title and prompt
├── another-style.png
└── another-style.json
```

## Adding New Prompt Styles

1. **Add the image**: Place your image file in `dam/prompt-styles/`
   - Supported formats: `.png`, `.jpg`, `.jpeg`, `.webp`
   - Can be encrypted (`.enc`) or unencrypted

2. **Create metadata file**: Create a JSON file with the same base name as your image:
   ```json
   {
     "title": "Your Style Title",
     "prompt": "Your detailed prompt text here..."
   }
   ```

## Example

For an image named `cyberpunk-portrait.png`, create `cyberpunk-portrait.json`:
```json
{
  "title": "Cyberpunk Portrait",
  "prompt": "(cyberpunk portrait:1.4), neon lights, futuristic, dramatic lighting, high contrast, digital art, sci-fi, urban setting, glowing elements, detailed face, atmospheric"
}
```

## Encryption (Optional)

If you want to encrypt images:
1. Use the existing upload endpoints to encrypt images
2. Place the `.enc` and `.meta` files in `dam/prompt-styles/`
3. The system will automatically decrypt them when serving

## Current Files

The following example files are included:
- `urban-reflections-pensive-portrait.png` + `.json`
- `vibrant-autumn-landscape.png` + `.json`
