require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // 👈 add this
dns.setDefaultResultOrder('ipv4first');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.use('/api/super-admin', require('./routes/superAdmin'));
app.use('/api/org-admin', require('./routes/orgAdmin'));
app.use('/api/user', require('./routes/user'));
app.get('/health', (req, res) => res.json({ status: 'ok' }));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));