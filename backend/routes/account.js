import express from 'express';
import { auth } from '../middleware.js';
import { Account } from '../db.js';
import mongoose from 'mongoose';
import zod from 'zod';

const router = express.Router();

// Zod schema for transfer request
const transferSchema = zod.object({
    amount: zod.number().positive(), // Amount must be a positive number
    to: zod.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid account ID format"
    })
}).strict();

// Get balance endpoint
router.get("/balance", auth, async (req, res) => {
    try {
        const account = await Account.findOne({ userId: req.userId });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }
        
        res.json({ balance: account.balance });
    } catch (error) {
        console.error("Error fetching balance:", error); // Debugging line
        res.status(500).json({ message: "Internal server error" });
    }
});

// Transfer endpoint
router.post("/transfer", auth, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Validate input using Zod
        const { amount, to } = transferSchema.parse(req.body);

        // Fetch sender and recipient accounts in a single query
        const [fromAccount, toAccount] = await Promise.all([
            Account.findOne({ userId: req.userId }).session(session),
            Account.findOne({ userId: to }).session(session)
        ]);

        if (!fromAccount || !toAccount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid sender or recipient account" });
        }

        if (fromAccount.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // Perform the transfer
        await Account.updateOne(
            { userId: req.userId },
            { $inc: { balance: -amount } }
        ).session(session);

        await Account.updateOne(
            { userId: to },
            { $inc: { balance: amount } }
        ).session(session);

        // Commit the transaction
        await session.commitTransaction();
        res.json({ message: "Transfer successful" });
    } catch (error) {
        // Abort the transaction in case of any error
        await session.abortTransaction();

        if (error instanceof zod.ZodError) {
            // Handle Zod validation errors
            return res.status(400).json({
                message: "Invalid input",
                errors: error.errors.map(err => err.message)
            });
        }

        // Log unexpected errors
        console.error("Error during transfer:", error);
        res.status(500).json({ message: "Internal server error" });
    } finally {
        // End the session
        if (session) {
            session.endSession();
        }
    }
});

export default router;