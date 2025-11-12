FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY scripts/ml/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy model and inference script
COPY scripts/ml/inference_api.py .
COPY models/ ./models/

# Expose port
EXPOSE 5000

# Environment variables
ENV MODEL_PATH=/app/models/vendor_score_model.pkl
ENV PORT=5000
ENV PYTHONUNBUFFERED=1

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:5000/health')"

# Run the inference API
CMD ["python", "inference_api.py"]
