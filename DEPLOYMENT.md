# Deployment Guide - Prakruthi Driving School Website

## Overview
This guide covers deployment options for the Prakruthi Driving School website.

## Prerequisites
- Node.js 18 or higher
- npm
- A server or hosting platform

## Environment Variables

Create a `.env` file in production with the following variables:

```env
ADMIN_TOKEN=your-secure-random-token-here-minimum-32-characters
PORT=3000
DB_PATH=/path/to/data/prakruthi.db
```

**Important Security Notes:**
- Generate a strong random `ADMIN_TOKEN` using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Never commit the `.env` file to version control
- Keep the admin token secure - it provides access to all customer data

## Deployment Options

### Option 1: Traditional Server (VPS, Dedicated Server)

1. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone/Upload the application**
   ```bash
   cd /var/www
   # Upload your files here
   ```

3. **Install dependencies**
   ```bash
   npm install --production
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   nano .env  # Edit with your values
   ```

5. **Use PM2 for process management**
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name prakruthi
   pm2 startup
   pm2 save
   ```

6. **Set up Nginx as reverse proxy**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **SSL Certificate (Let's Encrypt)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

### Option 2: Cloud Platforms

#### Render.com
1. Create a new Web Service
2. Connect your Git repository
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add environment variables in dashboard
6. Deploy

#### Railway.app
1. Create new project from GitHub repo
2. Add environment variables
3. Railway auto-detects Node.js and deploys

#### Heroku
```bash
heroku create prakruthi-driving-school
heroku config:set ADMIN_TOKEN=your-token-here
git push heroku main
```

#### DigitalOcean App Platform
1. Create new app
2. Select GitHub repository
3. Configure build settings
4. Add environment variables
5. Deploy

### Option 3: Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - ADMIN_TOKEN=${ADMIN_TOKEN}
      - DB_PATH=/app/data/prakruthi.db
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

Deploy:
```bash
docker-compose up -d
```

## Database Management

### Backup
```bash
# Create backup
cp data/prakruthi.db data/prakruthi-backup-$(date +%Y%m%d).db

# Automated daily backup (crontab)
0 2 * * * cp /path/to/data/prakruthi.db /path/to/backups/prakruthi-$(date +\%Y\%m\%d).db
```

### Restore
```bash
cp data/prakruthi-backup-YYYYMMDD.db data/prakruthi.db
pm2 restart prakruthi
```

## Monitoring

### Health Check Endpoint
```bash
curl http://localhost:3000/api/health
```

### PM2 Monitoring
```bash
pm2 monit
pm2 logs prakruthi
```

### Log Files
The application logs to:
- `.runtime/server.log` - Standard output
- `.runtime/server.err.log` - Error output

## Security Checklist

- [ ] Strong ADMIN_TOKEN set (minimum 32 characters)
- [ ] HTTPS enabled (SSL certificate installed)
- [ ] Firewall configured (only ports 80, 443, 22 open)
- [ ] Database backups automated
- [ ] Environment variables not in version control
- [ ] Server and Node.js up to date
- [ ] Rate limiting enabled (default: 12 requests/hour per IP)
- [ ] Security headers configured (already in code)

## Maintenance

### Update Application
```bash
cd /var/www/prakruthi
git pull origin main
npm install --production
pm2 restart prakruthi
```

### View Requests
Access admin dashboard at: `https://yourdomain.com/admin.html`

Or use API:
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  http://localhost:3000/api/admin/requests
```

## Troubleshooting

### Application won't start
```bash
# Check logs
pm2 logs prakruthi

# Check if port is in use
sudo lsof -i :3000

# Restart
pm2 restart prakruthi
```

### Database locked error
```bash
# Check if another process is using it
lsof data/prakruthi.db

# If needed, restart the app
pm2 restart prakruthi
```

### High memory usage
```bash
pm2 restart prakruthi  # Restart to free memory
pm2 monit              # Monitor resource usage
```

## Performance Optimization

### Enable Production Mode
```bash
export NODE_ENV=production
```

### Nginx Caching (Optional)
```nginx
location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Database Optimization
The SQLite database uses WAL mode automatically for better performance.

## Support

For issues or questions:
- Check the logs: `pm2 logs prakruthi`
- Review the code in `server.js`
- Test endpoints with curl
- Check health endpoint: `/api/health`

## Updating Services

To add new services, edit the `SERVICES` array in `server.js`:

```javascript
const SERVICES = [
  { 
    slug: 'new-service', 
    name: 'New Service Name', 
    group: 'Service Category',
    description: 'Service description here.',
    documents: ['Document 1', 'Document 2']
  },
  // ... existing services
];
```

The changes will reflect immediately on the website and in the admin dashboard.
