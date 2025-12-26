# Python 3.11 Slim for smaller image size
FROM python:3.11-slim

WORKDIR /app

# Prevent Python from writing pyc files and buffering stdout
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install System Dependencies (Postgres & Build tools)
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python Dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Application Code
COPY . .

# Create a non-root user for security (Running as root is a big NO)
RUN useradd -m appuser
USER appuser

# Expose port
EXPOSE 8000

# Gunicorn launch command with Uvicorn workers
# --workers 4: Means can handle 4 parallel processes (Adjust based on CPU cores)
CMD ["gunicorn", "main:app", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]