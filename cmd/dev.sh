http-server ./public -p 8080 --cors &
esbuild ./src/* --outdir=public/js --watch --format=iife