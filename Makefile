.PHONY: install
## Install backend dependencies
install:
	pip install -r requirements/prod.txt -r requirements/ci.txt
	pre-commit install

.PHONY: backend
## Start the backend
backend:
	PORT=5000 python backend.py

.PHONY: lint
## Lint the frontend and backend
lint:
	pre-commit run --all-files

.PHONY: test
## Run tests
test:
	python -m pytest

.PHONY: help
## Print Makefile documentation
help:
	@perl -0 -nle 'printf("%-25s - %s\n", "$$2", "$$1") while m/^##\s*([^\r\n]+)\n^([\w-]+):[^=]/gm' $(MAKEFILE_LIST) | sort
.DEFAULT_GOAL := help
