const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');

const tempDirectory = path.join(os.tmpdir(), `prakruthi-api-${process.pid}`);
process.env.DB_PATH = path.join(tempDirectory, 'test.db');
const { server } = require('../server');
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await fs.rm(tempDirectory, { recursive: true, force: true });
});

test('stores a valid service request in SQLite through the API', async () => {
  const response = await fetch(`${baseUrl}/api/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Anika Rao', phone: '9876543210', email: 'anika@example.com', service: 'fitness-certificate', vehicleType: 'Car' })
  });
  const body = await response.json();
  assert.equal(response.status, 201);
  assert.equal(body.ok, true);
  assert.match(body.reference, /^PDS-\d{8}-[A-Z0-9]{6}$/);
  assert.equal(await fs.stat(process.env.DB_PATH).then(() => true), true);
});

test('does not expose requests without owner authorisation', async () => {
  const response = await fetch(`${baseUrl}/api/admin/requests`);
  assert.equal(response.status, 401);
});
