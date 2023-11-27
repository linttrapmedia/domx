lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill
nodemon ./cmd/dev-server.js &
esbuild ./src/* --outdir=public/js --watch --bundle