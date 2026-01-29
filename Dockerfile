# =============================================================================
# AI LITERACY CTF - DOCKERFILE
# =============================================================================
#
# This Dockerfile creates a lightweight container to serve the static CTF app.
# We use nginx:alpine for minimal image size (~25MB).
#
# BUILD:
#   docker build -t ai-literacy-ctf .
#
# RUN LOCALLY:
#   docker run -p 8080:80 ai-literacy-ctf
#   Then open http://localhost:8080
#
# PUSH TO AWS ECR:
#   aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com
#   docker tag ai-literacy-ctf:latest <account>.dkr.ecr.<region>.amazonaws.com/ai-literacy-ctf:latest
#   docker push <account>.dkr.ecr.<region>.amazonaws.com/ai-literacy-ctf:latest
#
# =============================================================================

# Use nginx alpine for a minimal footprint (~25MB image)
FROM nginx:alpine

# Add labels for container identification (useful for Wiz scanning)
LABEL maintainer="AI Literacy CTF"
LABEL description="Interactive CTF teaching prompt injection techniques"
LABEL version="1.0.0"
LABEL org.opencontainers.image.source="https://github.com/NeuralOceans/Hack-Me-Not"

# Remove default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy the application files to nginx html directory
COPY codepen/index.html /usr/share/nginx/html/
COPY codepen/styles.css /usr/share/nginx/html/
COPY codepen/script.js /usr/share/nginx/html/

# Create nginx config optimized for Kubernetes
RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Single page app routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Cache static assets
    location ~* \.(css|js)$ {
        expires 1d;
        add_header Cache-Control "public, immutable";
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Create directories and set permissions for non-root operation
RUN mkdir -p /var/cache/nginx /var/run && \
    chown -R nginx:nginx /var/cache/nginx /var/run /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    # Update nginx.conf to write pid to a writable location
    sed -i 's|/var/run/nginx.pid|/var/run/nginx.pid|g' /etc/nginx/nginx.conf && \
    # Ensure nginx can write to required directories
    touch /var/run/nginx.pid && \
    chown nginx:nginx /var/run/nginx.pid

# Expose port 80
EXPOSE 80

# Health check for Kubernetes readiness/liveness probes
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80/health || exit 1

# Run as nginx user (non-root) for security
USER nginx

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
