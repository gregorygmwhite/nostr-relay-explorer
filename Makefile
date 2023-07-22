# Makefile

build:
	docker-compose build

rebuild:
	docker-compose build --no-cache

bash:
	docker-compose exec web sh

lint:
	docker-compose exec web npm run lint

run:
	docker-compose run --service-ports --use-aliases --rm web db

run-production:
	docker-compose run --service-ports --use-aliases --rm web
