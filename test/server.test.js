const test = require('node:test');
const assert = require('node:assert/strict');
const { validateRequest, SERVICES } = require('../server');

test('accepts a valid service request', () => {
  const { request, errors } = validateRequest({ name: 'Anika Rao', phone: '9876543210', email: 'anika@example.com', service: 'vehicle-transfer', vehicleType: 'Car' });
  assert.deepEqual(errors, {});
  assert.equal(request.name, 'Anika Rao');
  assert.equal(request.service, 'vehicle-transfer');
});

test('rejects incomplete or invalid requests', () => {
  const { errors } = validateRequest({ name: 'A', phone: '12345', service: 'made-up-service' });
  assert.ok(errors.name);
  assert.ok(errors.phone);
  assert.ok(errors.service);
});

test('publishes the requested RTO and vehicle services', () => {
  const serviceNames = SERVICES.map((service) => service.name).join(' ');
  assert.match(serviceNames, /Vehicle ownership transfer/);
  assert.match(serviceNames, /Motor insurance support/);
  assert.match(serviceNames, /Fitness certificate/);
});
