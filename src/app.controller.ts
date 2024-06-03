import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    constructor() {}

    @Get()
    getHello(): string {
        return 'Welcome to prisma, nest js, stripe payment gateway, and jwt authentication!';
    }
}
