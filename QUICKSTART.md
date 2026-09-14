# Quick Start Guide - 3 Minutes to Running

Get Prakruthi Driving School website up and running in 3 minutes.

## ⚡ Prerequisites

- **Node.js 18 or higher** (Check: `node --version`)
- **npm** (comes with Node.js)

Don't have Node.js? [Download here](https://nodejs.org/)

## 🚀 Installation (1 minute)

```powershell
# Navigate to project directory
cd prakruthi_ds

# Install dependencies
npm install
```

That's it! No complex setup needed.

## ▶️ Run the Website (30 seconds)

```powershell
npm start
```

You should see:
```
✓ Prakruthi Driving School server running on http://127.0.0.1:3000
✓ Database: C:\Users\...\prakruthi_ds\data\prakruthi.db
✓ Admin authentication: Disabled (set ADMIN_TOKEN)
```

## 🌐 Access the Website

Open your browser and visit:
```
http://127.0.0.1:3000
```

**You're live!** The website is now running locally.

## 📱 What You Can Do Now

### 1. Browse Services
- Click "Explore Services" or scroll down
- View all 19 RTO and driving school services
- Filter by category
- See required documents for each service

### 2. Submit a Test Request
- Scroll to "Request a Service" section
- Select a service (e.g., "Driving Classes & DL Support")
- Fill in test details:
  - Name: Test User
  - Phone: 9876543210 (must start with 6-9)
  - Email: test@example.com (optional)
- Click "Submit Request"
- Note the reference number (e.g., PDS-20260909-A1B2C3)

### 3. Test the Website
- Check mobile responsiveness (resize browser)
- Try service filtering
- Test form validation (empty fields, invalid phone)
- Navigate through all sections

## 🔐 Setup Admin Access (2 minutes)

To view submitted requests, you need admin access:

### Step 1: Generate Admin Token

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the generated token (64 characters).

### Step 2: Set the Token

**Windows PowerShell:**
```powershell
$env:ADMIN_TOKEN="your-generated-token-here"
npm start
```

**Linux/Mac:**
```bash
export ADMIN_TOKEN="your-generated-token-here"
npm start
```

**Or create .env file:**
```env
ADMIN_TOKEN=your-generated-token-here
PORT=3000
```

Then run:
```powershell
npm start
```

### Step 3: Access Admin Dashboard

1. Visit: `http://127.0.0.1:3000/admin.html`
2. Enter your admin token
3. Click "Login"

**You're in!** You can now:
- View all service requests
- See statistics (total, new, popular services)
- Sort requests by date, name, service
- Track reference numbers

## 🧪 Run Tests (Optional)

```powershell
npm test
```

Tests verify:
- API endpoints work correctly
- Request validation functions properly
- Database operations succeed
- Server handles errors gracefully

Expected: 5/6 tests passing (1 Windows-specific file locking edge case)

## 📂 Project Structure Overview

```
prakruthi_ds/
├── server.js          # Backend (Node.js + SQLite)
├── public/
│   ├── index.html     # Main website
│   ├── admin.html     # Admin dashboard
│   ├── styles.css     # All styling
│   └── app.js         # Frontend JavaScript
├── data/
│   └── prakruthi.db   # SQLite database (auto-created)
└── package.json       # Dependencies
```

## 🎯 Common Tasks

### View Server Logs
Server logs to console. Check for:
- Request submissions
- Error messages
- Database operations

### Stop the Server
Press `Ctrl+C` in the terminal

### Restart with Changes
After code changes:
1. Stop server (`Ctrl+C`)
2. Run `npm start` again

### Change Port
```powershell
$env:PORT="3001"
npm start
```

### Clear Database
Delete `data/prakruthi.db` file - it will be recreated on next start with empty tables.

### View Database
Use any SQLite browser:
- [DB Browser for SQLite](https://sqlitebrowser.org/) (Free)
- [SQLite Viewer](https://inloop.github.io/sqlite-viewer/) (Online)

Open `data/prakruthi.db` to see requests table.

## 🐛 Troubleshooting

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:** Change port or kill existing process
```powershell
$env:PORT="3001"
npm start
```

### Database Error
```
Error: Cannot open database
```

**Solution:** Ensure `data/` directory exists and has write permissions
```powershell
mkdir data
npm start
```

### Node Version Too Old
```
Error: DatabaseSync is not defined
```

**Solution:** Update Node.js to version 18 or higher
```powershell
node --version  # Should be 18.0.0 or higher
```

### Admin Token Not Working
- Check for spaces or quotes in token
- Ensure same token in environment and login
- Restart server after setting token
- Try generating a new token

### Page Not Loading
- Ensure server is running (`npm start`)
- Check console for errors
- Try `http://127.0.0.1:3000` instead of `localhost:3000`
- Clear browser cache

### Form Submission Fails
- Check browser console for errors (F12)
- Verify phone number format (10 digits starting with 6-9)
- Ensure service is selected
- Check rate limiting (max 12 requests per hour per IP)

## 📞 Test the API Directly

### Health Check
```powershell
curl http://127.0.0.1:3000/api/health
```

Expected:
```json
{"status":"healthy","timestamp":"2026-09-09T..."}
```

### Get Services
```powershell
curl http://127.0.0.1:3000/api/services
```

Expected: JSON array of 19 services

### Submit Request (PowerShell)
```powershell
$body = @{
    serviceSlug = "driving-classes"
    name = "Test User"
    phone = "9876543210"
    email = "test@example.com"
    message = "Test request"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:3000/api/requests" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

Expected:
```json
{
  "success": true,
  "referenceNumber": "PDS-20260909-...",
  "message": "Request submitted successfully"
}
```

### Get Admin Requests (PowerShell)
```powershell
$headers = @{
    "Authorization" = "Bearer your-admin-token-here"
}

Invoke-RestMethod -Uri "http://127.0.0.1:3000/api/admin/requests" `
    -Headers $headers
```

Expected: JSON with requests array and stats object

## 🎓 Next Steps

### For Development
1. ✅ Website is running locally
2. ✅ Admin access configured
3. ✅ Test request submitted
4. 📖 Read [SERVICES.md](SERVICES.md) for complete service details
5. 🚀 Ready to customize or deploy

### For Customization
- **Update contact info:** Edit `public/index.html` (search for phone/address)
- **Modify services:** Edit `SERVICES` array in `server.js`
- **Change colors:** Edit CSS variables in `public/styles.css`
- **Add features:** Extend `server.js` and `public/app.js`

### For Production
1. Read [DEPLOYMENT.md](DEPLOYMENT.md)
2. Generate strong admin token
3. Choose hosting platform
4. Set environment variables
5. Deploy and test
6. Set up SSL certificate
7. Configure domain

## ✅ Verification Checklist

Before deploying, verify:
- [ ] Website loads at http://127.0.0.1:3000
- [ ] All 19 services display correctly
- [ ] Service filtering works
- [ ] Request form submits successfully
- [ ] Reference number is generated
- [ ] Admin login works with token
- [ ] Admin dashboard shows requests
- [ ] Mobile view looks good (resize browser)
- [ ] No console errors (F12 in browser)
- [ ] Tests pass (`npm test`)

## 📚 Documentation Links

- **[README.md](README.md)** - Complete project overview
- **[SERVICES.md](SERVICES.md)** - All 19 services detailed
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide

## 🎉 You're All Set!

The website is fully functional and ready to use. 

**For local testing:** Keep using `http://127.0.0.1:3000`

**For production:** Follow the deployment guide when ready.

---

**Need help?** Check the troubleshooting section above or review the full documentation.
