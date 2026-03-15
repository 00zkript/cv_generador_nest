import { Controller, Get, Post, Put, Delete, Body, Param, Req, HttpCode, HttpStatus, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserDataDto, ProfileDto, SkillDto, ExperienceDto, EducationDto, ProjectDto } from './dto/user-data.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('me')
    @ApiOperation({ summary: 'Obtener datos del usuario actual con perfil, habilidades, experiencias, educación y proyectos' })
    @ApiResponse({ status: 200, description: 'Usuario encontrado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    async getMe(@Req() req: Request) {
        const user = req.user as { id: number };
        return this.usersService.findByIdWithRelations(user.id);
    }

    @Post('data')
    @ApiOperation({ summary: 'Guardar todos los datos del usuario (profile, skills, experience, education, projects)' })
    @ApiResponse({ status: 201, description: 'Datos guardados correctamente' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    async saveUserData(@Req() req: Request, @Body() data: UserDataDto) {
        const user = req.user as { id: number };
        return this.usersService.saveUserData(user.id, data);
    }

    @Put('profile')
    @ApiOperation({ summary: 'Actualizar el perfil del usuario' })
    @ApiResponse({ status: 200, description: 'Perfil actualizado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    async updateProfile(@Req() req: Request, @Body() data: ProfileDto) {
        const user = req.user as { id: number };
        return this.usersService.updateProfile(user.id, data);
    }

    @Post('skills')
    @ApiOperation({ summary: 'Agregar una habilidad' })
    @ApiResponse({ status: 201, description: 'Habilidad creada' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    async addSkill(@Req() req: Request, @Body() data: SkillDto) {
        const user = req.user as { id: number };
        return this.usersService.addSkill(user.id, data);
    }

    @Put('skills/:id')
    @ApiOperation({ summary: 'Actualizar una habilidad' })
    @ApiResponse({ status: 200, description: 'Habilidad actualizada' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Habilidad no encontrada' })
    async updateSkill(@Param('id', ParseIntPipe) id: number, @Req() req: Request, @Body() data: SkillDto) {
        const user = req.user as { id: number };
        return this.usersService.updateSkill(id, user.id, data);
    }

    @Delete('skills/:id')
    @ApiOperation({ summary: 'Eliminar una habilidad' })
    @ApiResponse({ status: 200, description: 'Habilidad eliminada' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Habilidad no encontrada' })
    async deleteSkill(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
        const user = req.user as { id: number };
        return this.usersService.deleteSkill(id, user.id);
    }

    @Post('experiences')
    @ApiOperation({ summary: 'Agregar una experiencia laboral' })
    @ApiResponse({ status: 201, description: 'Experiencia creada' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    async addExperience(@Req() req: Request, @Body() data: ExperienceDto) {
        const user = req.user as { id: number };
        return this.usersService.addExperience(user.id, data);
    }

    @Put('experiences/:id')
    @ApiOperation({ summary: 'Actualizar una experiencia laboral' })
    @ApiResponse({ status: 200, description: 'Experiencia actualizada' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Experiencia no encontrada' })
    async updateExperience(@Param('id', ParseIntPipe) id: number, @Req() req: Request, @Body() data: ExperienceDto) {
        const user = req.user as { id: number };
        return this.usersService.updateExperience(id, user.id, data);
    }

    @Delete('experiences/:id')
    @ApiOperation({ summary: 'Eliminar una experiencia laboral' })
    @ApiResponse({ status: 200, description: 'Experiencia eliminada' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Experiencia no encontrada' })
    async deleteExperience(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
        const user = req.user as { id: number };
        return this.usersService.deleteExperience(id, user.id);
    }

    @Post('education')
    @ApiOperation({ summary: 'Agregar una educación' })
    @ApiResponse({ status: 201, description: 'Educación creada' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    async addEducation(@Req() req: Request, @Body() data: EducationDto) {
        const user = req.user as { id: number };
        return this.usersService.addEducation(user.id, data);
    }

    @Put('education/:id')
    @ApiOperation({ summary: 'Actualizar una educación' })
    @ApiResponse({ status: 200, description: 'Educación actualizada' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Educación no encontrada' })
    async updateEducation(@Param('id', ParseIntPipe) id: number, @Req() req: Request, @Body() data: EducationDto) {
        const user = req.user as { id: number };
        return this.usersService.updateEducation(id, user.id, data);
    }

    @Delete('education/:id')
    @ApiOperation({ summary: 'Eliminar una educación' })
    @ApiResponse({ status: 200, description: 'Educación eliminada' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Educación no encontrada' })
    async deleteEducation(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
        const user = req.user as { id: number };
        return this.usersService.deleteEducation(id, user.id);
    }

    @Post('projects')
    @ApiOperation({ summary: 'Agregar un proyecto' })
    @ApiResponse({ status: 201, description: 'Proyecto creado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    async addProject(@Req() req: Request, @Body() data: ProjectDto) {
        const user = req.user as { id: number };
        return this.usersService.addProject(user.id, data);
    }

    @Put('projects/:id')
    @ApiOperation({ summary: 'Actualizar un proyecto' })
    @ApiResponse({ status: 200, description: 'Proyecto actualizado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
    async updateProject(@Param('id', ParseIntPipe) id: number, @Req() req: Request, @Body() data: ProjectDto) {
        const user = req.user as { id: number };
        return this.usersService.updateProject(id, user.id, data);
    }

    @Delete('projects/:id')
    @ApiOperation({ summary: 'Eliminar un proyecto' })
    @ApiResponse({ status: 200, description: 'Proyecto eliminado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
    async deleteProject(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
        const user = req.user as { id: number };
        return this.usersService.deleteProject(id, user.id);
    }

    @Put('me')
    @ApiOperation({ summary: 'Actualizar datos del usuario actual' })
    @ApiResponse({ status: 200, description: 'Usuario actualizado' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    async updateMe(@Req() req: Request, @Body() updateData: any) {
        const user = req.user as { id: number };
        return this.usersService.update(user.id, updateData);
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
