import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findByUsername(username: string) {
        return this.prisma.user.findUnique({
            where: { username },
        });
    }

    async createUser(email: string, username: string, passwordHash: string) {
        return this.prisma.user.create({
            data: {
                email,
                username,
                passwordHash,
            },
        });
    }
}
