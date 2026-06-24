.PHONY: setup test notebook

setup:
	python -m pip install --upgrade pip
	pip install -r requirements.txt

notebook:
	jupyter notebook notebooks/

test:
	pytest -q
