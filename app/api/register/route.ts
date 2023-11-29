import bcrypt from 'bcrypt';
import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {

    try {
        const body = await request.json();
        const { email, name, password } = body;

        const existingUser = await prismadb.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'Email taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prismadb.user.create({
            data: {
                email,
                name,
                hashedPassword,
                image: '',
                emailVerified: new Date(),
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.log(error);
        return NextResponse.error();
    }
}
