const express = require('express');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use('/api', userRoutes);


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
