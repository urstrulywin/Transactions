import express from 'express';
import zod from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // Add bcrypt for password hashing
import { User, Account } from '../db.js';
import { auth } from '../middleware.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const signUpSchema = zod.object({
    username: zod.string().email().max(30),
    firstname: zod.string().max(50),
    lastname: zod.string().max(50),
    password: zod.string().min(6)
}).strict();

const signInSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
}).strict();

const updateSchema = zod.object({
    password: zod.string().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional()
}).strict();

router.post('/signup', async (req, res) => {
    try {
        // Validate input using .parse() and .strict()
        const validatedData = signUpSchema.parse(req.body);

        // Check if user already exists
        const existingUser = await User.findOne({ username: validatedData.username });
        if (existingUser) {
            return res.status(409).json({ message: "Email already taken" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        // Create user with hashed password
        const user = await User.create({
            ...validatedData,
            password: hashedPassword // Replace plain-text password with hashed password
        });

        // Create an account for the user
        await Account.create({
            userId: user._id,
            balance: 1 + Math.random() * 10000
        });

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.json({ message: "User created successfully", token });
    } catch (error) {
        console.error('Validation failed:', error.errors);

        // Return detailed validation errors
        if (error instanceof zod.ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }

        // Handle other errors
        res.status(500).json({ message: "Internal server error" });
    }
});

// Signin endpoint
router.post('/signin', async (req, res) => {
    try {
        // Validate input using .parse() and .strict()
        const validatedData = signInSchema.parse(req.body);

        // Find user
        const user = await User.findOne({ username: validatedData.username });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare hashed password
        const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        console.error('Validation failed:', error.errors);

        // Return detailed validation errors
        if (error instanceof zod.ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }

        // Handle other errors
        res.status(500).json({ message: "Internal server error" });
    }
});

// Update endpoint
router.put('/update', auth, async (req, res) => {
    try {
        // Validate input using .parse() and .strict()
        const validatedData = updateSchema.parse(req.body);

        // Hash the new password if provided
        if (validatedData.password) {
            validatedData.password = await bcrypt.hash(validatedData.password, 10);
        }

        // Update user details
        await User.updateOne({ _id: req.userId }, validatedData);
        res.json({ message: "Updated successfully" });
    } catch (error) {
        console.error('Validation failed:', error.errors);

        // Return detailed validation errors
        if (error instanceof zod.ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }

        // Handle other errors
        res.status(500).json({ message: "Internal server error" });
    }
});

// Bulk endpoint
router.get('/bulk', auth, async (req, res) => {
    const filter = req.query.filter || '';

    // Find users matching the filter
    const users = await User.find({
        $or: [
            { firstname: { $regex: new RegExp(filter, 'i') } },
            { lastname: { $regex: new RegExp(filter, 'i') } }
        ]
    });

    // Return filtered users
    res.json({
        users: users.map(user => ({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id
        }))
    });
});

export default router;