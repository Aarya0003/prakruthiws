// Prakruthi Driving School - Frontend JavaScript

let services = [];
let selectedService = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  loadServices();
  setupEventListeners();
  setupMobileMenu();
});

// Load services from API
async function loadServices() {
  try {
    const response = await fetch('/api/services');
    if (!response.ok) throw new Error('Failed to load services');
    
    services = await response.json();
    renderServices(services);
    populateServiceSelect(services);
  } catch (error) {
    console.error('Error loading services:', error);
    showError('Failed to load services. Please refresh the page.');
  }
}

// Render services grid
function renderServices(servicesToRender) {
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;
  
  grid.innerHTML = servicesToRender.map(service => `
    <div class="service-card" data-group="${service.group}">
      <span class="service-group">${service.group}</span>
      <h3>${service.name}</h3>
      <p>${service.description}</p>
      <div class="service-documents">
        <h4>Required Documents:</h4>
        <ul>
          ${service.documents.map(doc => `<li>${doc}</li>`).join('')}
        </ul>
      </div>
      <button class="btn btn-primary" onclick="selectService('${service.slug}')">
        Request This Service
      </button>
    </div>
  `).join('');
}

// Populate service select dropdown
function populateServiceSelect(services) {
  const select = document.getElementById('serviceSelect');
  if (!select) return;
  
  // Group services
  const groups = {};
  services.forEach(service => {
    if (!groups[service.group]) {
      groups[service.group] = [];
    }
    groups[service.group].push(service);
  });
  
  // Add optgroups
  let html = '<option value="">Select a service</option>';
  Object.keys(groups).forEach(group => {
    html += `<optgroup label="${group}">`;
    groups[group].forEach(service => {
      html += `<option value="${service.slug}">${service.name}</option>`;
    });
    html += `</optgroup>`;
  });
  
  select.innerHTML = html;
}

// Filter services
function filterServices(group) {
  if (group === 'all') {
    renderServices(services);
  } else {
    const filtered = services.filter(s => s.group === group);
    renderServices(filtered);
  }
}

// Select service and scroll to form
function selectService(slug) {
  const service = services.find(s => s.slug === slug);
  if (!service) return;
  
  selectedService = service;
  
  const select = document.getElementById('serviceSelect');
  if (select) {
    select.value = slug;
  }
  
  // Scroll to form
  const formSection = document.getElementById('request-form');
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Setup event listeners
function setupEventListeners() {
  // Filter buttons
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterServices(btn.dataset.group);
    });
  });
  
  // Form submission
  const form = document.getElementById('requestForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
  
  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// Handle form submission
async function handleFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;
  
  // Disable button and show loading
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';
  
  // Get form data
  const formData = {
    serviceSlug: document.getElementById('serviceSelect').value,
    name: document.getElementById('name').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    email: document.getElementById('email').value.trim() || null,
    message: document.getElementById('message').value.trim() || null
  };
  
  // Validate
  if (!formData.serviceSlug) {
    showError('Please select a service');
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
    return;
  }
  
  if (!formData.name || formData.name.length < 2) {
    showError('Please enter your full name');
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
    return;
  }
  
  if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone)) {
    showError('Please enter a valid 10-digit mobile number');
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
    return;
  }
  
  try {
    const response = await fetch('/api/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit request');
    }
    
    // Show success
    document.getElementById('referenceNumber').textContent = data.referenceNumber;
    document.getElementById('requestForm').style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
    
    // Scroll to success message
    document.getElementById('formSuccess').scrollIntoView({ behavior: 'smooth', block: 'center' });
    
  } catch (error) {
    console.error('Error submitting request:', error);
    showError(error.message || 'Failed to submit request. Please try again.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }
}

// Reset form
function resetForm() {
  document.getElementById('requestForm').reset();
  document.getElementById('requestForm').style.display = 'block';
  document.getElementById('formSuccess').style.display = 'none';
  document.getElementById('request-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Show error message
function showError(message) {
  alert(message); // Simple alert for now, can be enhanced with a custom modal
}

// Setup mobile menu
function setupMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }
}

// Make resetForm available globally
window.resetForm = resetForm;
window.selectService = selectService;
