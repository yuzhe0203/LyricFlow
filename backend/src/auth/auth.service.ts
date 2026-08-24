import { UnauthorizedException, ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async register(email: string, username: string, password: string) {
        const existedemail = await this.userService.findByEmail(email);
        if (existedemail) throw new ConflictException('Email already exists');

        const existedusername = await this.userService.findByUsername(username);
        if (existedusername) throw new ConflictException('Username already exists');

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await this.userService.createUser(email, username, passwordHash);

        return { message: 'Registered successfully', user: { id: newUser.id } };
    }

    async login(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) throw new UnauthorizedException('Invalid email or password');

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) throw new UnauthorizedException('Invalid email or password');

        const token = await this.generateToken({ id: user.id, email: user.email });
        return { token };
    }

    private async generateToken(user: { id: string; email: string }) {
        const payload = { sub: user.id, email: user.email };
        return this.jwtService.signAsync(payload);
    }
}
