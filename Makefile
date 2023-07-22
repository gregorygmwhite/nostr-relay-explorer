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
	docker-compose up

run-production:
	docker-compose run --service-ports --use-aliases --rm web

migrate:
	docker-compose exec web prisma migrate deploy

delete-data:
	docker-compose exec web prisma migrate reset -f --skip-seed

reset-db:
	docker-compose exec web prisma migrate reset -f

seed-data:
	docker-compose exec web prisma db seed -- --environment development
