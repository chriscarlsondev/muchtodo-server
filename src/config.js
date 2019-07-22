module.exports = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: 'postgresql://dunder-mifflin@localhost/muchtodo',
    CORS_ORIGIN: '*'
  }