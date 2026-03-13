import { Controller, Get, Put, Delete, Body, Req, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('me')
    @ApiOperation({ summary: 'Obtener datos del usuario actual' })
    @ApiResponse({ status: 200, description: 'Usuario encontrado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    async getMe(@Req() req: Request) {
        const user = req.user as { id: number };
        return this.usersService.findById(user.id);
    }

    @Put('me')
    @ApiOperation({ summary: 'Actualizar datos del usuario actual' })
    @ApiResponse({ status: 200, description: 'Usuario actualizado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    async updateMe(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
        const user = req.user as { id: number };
        return this.usersService.update(user.id, updateUserDto);
    }

    @Delete('me')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Darse de baja (eliminar cuenta)' })
    @ApiResponse({ status: 204, description: 'Cuenta eliminada' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    async deleteMe(@Req() req: Request) {
        const user = req.user as { id: number };
        await this.usersService.delete(user.id);
    }
}
