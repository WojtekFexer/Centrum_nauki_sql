#!/usr/bin/env bash
# Build dla Cloudflare Pages — STARA aplikacja (v15), galezie main / dev / v15.
# Publikuje wylacznie pliki aplikacji. Dokumenty (docs/), stan_projektu.md i pliki zasad
# zostaja w repozytorium i NIE sa dostepne pod adresem strony.
# Na galezi v16 ten plik ma inna tresc (npm ci && npm run check && npm run build).
set -euo pipefail
rm -rf dist
mkdir -p dist
cp -r index.html manifest.json sw.js icon.svg css js dist/
echo "OK: dist gotowy, plikow: $(find dist -type f | wc -l)"
