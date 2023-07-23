# Makefile

build:
	docker-compose build

rebuild:
	docker-compose build --no-cache

bash:
	docker-compose exec web sh

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
	docker-compose exec web prisma generate

seed-data:
	docker-compose exec web prisma db seed -- --environment development
