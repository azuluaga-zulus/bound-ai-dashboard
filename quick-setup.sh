#!/bin/bash

echo "🚀 Starting Bound AI Dashboard Setup..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Install Node.js 20
echo -e "${BLUE}Installing Node.js 20...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install required packages
echo -e "${BLUE}Installing packages...${NC}"
apt-get install -y git nginx

# Setup application
echo -e "${BLUE}Setting up application...${NC}"
cd /var/www
rm -rf bound-ai-dashboard
git clone https://github.com/azuluaga-zulus/bound-ai-dashboard.git
cd bound-ai-dashboard

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install

# Create environment file
echo -e "${BLUE}Creating environment file...${NC}"
cat > .env.local << 'EOL'
NEXT_PUBLIC_N8N_BASE_URL=https://agents.bound.work
NEXT_PUBLIC_SUPABASE_URL=https://bqkdmozyarxhcwavvuih.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxa2Rtb3p5YXJ4aGN3YXZ2dWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNzA0NTgsImV4cCI6MjA2OTc0NjQ1OH0.sjbZZN7wlHGhUDGAKgU1f3vRd-D-1HNOKLLLMPgQ1xk
EOL

# Build application
echo -e "${BLUE}Building application...${NC}"
npm run build

# Install PM2
echo -e "${BLUE}Installing PM2...${NC}"
npm install -g pm2

# Start application
echo -e "${BLUE}Starting application with PM2...${NC}"
pm2 delete bound-ai-dashboard 2>/dev/null
pm2 start npm --name "bound-ai-dashboard" -- start
pm2 save
pm2 startup systemd -u root --hp /root | grep -v PM2 | bash

# Configure Nginx
echo -e "${BLUE}Configuring Nginx...${NC}"
cat > /etc/nginx/sites-available/default << 'NGINX'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name _;
    
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
NGINX

# Restart Nginx
systemctl restart nginx

# Get IP address
IP=$(curl -s http://checkip.amazonaws.com)

echo -e "${GREEN}✅ Setup complete!${NC}"
echo -e "${GREEN}Your application is running at: http://$IP${NC}"
echo ""
echo "Next steps:"
echo "1. Visit http://$IP to see your app"
echo "2. To check logs: pm2 logs bound-ai-dashboard"
echo "3. To restart app: pm2 restart bound-ai-dashboard"