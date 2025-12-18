// Central export file for all specialty content
export { ICU_NURSE_CONTENT } from './icu-content';
export { ER_NURSE_CONTENT } from './emergency-room-content';
export { PEDIATRIC_NURSE_CONTENT } from './pediatric-content';
export { ONCOLOGY_NURSE_CONTENT, NEONATAL_NURSE_CONTENT, LABOR_DELIVERY_NURSE_CONTENT } from './oncology-neonatal-labor-content';
export { OR_NURSE_CONTENT, CARDIAC_NURSE_CONTENT, AESTHETIC_NURSE_CONTENT, PSYCHIATRIC_NURSE_CONTENT } from './or-cardiac-aesthetic-psych-content';

// Specialty content map for easy lookup
export const SPECIALTY_CONTENT_MAP: Record<string, string> = {
    'icu': ICU_NURSE_CONTENT,
    'emergency-room': ER_NURSE_CONTENT,
    'pediatric': PEDIATRIC_NURSE_CONTENT,
    'oncology': ONCOLOGY_NURSE_CONTENT,
    'neonatal': NEONATAL_NURSE_CONTENT,
    'labor-delivery': LABOR_DELIVERY_NURSE_CONTENT,
    'operating-room': OR_NURSE_CONTENT,
    'cardiac': CARDIAC_NURSE_CONTENT,
    'aesthetic': AESTHETIC_NURSE_CONTENT,
    'psychiatric': PSYCHIATRIC_NURSE_CONTENT,
};

import { ICU_NURSE_CONTENT } from './icu-content';
import { ER_NURSE_CONTENT } from './emergency-room-content';
import { PEDIATRIC_NURSE_CONTENT } from './pediatric-content';
import { ONCOLOGY_NURSE_CONTENT, NEONATAL_NURSE_CONTENT, LABOR_DELIVERY_NURSE_CONTENT } from './oncology-neonatal-labor-content';
import { OR_NURSE_CONTENT, CARDIAC_NURSE_CONTENT, AESTHETIC_NURSE_CONTENT, PSYCHIATRIC_NURSE_CONTENT } from './or-cardiac-aesthetic-psych-content';
