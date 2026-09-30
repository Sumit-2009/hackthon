import app from './app.js';

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🌱 AgriSmart AI: Precision Agriculture Assistant`);
    console.log(`🚀 API Server running on http://localhost:${PORT}`);
    console.log(`⚙️ Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`====================================================`);
  });
}

export default app;
