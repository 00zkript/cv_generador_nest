import { HttpException, HttpStatus, Logger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export interface UserData {
    profile: {
        headline?: string;
        about?: string;
        phone?: string;
        location?: string;
        linkedin_url?: string;
        github_url?: string;
        portfolio_url?: string;
    };
    skills: Array<{
        name: string;
        level?: string;
        years_experience?: number;
        category?: string;
    }>;
    experiences: Array<{
        company: string;
        role: string;
        start_date: Date | string;
        end_date?: Date | string;
        is_current: boolean;
        description?: string;
    }>;
    education: Array<{
        institution: string;
        degree: string;
        field_of_study?: string;
        start_date?: Date | string;
        end_date?: Date | string;
    }>;
    projects: Array<{
        title: string;
        description?: string;
        project_url?: string;
        github_url?: string;
    }>;
    name: string;
}

export interface JobOfferData {
    target_role: string;
    target_company: string;
    job_description: string;
}

export interface GeneratedCvData {
    summary: string;
    keywords: string[];
    skills: string[];
    experience_highlights: Array<{
        company: string;
        role: string;
        period: string;
        highlights: string[];
    }>;
    education_highlights: Array<{
        institution: string;
        degree: string;
        field_of_study?: string;
        period: string;
    }>;
    ats_optimized_content: Record<string, unknown>;
}

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);
    private openai: OpenAI;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('DEEPSEEK_API_KEY') || '';
        
        if (!apiKey) {
            this.logger.warn('DEEPSEEK_API_KEY no está configurada en las variables de entorno');
        }

        this.openai = new OpenAI({
            apiKey,
            baseURL: 'https://api.deepseek.com',
        });
    }

    async generateCvWithDeepSeek(userData: UserData, jobOffer: JobOfferData): Promise<GeneratedCvData> {
        this.logger.log({
            message: 'Iniciando generación de CV con IA',
            targetRole: jobOffer.target_role,
            targetCompany: jobOffer.target_company,
            userName: userData.name,
        });

        this.validateInputData(userData, jobOffer);

        const prompt = this.buildPrompt(userData, jobOffer);

        try {
            const response = await this.openai.chat.completions.create({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: 'Eres un experto en optimización de CVs para pasar filtros ATS y atraer reclutadores. Devuelve siempre un JSON válido con la estructura especificada.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.7,
                max_tokens: 4000,
            });

            const content = response.choices[0]?.message?.content;

            this.logger.log({
                message: 'Respuesta de DeepSeek recibida',
                hasContent: !!content,
                tokensUsed: response.usage?.total_tokens,
            });

            return this.parseAiResponse(content);
        } catch (error) {
            this.handleAiError(error);
            throw new HttpException(
                'Ocurrió un error al generar el CV',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    private validateInputData(userData: UserData, jobOffer: JobOfferData): void {
        if (!jobOffer.target_role?.trim()) {
            throw new HttpException(
                'El puesto objetivo es requerido',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (!jobOffer.target_company?.trim()) {
            throw new HttpException(
                'La empresa objetivo es requerida',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (!jobOffer.job_description?.trim()) {
            throw new HttpException(
                'La descripción del puesto es requerida',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (jobOffer.job_description.length < 50) {
            throw new HttpException(
                'La descripción del puesto debe tener al menos 50 caracteres',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (!userData.name?.trim()) {
            throw new HttpException(
                'El nombre del usuario es requerido',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    private parseAiResponse(content: string | null | undefined): GeneratedCvData {
        if (!content) {
            this.logger.error('La respuesta de la IA está vacía');
            throw new HttpException(
                'La respuesta del servicio de IA está vacía',
                HttpStatus.BAD_GATEWAY,
            );
        }

        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            
            if (!jsonMatch || !jsonMatch[0]) {
                this.logger.error('No se encontró JSON en la respuesta de la IA');
                throw new HttpException(
                    'El formato de respuesta de la IA no es válido',
                    HttpStatus.BAD_GATEWAY,
                );
            }

            const parsed = JSON.parse(jsonMatch[0]) as GeneratedCvData;
            
            this.validateParsedData(parsed);

            return parsed;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            
            this.logger.error({
                message: 'Error al parsear respuesta de IA',
                error: error instanceof Error ? error.message : 'Error desconocido',
            });
            
            throw new HttpException(
                'No se pudo procesar la respuesta del servicio de IA',
                HttpStatus.BAD_GATEWAY,
            );
        }
    }

    private validateParsedData(data: GeneratedCvData): void {
        const requiredFields = ['summary', 'keywords', 'skills'];
        const missingFields: string[] = [];

        for (const field of requiredFields) {
            if (!data[field as keyof GeneratedCvData]) {
                missingFields.push(field);
            }
        }

        if (missingFields.length > 0) {
            this.logger.error({
                message: 'Faltan campos requeridos en la respuesta de la IA',
                missingFields,
            });
            throw new HttpException(
                `La respuesta de la IA no contiene todos los campos requeridos: ${missingFields.join(', ')}`,
                HttpStatus.BAD_GATEWAY,
            );
        }

        if (!Array.isArray(data.keywords) || !Array.isArray(data.skills)) {
            throw new HttpException(
                'El formato de keywords/skills en la respuesta de la IA no es válido',
                HttpStatus.BAD_GATEWAY,
            );
        }
    }

    private handleAiError(error: unknown): void {
        if (error instanceof HttpException) {
            throw error;
        }

        if (error instanceof OpenAI.APIError) {
            this.logger.error({
                message: 'Error de API de OpenAI/DeepSeek',
                status: error.status,
                error: error.message,
            });

            if (error.status === 401) {
                throw new HttpException(
                    'Error de autenticación con el servicio de IA',
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (error.status === 429) {
                throw new HttpException(
                    'Límite de solicitudes alcanzado. Intente más tarde.',
                    HttpStatus.TOO_MANY_REQUESTS,
                );
            }

            if (error.status && error.status >= 500) {
                throw new HttpException(
                    'El servicio de IA no está disponible. Intente más tarde.',
                    HttpStatus.SERVICE_UNAVAILABLE,
                );
            }
        }

        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        
        this.logger.error({
            message: 'Error inesperado al generar CV con IA',
            error: errorMessage,
            stack: error instanceof Error ? error.stack : undefined,
        });

        throw new HttpException(
            'Ocurrió un error al generar el CV. Por favor, intente de nuevo.',
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }

    private buildPrompt(userData: UserData, jobOffer: JobOfferData): string {
        const formatDate = (date: Date | string | undefined): string => {
            if (!date) return '';
            return date instanceof Date ? date.toISOString().split('T')[0] : String(date);
        };

        return `
Eres un experto en recursos humanos y optimización de CVs para pasar filtros ATS (Applicant Tracking Systems).

Mi objetivo es crear un CV optimizado para la siguiente oferta de trabajo:

**PUESTO:** ${jobOffer.target_role}
**EMPRESA:** ${jobOffer.target_company}
**DESCRIPCIÓN DEL PUESTO:**
${jobOffer.job_description}

**MIS DATOS PERSONALES:**
- Nombre: ${userData.name}
- Título/Headline: ${userData.profile?.headline || ''}
- Sobre mí: ${userData.profile?.about || ''}
- Teléfono: ${userData.profile?.phone || ''}
- Ubicación: ${userData.profile?.location || ''}
- LinkedIn: ${userData.profile?.linkedin_url || ''}
- GitHub: ${userData.profile?.github_url || ''}
- Portfolio: ${userData.profile?.portfolio_url || ''}

**MIS SKILLS:**
${userData.skills?.map(s => `- ${s.name} (${s.level || 'N/A'}, ${s.years_experience || 0} años, ${s.category || 'general'})`).join('\n') || 'Sin skills registrados'}

**MIS EXPERIENCIAS LABORALES:**
${userData.experiences?.map(e => `
- Empresa: ${e.company}
  Rol: ${e.role}
  Período: ${formatDate(e.start_date)} - ${e.is_current ? 'Actual' : formatDate(e.end_date)}
  Descripción: ${e.description || ''}
`).join('\n') || 'Sin experiencias registradas'}

**MI EDUCACIÓN:**
${userData.education?.map(e => `
- Instituto: ${e.institution}
  Título: ${e.degree}
  Campo de estudio: ${e.field_of_study || ''}
  Período: ${formatDate(e.start_date)} - ${formatDate(e.end_date)}
`).join('\n') || 'Sin educación registrada'}

**MIS PROYECTOS:**
${userData.projects?.map(p => `
- Título: ${p.title}
  Descripción: ${p.description || ''}
  URL: ${p.project_url || ''}
  GitHub: ${p.github_url || ''}
`).join('\n') || 'Sin proyectos registrados'}

**INSTRUCCIONES:**
1. Analiza la descripción del puesto e identifica las keywords y skills más importantes
2. Reescribe mi resumen/perfil para destacar logros relevantes para este puesto
3. Adapta las descripciones de experiencia para usar palabras clave de la oferta
4. Selecciona y prioriza los skills más relevantes para el puesto
5. Crea contenido optimizado para ATS que incluya:
   - Palabras clave de la oferta
   - Verbos de acción
   - Métricas y logros cuantificables
   - Formato compatible con ATS

**FORMATO DE RESPUESTA (JSON):**
Responde ÚNICAMENTE con un JSON válido (sin texto adicional) con esta estructura exacta:

{
  "summary": "Resumen profesional de 4-5 líneas adaptado al puesto",
  "keywords": ["palabra1", "palabra2", ...],
  "skills": ["skill1", "skill2", ...],
  "experience_highlights": [
    {
      "company": "Nombre empresa",
      "role": "Rol adaptado",
      "period": "Ene 2020 - Actual",
      "highlights": ["Logro 1 con métricas", "Logro 2"]
    }
  ],
  "education_highlights": [
    {
      "institution": "Nombre institución",
      "degree": "Título",
      "field_of_study": "Campo de estudio",
      "period": "2016 - 2020"
    }
  ],
  "ats_optimized_content": {
    "formatted_experience": "Texto formateado para ATS",
    "formatted_education": "Texto formateado para ATS",
    "key_achievements": ["Logro 1", "Logro 2"],
    "ats_score_estimate": 85
  }
}

Responde solo con JSON, sin texto adicional.
`;
    }
}
