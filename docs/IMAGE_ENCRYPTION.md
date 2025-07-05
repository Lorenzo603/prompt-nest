# Image Encryption Setup

## Overview
Images uploaded for Loras are now automatically encrypted when stored on the filesystem and decrypted when served to users. This provides an additional layer of security for sensitive image data.

## Setup

### 1. Environment Configuration
Add the following environment variable to your `.env` file:

```bash
# Generate a secure 32-character key for production
IMAGE_ENCRYPTION_KEY=your-32-character-secret-key-here!
```

### 2. Generate a Secure Key (Production)
For production environments, generate a secure random key:

```bash
# Option 1: Using openssl
openssl rand -hex 16

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

Use the generated key as your `IMAGE_ENCRYPTION_KEY`.

## How It Works

### Encryption Process (Upload)
1. User uploads an image
2. Image buffer is encrypted using AES-256-CBC
3. A random IV (Initialization Vector) is generated for each file
4. Encrypted data is stored with `.enc` extension
5. Metadata file (`.meta`) stores original file type and MIME type
6. Database stores the encrypted filename reference

### Decryption Process (Serving)
1. Client requests image via `/dam/loras/filename.ext.enc`
2. Server reads encrypted file and metadata
3. File is decrypted using the same key and extracted IV
4. Original image is served with correct MIME type
5. Client receives decrypted image normally

## Security Considerations

1. **Key Management**: Keep the `IMAGE_ENCRYPTION_KEY` secure and never commit it to version control
2. **Key Rotation**: If you need to rotate keys, you'll need to decrypt and re-encrypt existing files
3. **Backup**: Ensure your encryption key is backed up securely
4. **Performance**: Encryption/decryption adds minimal overhead but consider caching for high-traffic scenarios

## File Structure
```
dam/
└── loras/
    ├── lora_1625123456789_1234.jpg.enc  # Encrypted image
    ├── lora_1625123456789_1234.jpg.enc.meta  # Metadata file
    └── ...
```

## Troubleshooting

### Images not displaying
- Check that `IMAGE_ENCRYPTION_KEY` is set correctly
- Verify that both `.enc` and `.meta` files exist
- Check server logs for decryption errors

### Performance issues
- Consider implementing caching for frequently accessed images
- Monitor server resources during peak image serving times
