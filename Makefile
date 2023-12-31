# Makefile

build:
	docker-compose build

rebuild:
	docker-compose build --no-cache

bash-backend:
	docker-compose exec backend /bin/bash

bash-frontend:
	docker-compose exec frontend /bin/bash

run-dev-all:
	docker-compose up

run-backend:
	docker-compose up backend db redis worker --remove-orphans

run-frontend:
	docker-compose run --service-ports --use-aliases --rm frontend

migrate:
	docker-compose exec backend python manage.py migrate

make-migrations:
	docker-compose exec backend python manage.py makemigrations

delete-data:
	docker-compose exec backend python manage.py reset_db -c --noinput

reset-db:
	docker-compose exec backend python manage.py flush --noinput
	docker-compose exec backend python manage.py migrate explorer zero
	docker-compose exec backend python manage.py migrate meta zero
	docker-compose exec backend python manage.py migrate
	docker-compose exec backend python manage.py seed_dev_data
