const modules = [
  './routes/auth-routes',
  './routes/event-routes',
  './routes/complaint-routes',
  './routes/service-routes',
  './routes/me-routes',
  './routes/admin-routes'
];

modules.forEach(m => {
  try {
    console.log('Requiring', m);
    require(m);
    console.log('OK', m);
  } catch (e) {
    console.error('ERROR requiring', m);
    console.error(e && e.stack ? e.stack : e);
  }
});
