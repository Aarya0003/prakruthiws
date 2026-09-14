const http = require('http');
const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'prakruthi2024';
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'prakruthi.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize SQLite database with WAL mode for better performance
const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode = WAL');

// Create requests table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reference_number TEXT UNIQUE NOT NULL,
    service_slug TEXT NOT NULL,
    service_name TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    message TEXT,
    status TEXT DEFAULT 'new',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create indexes for better query performance
db.exec('CREATE INDEX IF NOT EXISTS idx_status ON requests(status)');
db.exec('CREATE INDEX IF NOT EXISTS idx_created_at ON requests(created_at DESC)');
db.exec('CREATE INDEX IF NOT EXISTS idx_service_slug ON requests(service_slug)');

// Comprehensive service catalog - 19 services
const SERVICES = [
  { 
    slug: 'driving-classes', 
    name: 'Driving Classes & DL Support', 
    group: 'Driving School & Licence',
    description: 'Professional driving lessons for two-wheelers and four-wheelers with experienced instructors. We provide comprehensive training to help you pass your driving test confidently.',
    documents: ['Age proof (18+ for LMV, 16+ for two-wheeler)', 'Address proof', 'Medical certificate (if applicable)']
  },
  { 
    slug: 'learners-licence', 
    name: "Learner's Licence (LL)", 
    group: 'Driving School & Licence',
    description: 'Get your learner\'s licence processed quickly. We handle all documentation and RTO coordination for both two-wheeler and four-wheeler learner permits.',
    documents: ['Age proof', 'Address proof', 'Passport-size photos', 'Form 2']
  },
  { 
    slug: 'new-dl', 
    name: 'New Driving Licence (DL)', 
    group: 'Driving School & Licence',
    description: 'Complete assistance for obtaining your permanent driving licence after your learner period. We guide you through the entire process including the driving test.',
    documents: ['Valid Learner\'s Licence', 'Address proof', 'Passport-size photos', 'Form 4']
  },
  { 
    slug: 'dl-renewal', 
    name: 'Driving Licence Renewal', 
    group: 'Driving School & Licence',
    description: 'Renew your expired or expiring driving licence hassle-free. We handle all paperwork and RTO formalities.',
    documents: ['Existing DL', 'Address proof', 'Passport-size photos', 'Medical certificate (for commercial vehicles or age 50+)']
  },
  { 
    slug: 'international-permit', 
    name: 'International Driving Permit', 
    group: 'Driving School & Licence',
    description: 'Get your International Driving Permit for driving abroad. Valid in over 150 countries following the Geneva Convention.',
    documents: ['Valid Indian DL', 'Passport copy', 'Visa copy (if available)', 'Passport-size photos', 'Form 4A']
  },
  { 
    slug: 'vehicle-registration', 
    name: 'New Vehicle Registration', 
    group: 'Vehicle Documentation',
    description: 'Complete registration services for new two-wheelers and four-wheelers. We handle all RTO formalities for permanent registration.',
    documents: ['Invoice from dealer', 'Insurance certificate', 'Chassis and engine number rubbing', 'Form 20 & 21', 'Address proof', 'Identity proof']
  },
  { 
    slug: 'ownership-transfer', 
    name: 'Vehicle Ownership Transfer', 
    group: 'Vehicle Documentation',
    description: 'Transfer vehicle ownership when buying or selling. We ensure smooth RC transfer with proper documentation.',
    documents: ['Original RC', 'Insurance certificate', 'Sale agreement', 'Form 29 & 30', 'Address proof of new owner', 'NOC from financer (if applicable)']
  },
  { 
    slug: 'duplicate-rc', 
    name: 'Duplicate RC', 
    group: 'Vehicle Documentation',
    description: 'Lost your RC book? Get a duplicate Registration Certificate issued quickly with our assistance.',
    documents: ['FIR copy (if lost)', 'Insurance certificate', 'Identity proof', 'Address proof', 'Form 26']
  },
  { 
    slug: 'hypothecation-removal', 
    name: 'Hypothecation Removal', 
    group: 'Vehicle Documentation',
    description: 'Remove loan hypothecation from your RC after completing vehicle loan payment.',
    documents: ['Original RC', 'NOC from bank/financer', 'Loan closure certificate', 'Form 35']
  },
  { 
    slug: 'motor-insurance', 
    name: 'Motor Insurance Support', 
    group: 'Insurance & Compliance',
    description: 'Assistance with motor insurance purchase, renewal, and claim processing for all vehicle types.',
    documents: ['RC copy', 'Previous insurance policy (for renewal)', 'Driving licence', 'Inspection report (if required)']
  },
  { 
    slug: 'fitness-certificate', 
    name: 'Fitness Certificate (FC)', 
    group: 'Insurance & Compliance',
    description: 'FC renewal for commercial vehicles. We coordinate vehicle inspection and certificate issuance.',
    documents: ['Original RC', 'Insurance certificate', 'Pollution certificate', 'Tax receipt', 'Form 22']
  },
  { 
    slug: 'pollution-certificate', 
    name: 'Pollution Under Control (PUC)', 
    group: 'Insurance & Compliance',
    description: 'Get your PUC certificate for emission compliance. Required for all vehicles every 6 months.',
    documents: ['RC copy', 'Previous PUC (if any)']
  },
  { 
    slug: 'noc-registration', 
    name: 'NOC & Re-registration', 
    group: 'Transfer & Commercial',
    description: 'Interstate vehicle transfer assistance. We obtain NOC from original RTO and handle re-registration in Karnataka.',
    documents: ['Original RC', 'Insurance certificate', 'Address proof in Karnataka', 'NOC from original RTO', 'Form 27 & 28']
  },
  { 
    slug: 'commercial-permit', 
    name: 'Commercial Permits', 
    group: 'Transfer & Commercial',
    description: 'Obtain commercial permits for taxis, goods vehicles, and transport vehicles.',
    documents: ['RC copy', 'Insurance certificate', 'Fitness certificate', 'Route permit application', 'Form 46']
  },
  { 
    slug: 'address-change', 
    name: 'Address Change in DL/RC', 
    group: 'RTO Services',
    description: 'Update your address in driving licence or vehicle RC when you relocate.',
    documents: ['Original DL/RC', 'New address proof', 'Form 18 (for RC) or Form 9 (for DL)']
  },
  { 
    slug: 'name-change', 
    name: 'Name Change in Documents', 
    group: 'RTO Services',
    description: 'Update name in DL or RC due to marriage or legal name change.',
    documents: ['Original DL/RC', 'Name change gazette notification or marriage certificate', 'Form 9 (DL) or Form 18 (RC)']
  },
  { 
    slug: 'road-tax', 
    name: 'Road Tax Payment', 
    group: 'RTO Services',
    description: 'Lifetime tax payment and renewal assistance for all vehicle types.',
    documents: ['Original RC', 'Insurance certificate', 'Challan (if any)']
  },
  { 
    slug: 'vehicle-inspection', 
    name: 'Vehicle Inspection Assistance', 
    group: 'RTO Services',
    description: 'Pre-inspection support for fitness certificate and other RTO inspections.',
    documents: ['RC copy', 'Insurance certificate', 'Previous FC (if applicable)']
  },
  { 
    slug: 'other-rto', 
    name: 'Other RTO Documentation', 
    group: 'RTO Services',
    description: 'Any other RTO-related services not listed above. Contact us with your requirement.',
    documents: ['Depends on service requirement']
  }
];

