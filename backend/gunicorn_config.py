import os

# Server socket
bind = f"0.0.0.0:{int(os.environ.get('PORT', 5000))}"

# Worker processes - recommended is (2 x NUM_CORES) + 1
workers = 2

# Timeout configuration
timeout = 15  # Reduced from 30s to 15s to prevent H12 errors
keepalive = 2

# Worker class configuration
worker_class = 'sync'
threads = 1

# Logging
accesslog = '-'
errorlog = '-'
loglevel = 'info'

# Worker connections
worker_connections = 1000

# Maximum requests per worker
max_requests = 1000
max_requests_jitter = 50

# Prevent timeout errors
graceful_timeout = 15