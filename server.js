const express = require('express');
const connectDB = require('./config/db');

const app = express();
//connect database
connectDB();
app.use(express.json({ extends: false }));
app.get('/', (req, res) => res.send('API running'));
//define routes
app.use('/api/users', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/post', require('./routes/api/post'));
app.use('/api/profile', require('./routes/api/profile'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server start on PORT ${PORT}`));
