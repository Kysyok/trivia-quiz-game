FROM python:3.14
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Force uv to use python:3.14
ENV UV_PYTHON_PREFERENCE=only-system

# Copy the project into the image
COPY . /app

# Disable development dependencies
ENV UV_NO_DEV=1

# Sync the project into a new environment, asserting the lockfile is up to date
WORKDIR /app
RUN uv sync --locked

ENV PYTHONPATH ./src

CMD ["uv", "run", "src/app/main.py"]
