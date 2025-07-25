import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcrypt';
import { send } from "process";

const prisma = new PrismaClient();

async function main() {

    const password1 = await bcrypt.hash('password123', 10);
    const password2 = await bcrypt.hash('password456', 10);

    const user1 = await prisma.user.create({ 
        data: { 
            id: 1,
            name: 'Acel',
            username: 'acel',
            email: 'acel@example.com',
            password: 'password1',
            status: 'active',
            role: 'admin'
        }, 
    });

    const user2 = await prisma.user.create({ 
        data: { 
            id: 2,
            name: 'Bill',
            username: 'bill',
            email: 'bill@example.com',
            password: 'password2',
            status: 'active',
            role: 'user'
        }, 
    });

    const account1 = await prisma.account.create({
        data: {
            userId: user1.id,
            accountNumber: 'ACC1234567890',
            accountType: 'checking',
            status: 'active',
            balance: 100000000.00,
            currency: 'IDR',
        },
    });

    const account2 = await prisma.account.create({
        data: {
            userId: user2.id,
            accountNumber: 'ACC9876543210',
            accountType: 'savings',
            status: 'active',
            balance: 5000000,
            currency: 'IDR',
        },
    });

    await prisma.transaction.createMany({
        data: [
            {
                userId: user1.id,
                accountId: account1.id,
                senderId: null,
                receiverId: null,
                type: 'deposit',
                amount: 1000000,
                currency: 'IDR',
                status: 'success',
                description: 'Initial deposit',
            },
            {
                userId: user1.id,
                accountId: account1.id,
                senderId: account1.accountNumber,
                receiverId: 'ACC67890',
                type: 'transfer',
                amount: 500000,
                currency: 'IDR',
                status: 'success',
                description: 'Split bill 24/7/25',
            },
            {
                userId: user2.id,
                accountId: account2.id,
                type: 'withdrawal',
                amount: 1000000,
                currency: 'IDR',
                status: 'success',
                description: 'Weekly withdrawal',
            }
        ],
    });

    console.log('Database has been seeded.');
};

main()
    .catch((e) => {
        console.error('Error seeding the database:', e);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect();
    });