# ------------ Build Stage (Scraper) ------------
FROM node:18-slim AS scraper

# Install Chromium dependencies
RUN apt-get update && apt-get install -y chromium chromium-fonts && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Create app directory
WORKDIR /app

# Copy Node.js scraper files
COPY node-scraper/package.json node-scraper/
RUN cd node-scraper && npm install
COPY node-scraper/scrape.js node-scraper/

# Set workdir inside node-scraper
WORKDIR /app/node-scraper

# Run scraper (URL should be passed while building)
ARG SCRAPE_URL
ENV SCRAPE_URL=${SCRAPE_URL}
RUN node scrape.js

# ------------ Final Stage (Server) ------------
FROM python:3.10-slim

# Install Python dependencies
RUN pip install --no-cache-dir Flask

# Set working directory
WORKDIR /app

# Copy scraped JSON and server files
COPY --from=scraper /app/node-scraper/scraped_data.json .
COPY python-server/requirements.txt .
COPY python-server/server.py .

# Expose port
EXPOSE 5000

# Start Flask server
CMD ["python", "server.py"]
