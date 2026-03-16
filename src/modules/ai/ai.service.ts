import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
    private readonly deepseekApiKey: string;
    private readonly deepseekBaseUrl = 'https://api.deepseek.com/v1';

    constructor(private configService: ConfigService) {
        this.deepseekApiKey = this.configService.get<string>('DEEPSEEK_API_KEY') || '';
    }

    async generateCvWithDeepSeek(userData: UserData, jobOffer: JobOfferData): Promise<GeneratedCvData> {
        this.logger.debug(`Generando CV para ${jobOffer.target_role} en ${jobOffer.target_company}`);

        const prompt = this.buildPrompt(userData, jobOffer);

        try {
            const response = await fetch(`${this.deepseekBaseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.deepseekApiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: 'Eres un experto en optimización de CVs para pasar filtros ATS y atraer reclutadores. Devuelve siempre un JSON válido con la estructura especificada.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 4000,
                }),
            });

            const data = await response.json() as { choices?: Array<{ message?: { content: string } }> };
            const content = data.choices?.[0]?.message?.content;
            this.logger.debug(`Respuesta de DeepSeek recibida`);

            return this.parseAiResponse(content);
        } catch (error) {
            this.logger.error(`Error al llamar a DeepSeek: ${error.message}`);
            throw new Error(`Error al generar CV con IA: ${error.message}`);
        }
    }

    private buildPrompt(userData: UserData, jobOffer: JobOfferData): string {
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
  Período: ${e.start_date} - ${e.is_current ? 'Actual' : e.end_date}
  Descripción: ${e.description || ''}
`).join('\n') || 'Sin experiencias registradas'}

**MI EDUCACIÓN:**
${userData.education?.map(e => `
- Instituto: ${e.institution}
  Título: ${e.degree}
  Campo de estudio: ${e.field_of_study || ''}
  Período: ${e.start_date || ''} - ${e.end_date || ''}
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

    private parseAiResponse(content: string | undefined): GeneratedCvData {
        if (!content) {
            throw new Error('La respuesta de la IA está vacía');
        }
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch || !jsonMatch[0]) {
                throw new Error('No se encontró JSON en la respuesta');
            }
            return JSON.parse(jsonMatch[0]);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            this.logger.error(`Error al parsear respuesta de IA: ${errorMessage}`);
            throw new Error('La respuesta de la IA no es un JSON válido');
        }
    }
}
