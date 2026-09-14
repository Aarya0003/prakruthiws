# Prakruthi Driving School & RTO Services

A production-ready comprehensive website for Prakruthi Driving School, RR Nagar, Bengaluru. Features responsive service site, extensive service directory API, validated request forms, and SQLite-backed enquiry storage with admin dashboard.

## 🚗 Services Offered

### Driving School & Licence Services (5)
- Driving classes & DL support
- Learner's licence (LL)
- New Driving Licence (DL)
- Driving licence renewal
- International Driving Permit

### Vehicle Documentation (4)
- New vehicle registration
- Vehicle ownership transfer
- Duplicate RC
- Hypothecation removal

### Insurance & Compliance (3)
- Motor insurance support
- Fitness certificate (FC)
- Pollution Under Control (PUC)

### Transfer & Commercial (2)
- NOC & re-registration
- Commercial permits

### RTO Services (5)
- Address change in DL/RC
- Name change in documents
- Road tax payment
- Vehicle inspection assistance
- Other RTO documentation

**Total: 19 comprehensive services**

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher (for native DatabaseSync)
- npm

### Installation & Run

```powershell
# Install dependencies
npm install

# Start the server
npm start
```

Open `http://127.0.0.1:3000` in your browser.

## 📋 Features

### For Customers
- ✅ Browse 19 comprehensive RTO and driving school services
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Service filtering by category
- ✅ Online service request form with validation
- ✅ Instant reference number generation
- ✅ Document checklist for each service
- ✅ Phone and email validation
- ✅ Contact information and business hours

### For Business Owners
- ✅ Secure admin dashboard (token-based authentication)
- ✅ View all service requests
- ✅ Real-time statistics (total, new, popular services)
- ✅ Sortable requests table
- ✅ Reference number tracking
- ✅ Customer contact details

### Technical Features
- ✅ Node.js native HTTP server (no Express dependency)
- ✅ SQLite database with WAL mode for performance
- ✅ RESTful API design
- ✅ Rate limiting (12 requests per hour per IP)
- ✅ Input sanitization (XSS protection)
- ✅ SQL injection prevention (parameterized queries)
- ✅ Security headers configured
- ✅ Reference number generation (PDS-YYYYMMDD-XXXXXX format)
- ✅ Professional automotive theme
- ✅ Mobile-first responsive design

## 🔧 Backend API

### Public Endpoints

#### Health Check
```
GET /api/health
```
Returns server health status.

#### Get Services
```
GET /api/services
```
Returns list of all 19 services with details.

#### Submit Request
```
POST /api/requests
Content-Type: application/json

{
  "serviceSlug": "driving-classes",
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",      // Optional
  "message": "Need driving lessons"  // Optional
}
```
Returns reference number on success.

### Admin Endpoints

#### Get All Requests
```
GET /api/admin/requests
Authorization: Bearer <ADMIN_TOKEN>
```
Returns all requests and statistics.

## 🔐 Admin Access

### Generate Admin Token
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Set Token (Windows PowerShell)
```powershell
$env:ADMIN_TOKEN="your-generated-token-here"
npm start
```

### Set Token (Linux/Mac)
```bash
export ADMIN_TOKEN="your-generated-token-here"
npm start
```

### Access Dashboard
Navigate to `http://127.0.0.1:3000/admin.html` and enter your admin token.

## 📁 Project Structure

```
prakruthi_ds/
├── server.js              # Backend server (Node.js + SQLite)
├── package.json           # Dependencies and scripts
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
│
├── public/                # Frontend files
│   ├── index.html         # Main website
│   ├── admin.html         # Admin dashboard
│   ├── styles.css         # Complete styling
│   └── app.js             # Frontend JavaScript
│
├── data/                  # Database directory (auto-created)
│   └── prakruthi.db       # SQLite database
│
├── test/                  # Test files
│   ├── api.test.js        # API integration tests
│   └── server.test.js     # Server unit tests
│
└── docs/                  # Documentation
    ├── README.md          # This file
    ├── SERVICES.md        # Detailed services list
    ├── QUICKSTART.md      # Quick setup guide
    └── DEPLOYMENT.md      # Production deployment guide
```

## 🧪 Testing

```powershell
npm test
```

The test suite includes:
- API endpoint tests
- Request validation tests
- Database operations tests
- Server functionality tests

## 🌐 Environment Variables

Create a `.env` file (not committed to version control):

```env
PORT=3000
ADMIN_TOKEN=your-secure-random-token-here-minimum-32-characters
DB_PATH=./data/prakruthi.db
```

**Important:** Never commit the `.env` file or expose the `ADMIN_TOKEN`.

## 🎨 Design System

### Color Palette
- **Primary Navy:** `#0b2f4a` - Professional, trustworthy
- **Accent Orange:** `#f15a2a` - Action, energy
- **Background:** `#f3f4f6` - Clean, modern
- **White:** `#ffffff` - Clarity

### Typography
- **Sans-serif:** System fonts for readability
- **Display:** Georgia for headings

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 📊 Business Information

**Prakruthi Driving School**
- **Established:** 2004
- **Location:** No. 472, opposite Sub Registrar Office, Jawaharlal Nehru Road, BEML Layout 3rd Stage, RR Nagar, Bengaluru 560098
- **Phone:** 080 2860 2807
- **Hours:** Open daily, 6:00 AM – 9:00 PM
- **Rating:** 4.0 ★★★★☆ (175+ Google reviews)

## 🔒 Security Features

- Rate limiting to prevent abuse
- Input sanitization against XSS attacks
- Parameterized SQL queries to prevent SQL injection
- Admin authentication via Bearer tokens
- Security headers (X-Content-Type-Options, Referrer-Policy)
- No sensitive data requested in public forms
- CORS disabled by default

## 📝 Important Notes

### Data Privacy
The application only stores:
- Customer name, phone, email (optional)
- Selected service and optional message
- Reference number and timestamp

**The form explicitly warns customers NOT to share:**
- Aadhaar numbers
- RC details
- DL numbers
- Insurance policy numbers
- Payment information

### Scope
This application:
- ✅ Accepts service enquiries
- ✅ Records them securely for the business
- ✅ Provides admin interface for management

This application does NOT:
- ❌ Submit applications to Karnataka transport portal
- ❌ Issue licences or certificates
- ❌ Alter RTO records
- ❌ Bind insurance policies

These actions require authorized business accounts, official approval, and customer consent.

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed production deployment instructions including:
- Traditional VPS deployment
- Cloud platform deployment (Render, Railway, Heroku)
- Docker containerization
- Security checklist
- Database backup strategies
- Monitoring and maintenance

## 📚 Additional Documentation

- **[SERVICES.md](SERVICES.md)** - Complete list of all 19 services with detailed descriptions
- **[QUICKSTART.md](QUICKSTART.md)** - 3-minute setup guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide

## 🤝 Support

For issues or questions:
1. Check the documentation files
2. Review the server logs (`.runtime/server.log`)
3. Test API endpoints with curl
4. Verify environment variables are set correctly

## 📄 License

This website is built specifically for **Prakruthi Driving School**.

## 🎉 Ready for Production

This is a complete, production-ready system with:
- ✅ 19 comprehensive services implemented
- ✅ Professional responsive design
- ✅ Secure backend with database
- ✅ Admin dashboard
- ✅ Complete documentation
- ✅ Security measures in place
- ✅ Testing suite included

**Just set your `ADMIN_TOKEN` and deploy!**

---

**Built with care for Prakruthi Driving School, Bengaluru** ❤️
