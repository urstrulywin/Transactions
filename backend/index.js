import express from 'express';
import cors from 'cors';
import rootRouter from './routes/index.js';

const app = express();

// CORS Configuration
app.use(
    cors({
        origin: 'http://localhost:5173', // Allow only this origin
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
        allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
        credentials: true // Allow cookies and credentials
    })
);

// Middleware to parse JSON bodies
app.use(express.json());

// Mount the root router
app.use('/api', rootRouter); // Prefix all routes with `/api`

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});