// Rate limiting: track request counts per IP
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 12; // 12 requests per hour per IP

function checkRateLimit(ip) {
  const now = Date.now();
  const clientData = rateLimitStore.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  
  if (now > clientData.resetTime) {
    clientData.count = 0;
    clientData.resetTime = now + RATE_LIMIT_WINDOW;
  }
  
  clientData.count++;
  rateLimitStore.set(ip, clientData);
  
  return clientData.count <= RATE_LIMIT_MAX;
}

function generateReferenceNumber() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `PDS-${date}-${random}`;
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
}

function validatePhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

function validateEmail(email) {
  if (!email) return true; // Email is optional
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const server = http.createServer((req, res) => {
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
  
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Health check
  if (req.url === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }));
    return;
  }
  
  // Get services
  if (req.url === '/api/services' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(SERVICES));
    return;
  }
  
  // Submit request
  if (req.url === '/api/requests' && req.method === 'POST') {
    if (!checkRateLimit(clientIp)) {
      res.writeHead(429, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Too many requests. Please try again later.' }));
      return;
    }
    
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        
        // Validate required fields
        if (!data.serviceSlug || !data.name || !data.phone) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing required fields' }));
          return;
        }
        
        // Find service
        const service = SERVICES.find(s => s.slug === data.serviceSlug);
        if (!service) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid service' }));
          return;
        }
        
        // Validate phone
        if (!validatePhone(data.phone)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid phone number format' }));
          return;
        }
        
        // Validate email if provided
        if (data.email && !validateEmail(data.email)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid email format' }));
          return;
        }
        
        // Sanitize inputs
        const name = sanitizeInput(data.name);
        const phone = sanitizeInput(data.phone);
        const email = data.email ? sanitizeInput(data.email) : null;
        const message = data.message ? sanitizeInput(data.message) : null;
        const referenceNumber = generateReferenceNumber();
        
        // Insert into database
        const stmt = db.prepare(`
          INSERT INTO requests (reference_number, service_slug, service_name, name, phone, email, message)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run(referenceNumber, data.serviceSlug, service.name, name, phone, email, message);
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true,
          referenceNumber,
          message: 'Request submitted successfully'
        }));
      } catch (err) {
        console.error('Error processing request:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
    return;
  }
  
  // Admin: Get all requests
  if (req.url === '/api/admin/requests' && req.method === 'GET') {
    const authHeader = req.headers.authorization;
    const credentials = authHeader?.replace('Basic ', '');
    
    if (!credentials) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }
    
    const decodedCredentials = Buffer.from(credentials, 'base64').toString('utf-8');
    const [username, password] = decodedCredentials.split(':');
    
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid credentials' }));
      return;
    }
    
    try {
      const stmt = db.prepare('SELECT * FROM requests ORDER BY created_at DESC');
      const requests = stmt.all();
      
      // Get statistics
      const stats = {
        total: requests.length,
        new: requests.filter(r => r.status === 'new').length,
        popularServices: {}
      };
      
      requests.forEach(r => {
        stats.popularServices[r.service_name] = (stats.popularServices[r.service_name] || 0) + 1;
      });
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ requests, stats }));
    } catch (err) {
      console.error('Error fetching requests:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
    return;
  }
  
  // Serve static files
  const publicDir = path.join(__dirname, 'public');
  
  // Remove query string from URL
  const urlPath = req.url.split('?')[0];
  let filePath = path.join(publicDir, urlPath === '/' ? 'index.html' : urlPath);
  
  const extname = path.extname(filePath);
  const contentTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };
  
  const contentType = contentTypes[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`, 'utf-8');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`✓ Prakruthi Driving School server running on http://127.0.0.1:${PORT}`);
  console.log(`✓ Database: ${DB_PATH}`);
  console.log(`✓ Admin Login - Username: ${ADMIN_USERNAME} | Password: ${ADMIN_PASSWORD}`);
});
