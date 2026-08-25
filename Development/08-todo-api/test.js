const assert = require('node:assert/strict');
const http = require('node:http');

// Lightweight smoke tests for the API contract. These tests are intentionally
// kept dependency-free so the project can run on a standard Node installation.
async function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port: 3000, path, method, headers: { 'Content-Type': 'application/json' } }, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null }));
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

(async () => {
  const list = await request('GET', '/todos');
  assert.equal(list.status, 200);
  assert.ok(Array.isArray(list.body));

  const created = await request('POST', '/todos', { title: 'Write tests' });
  assert.equal(created.status, 201);
  assert.equal(created.body.title, 'Write tests');
  assert.equal(created.body.done, false);

  const invalid = await request('POST', '/todos', {});
  assert.equal(invalid.status, 400);

  console.log('Todo API smoke tests passed.');
})();
