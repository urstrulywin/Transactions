import express from 'express';
import { auth } from '../middleware.js';
import { Account } from '../db.js';
import mongoose from 'mongoose';
import zod from 'zod';

const router = express.Router();

router.get("/balance", auth, async (req, res) => {
    try {
        const account = await Account.findOne({ userId: req.userId });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }
        
        res.json({ balance: account.balance });
    } catch (error) {
        console.error("Error fetching balance:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

const transferSchema = zod.object({
    amount: zod.preprocess((val) => Number(val), zod.number().positive()),
    to: zod.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid account ID format"
    })
}).strict();

router.post("/transfer", auth, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to } = transferSchema.parse(req.body);

        console.log("Transfer initiated", { from: req.userId, to, amount });

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

        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        await session.commitTransaction();
        res.json({ message: "Transfer successful" });
    } catch (error) {
        await session.abortTransaction();

        if (error instanceof zod.ZodError) {
            return res.status(400).json({
                message: "Invalid input",
                errors: error.errors.map((err) => err.message)
            });
        }

        console.error("Error during transfer:", error);
        res.status(500).json({ message: "Internal server error" });
    } finally {
        session.endSession();
    }
});

export default router;