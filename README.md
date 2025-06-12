# prompt-note
Lightweight app to store information about checkpoint/lora settings, best combinations, storing prompt history

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

To run:

```bash
npm i
npm run dev
```
## Docker deployment

On Macos, make sure Colima is started

```bash
colima status
colima start -f
```

```bash
docker build --platform=linux/amd64 -t prompt-nest .
docker save -o prompt-nest.tar prompt-nest
scp prompt-nest.tar user@your-vps-ip:/path/on/vps/
```

on VPS:
```bash
docker load -i prompt-nest.tar
docker run -d -p 5000:4000 --env-file .env.local prompt-nest
```

Inspect container from inside :
```bash
docker exec -it <ID> sh
```