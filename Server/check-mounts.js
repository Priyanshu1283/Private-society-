const express = require('express');
const mounts = [
  { path: '/api/auth', mod: './routes/auth-routes' },
  { path: '/api/events', mod: './routes/event-routes' },
  { path: '/api/complaints', mod: './routes/complaint-routes' },
  { path: '/api/services', mod: './routes/service-routes' },
  { path: '/api/me', mod: './routes/me-routes' },
  { path: '/api/admin', mod: './routes/admin-routes' }
];

const app = express();

for (const m of mounts) {
  try {
    console.log('Mounting', m.path, '->', m.mod);
    const router = require(m.mod);
    app.use(m.path, router);
    console.log('Mounted', m.path);
  } catch (err) {
    console.error('Error mounting', m.path, '->', m.mod);
    console.error(err && err.stack ? err.stack : err);
  }
}

console.log('Done mounting checks');
