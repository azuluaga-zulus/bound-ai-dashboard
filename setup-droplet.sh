#!/bin/bash

# Update system
apt-get update
apt-get upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2 globally
npm install -g pm2

# Install Nginx
apt-get install -y nginx

# Install Git
apt-get install -y git

# Create app directory
mkdir -p /var/www/bound-ai-dashboard
cd /var/www/bound-ai-dashboard

# Clone repository
git clone https://github.com/azuluaga-zulus/bound-ai-dashboard.git .

# Install dependencies
npm install

# Build the app
npm run build

# Create environment file
cat > .env.local << EOF
NEXT_PUBLIC_N8N_BASE_URL=https://agents.bound.work
NEXT_PUBLIC_SUPABASE_URL=https://bqkdmozyarxhcwavvuih.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxa2Rtb3p5YXJ4aGN3YXZ2dWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNzA0NTgsImV4cCI6MjA2OTc0NjQ1OH0.sjbZZN7wlHGhUDGAKgU1f3vRd-D-1HNOKLLLMPgQ1xk
EOF

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'bound-ai-dashboard',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/bound-ai-dashboard',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Start app with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root

# Configure Nginx
cat > /etc/nginx/sites-available/bound-ai-dashboard << 'EOF'
server {
    listen 80;
    server_name 206.81.1.88;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/bound-ai-dashboard /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Test and restart Nginx
nginx -t
systemctl restart nginx

# Configure firewall
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

echo "✅ Setup complete! Your app should be running at http://206.81.1.88"