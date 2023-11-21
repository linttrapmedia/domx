node ./cmd/dev-server.js &
esbuild ./src/* --outdir=public/js --watch --format=iife