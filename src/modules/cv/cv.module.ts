import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { cvProviders } from './providers/cv.providers';

@Module({
    providers: [
        ...cvProviders,
        CvService,
    ],
    exports: [CvService]
})
export class CvModule { }