FROM node:24-alpine

# Create non-root user
RUN addgroup -g 10001 appuser && \
    adduser -D -u 10001 -G appuser appuser

WORKDIR /app

# Install dependencies as root
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Change ownership to non-root user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]