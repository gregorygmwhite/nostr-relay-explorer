FROM python:3.10 as python
ARG env
ENV PYTHONUNBUFFERED 1
WORKDIR /app

# Python dependencies
COPY pyproject.toml /app/
RUN pip install poetry==1.2.2
RUN poetry config virtualenvs.create false
RUN if [ "env-$env" = "env-production" ] ; then poetry install --no-dev --no-interaction; else poetry install; fi

# Application code
COPY . /app

# Static files
# RUN DJANGO_ENVIRONMENT=build DJANGO_SECRET_KEY=none python manage.py collectstatic --no-input

ENV DJANGO_ENVIRONMENT $env

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
