# ---- Scraper Stage ----
FROM node:18-slim AS scraper

# Install Chromium and necessary libraries
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Set environment variable to skip Puppeteer Chromium download
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Set working directory
WORKDIR /app

# Copy Node scraper files
COPY node-scraper/package.json node-scraper/package-lock.json ./
RUN npm install

COPY node-scraper/scrape.js .

# Run the scraper to generate scraped_data.json
RUN node scrape.js

# ---- Server Stage ----
FROM python:3.10-slim

# Install Flask
RUN pip install Flask

# Set working directory
WORKDIR /app

# Copy scraped data and Python server code
COPY --from=scraper /app/scraped_data.json .
COPY python-server/server.py .

# Expose port
EXPOSE 5000

# Start the server
CMD ["python", "server.py"]
