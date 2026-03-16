import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as Handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import { Cv } from './entity/cv.entity';
import { CvVersion } from './entity/cv-version.entity';

export interface UserProfile {
    name?: string;
    headline?: string;
    about?: string;
    phone?: string;
    location?: string;
    linkedin_url?: string;
    github_url?: string;
    portfolio_url?: string;
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
export class PdfService {
    private readonly logger = new Logger(PdfService.name);

    constructor(
        @InjectRepository(Cv)
        private cvRepository: Repository<Cv>,
        @InjectRepository(CvVersion)
        private cvVersionRepository: Repository<CvVersion>,
    ) {}

    async generateHarvardPdf(cvId: number, versionId?: number): Promise<Buffer> {
        this.logger.debug(`Generando PDF Harvard para CV ${cvId}`);

        const cv = await this.cvRepository.findOne({
            where: { id: cvId },
            relations: ['user', 'user.profile'],
        });

        if (!cv) {
            throw new NotFoundException('CV no encontrado');
        }

        let version: CvVersion | null;
        if (versionId) {
            version = await this.cvVersionRepository.findOne({
                where: { id: versionId, cv_id: cvId },
            });
        } else {
            version = await this.cvVersionRepository.findOne({
                where: { cv_id: cvId },
                order: { version_number: 'DESC' },
            });
        }

        if (!version) {
            throw new NotFoundException('Versión del CV no encontrada');
        }

        const generatedData = version.content_json as unknown as GeneratedCvData;
        const profile = cv.user?.profile as UserProfile | undefined;

        const html = this.buildHarvardTemplate({
            name: cv.user?.name || '',
            profile: profile,
            cvData: generatedData,
            targetRole: cv.target_role || '',
            targetCompany: cv.target_company || '',
        });

        return this.generatePdfFromHtml(html);
    }

    private buildHarvardTemplate(data: {
        name: string;
        profile?: UserProfile;
        cvData: GeneratedCvData;
        targetRole: string;
        targetCompany: string;
    }): string {
        const template = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV - {{name}}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #333;
            padding: 40px 50px;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            border-bottom: 2px solid #2c3e50;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        
        .name {
            font-size: 24pt;
            font-weight: bold;
            color: #2c3e50;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 5px;
        }
        
        .headline {
            font-size: 12pt;
            color: #34495e;
            font-style: italic;
            margin-bottom: 10px;
        }
        
        .contact-info {
            font-size: 10pt;
            color: #555;
        }
        
        .contact-info span {
            margin: 0 5px;
        }
        
        .contact-info span:not(:last-child):after {
            content: " |";
        }
        
        .section {
            margin-bottom: 20px;
        }
        
        .section-title {
            font-size: 12pt;
            font-weight: bold;
            color: #2c3e50;
            text-transform: uppercase;
            border-bottom: 1px solid #bdc3c7;
            padding-bottom: 5px;
            margin-bottom: 12px;
            letter-spacing: 1px;
        }
        
        .summary {
            font-size: 10pt;
            text-align: justify;
            color: #444;
        }
        
        .experience-item, .education-item {
            margin-bottom: 15px;
        }
        
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 3px;
        }
        
        .item-title {
            font-weight: bold;
            font-size: 11pt;
            color: #2c3e50;
        }
        
        .item-subtitle {
            font-style: italic;
            color: #555;
            font-size: 10pt;
        }
        
        .item-period {
            font-size: 10pt;
            color: #666;
        }
        
        .item-description {
            font-size: 10pt;
            color: #444;
            margin-top: 5px;
            text-align: justify;
        }
        
        .item-description ul {
            margin-left: 20px;
            margin-top: 3px;
        }
        
        .item-description li {
            margin-bottom: 2px;
        }
        
        .skills-list {
            font-size: 10pt;
            color: #444;
            line-height: 1.6;
        }
        
        .skills-category {
            font-weight: bold;
            color: #2c3e50;
        }
        
        .keywords {
            font-size: 9pt;
            color: #7f8c8d;
            margin-top: 10px;
        }
        
        .keyword-label {
            font-weight: bold;
        }
        
        .ats-score {
            text-align: right;
            font-size: 9pt;
            color: #27ae60;
            font-weight: bold;
            margin-top: 30px;
            padding-top: 10px;
            border-top: 1px solid #ecf0f1;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">{{name}}</div>
        {{#if profile.headline}}
        <div class="headline">{{profile.headline}}</div>
        {{/if}}
        <div class="contact-info">
            {{#if profile.phone}}<span>{{profile.phone}}</span>{{/if}}
            {{#if profile.location}}<span>{{profile.location}}</span>{{/if}}
            {{#if profile.linkedin_url}}<span>LinkedIn: {{profile.linkedin_url}}</span>{{/if}}
            {{#if profile.github_url}}<span>GitHub: {{profile.github_url}}</span>{{/if}}
        </div>
    </div>
    
    {{#if cvData.summary}}
    <div class="section">
        <div class="section-title">Perfil Profesional</div>
        <div class="summary">{{cvData.summary}}</div>
    </div>
    {{/if}}
    
    {{#if cvData.experience_highlights}}
    <div class="section">
        <div class="section-title">Experiencia Profesional</div>
        {{#each cvData.experience_highlights}}
        <div class="experience-item">
            <div class="item-header">
                <div>
                    <span class="item-title">{{role}}</span>
                    <span class="item-subtitle"> - {{company}}</span>
                </div>
                <span class="item-period">{{period}}</span>
            </div>
            {{#if highlights}}
            <div class="item-description">
                <ul>
                    {{#each highlights}}
                    <li>{{this}}</li>
                    {{/each}}
                </ul>
            </div>
            {{/if}}
        </div>
        {{/each}}
    </div>
    {{/if}}
    
    {{#if cvData.education_highlights}}
    <div class="section">
        <div class="section-title">Formación Académica</div>
        {{#each cvData.education_highlights}}
        <div class="education-item">
            <div class="item-header">
                <div>
                    <span class="item-title">{{degree}}</span>
                    {{#if field_of_study}}<span class="item-subtitle"> - {{field_of_study}}</span>{{/if}}
                </div>
                <span class="item-period">{{period}}</span>
            </div>
            <div class="item-description">{{institution}}</div>
        </div>
        {{/each}}
    </div>
    {{/if}}
    
    {{#if cvData.skills}}
    <div class="section">
        <div class="section-title">Habilidades</div>
        <div class="skills-list">
            {{#each cvData.skills}}
            <span>{{this}}{{#unless @last}}, {{/unless}}</span>
            {{/each}}
        </div>
    </div>
    {{/if}}
    
    {{#if cvData.keywords}}
    <div class="keywords">
        <span class="keyword-label">Palabras clave:</span> {{#each cvData.keywords}}<span>{{this}}</span>{{#unless @last}}, {{/unless}}{{/each}}
    </div>
    {{/if}}
    
    {{#if cvData.ats_optimized_content.ats_score_estimate}}
    <div class="ats-score">
        Puntuación ATS estimada: {{cvData.ats_optimized_content.ats_score_estimate}}/100
    </div>
    {{/if}}
</body>
</html>
`;

        const compiled = Handlebars.compile(template);
        return compiled(data);
    }

    private async generatePdfFromHtml(html: string): Promise<Buffer> {
        this.logger.debug('Iniciando generación de PDF con Puppeteer');

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        try {
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });

            const pdf = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '20px',
                    bottom: '20px',
                    left: '20px',
                    right: '20px',
                },
            });

            return Buffer.from(pdf);
        } finally {
            await browser.close();
        }
    }
}
