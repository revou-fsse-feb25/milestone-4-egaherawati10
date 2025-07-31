import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {

    await prisma.transaction.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();

    const password1 = await bcrypt.hash('password123', 10);
    const password2 = await bcrypt.hash('password456', 10);

    const user1 = await prisma.user.create({ 
        data: { 
            name: 'Acel',
            username: 'acel',
            email: 'acel@example.com',
            password: password1,
            status: 'active',
            role: 'admin'
        }, 
    });

    const user2 = await prisma.user.create({ 
        data: { 
            name: 'Bill',
            username: 'bill',
            email: 'bill@example.com',
            password: password2,
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
                accountId: account1.id,
                senderId: user1.id,
                receiverId: null,
                type: 'deposit',
                amount: 1000000,
                currency: 'IDR',
                status: 'success',
                description: 'Initial deposit',
            },
            {
                accountId: account1.id,
                senderId: user1.id,
                receiverId:user2.id,
                type: 'transfer',
                amount: 500000,
                currency: 'IDR',
                status: 'success',
                description: 'Split bill 24/7/25',
            },
            {
                accountId: account2.id,
                senderId: user2.id,
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