#!/bin/sh
set -e

# Generate runtime environment config
cat > /tmp/env.js <<EOF
window.__ENV__ = {
  VITE_API_URL: "${VITE_API_URL:-}"
};
EOF

exec "$@"
