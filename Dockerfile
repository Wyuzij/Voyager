FROM node:18-alpine AS frontend
WORKDIR /app/travel
COPY travel/package.json travel/package-lock.json ./
RUN npm ci
COPY travel/ ./
RUN npm run build:h5

FROM python:3.11-slim

# Hugging Face Spaces 以 uid 1000 运行
RUN useradd -m -u 1000 user

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    HOST=0.0.0.0 \
    PORT=7860 \
    CORS_ORIGINS=*

WORKDIR /home/user/app

COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY --chown=user backend/ ./
COPY --from=frontend --chown=user /app/travel/dist/build/h5 ./static/h5

USER user

EXPOSE 7860
CMD ["sh", "-c", "uvicorn app.api.main:app --host 0.0.0.0 --port ${PORT:-7860}"]
