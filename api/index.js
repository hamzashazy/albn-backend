const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const StudentRoutes = require('../routes/StudentRoutes');
const AdminRoutes = require('../routes/AdminRoutes');
const superAdminRoutes = require('../routes/superAdminRoutes');
const ProgramRoutes = require('../routes/ProgramRoutes');
const CampusRoutes = require('../routes/CampusRoutes');
const GroupRoutes = require('../routes/GroupRoutes');
const errorHandler = require('../middleware/errorHandler');
const cors = require('cors');
const serverless = require('serverless-http'); // 👈 required for Vercel



dotenv.config();
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Routes
app.use('/api/admin', AdminRoutes);
app.use('/api/student', StudentRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/campus', CampusRoutes);
app.use('/api/program', ProgramRoutes);
app.use('/api/group', GroupRoutes);

app.use(errorHandler);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Export for Vercel serverless
module.exports = app;
module.exports.handler = serverless(app);


if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}