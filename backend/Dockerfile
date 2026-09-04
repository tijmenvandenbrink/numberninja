FROM cgr.dev/chainguard/python:latest-dev AS build

WORKDIR /app

# Install dependencies into an isolated target dir (keeps the runtime stage free of pip/gcc/etc.)
COPY requirements.txt .
RUN pip install --no-cache-dir --target=/app/deps -r requirements.txt

# Distroless runtime: no shell, no package manager, minimal OS surface.
FROM cgr.dev/chainguard/python:latest

WORKDIR /app

COPY --from=build --chown=10001:10001 /app/deps /app/deps
COPY --chown=10001:10001 app/ ./app/

ENV PYTHONPATH=/app/deps

USER 10001

EXPOSE 8000

# Base image ENTRYPOINT is ["/usr/bin/python"]; CMD supplies the module + args.
CMD ["-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
