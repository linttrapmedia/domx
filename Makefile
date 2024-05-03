#!/usr/bin/env

.PHONY: help build clean cdn dev docs deploy dist install publish test

STATUS:="\x1b[96;01m\xE2\x80\xA2\x1b[0m"
ECHO = @echo "\033[0;34m$(1)\033[0m$(2)"

# HELP
# thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
help:
	@echo
	@echo 🚀 DOMX:
	@echo
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-10s\033[0m %s\n", $$1, $$2}'
	@echo
	@echo USAGE:
	@echo See README.md
	@echo

.DEFAULT_GOAL := help

# TASKS

clean: ## Clean the project
	@echo $(STATUS) Cleaning...
	@rm -rf ./node_modules
	@rm -rf ./docs/static/scripts/dx*
	@rm -rf ./dist

deploy: ## Deploy the project
	@echo $(STATUS) Deploying...
	@git branch -D gh-pages
	@git checkout -b gh-pages
	@git merge main --no-commit --no-ff
	@make clean
	@make install
	@make docs
	@git add .
	@git commit -m 'deploy'
	@git push -f origin gh-pages
	@git checkout main

dev: ## Run the project in development mode
	@echo $(STATUS) Running in development mode...
	@${MAKE} -j 2 dev-docs dev-js

dev-js: ## Run the js in development mode
	@echo $(STATUS) Running js in development mode...
	@npx esbuild ./src/components/*.ts --outdir=docs/static/scripts --watch --bundle --sourcemap

dev-docs: ## Run the docs in development mode
	@echo $(STATUS) Running docs in development mode...
	@npx http-server docs --gzip

dist: ## Build the project for distribution
	@echo $(STATUS) Building...
	@rm -rf dist
	@mkdir dist
	@cp -v ./src/components/*.html dist/
	@npx esbuild ./src/components/*.ts --outdir=dist --bundle --sourcemap --minify --out-extension:.js=.min.js
	@zip -r dist/dom-x.zip dist

docs: ## Build the project documentation
	@npx esbuild ./src/components/*.ts --outdir=docs/static/scripts --bundle --sourcemap --minify
	@sed -i '' -E "s/[0-9]+\.[0-9]+\.[0-9]+/$$(jq -r '.version' package.json)/g" ./docs/static/html/header.html

install: ## Install the project
	@echo $(STATUS) Installing...
	@npm install

kill: ## Kill the project
	@echo $(STATUS) Killing...
	@lsof -i :8081 | grep LISTEN | awk '{print $2}' | xargs kill -9

publish: ## Publish the project to npm
	@echo $(STATUS) Publish package...
	@npm publish --access public

test: ## Run tests
	@echo $(STATUS) Testing...
	@npx playwright test
