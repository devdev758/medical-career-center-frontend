/**
 * Profession Relationships Mapping
 * Maps each profession to 5-7 closely related healthcare careers
 * Based on career paths, education requirements, and work settings
 */

export const PROFESSION_RELATIONSHIPS: Record<string, string[]> = {
    // Nursing Professions
    'registered-nurses': [
        'nurse-practitioners',
        'licensed-practical-and-licensed-vocational-nurses',
        'nursing-assistants',
        'nurse-anesthetists',
        'nurse-midwives'
    ],
    'nurse-practitioners': [
        'registered-nurses',
        'physician-assistants',
        'nurse-anesthetists',
        'nurse-midwives',
        'clinical-nurse-specialists'
    ],
    'licensed-practical-and-licensed-vocational-nurses': [
        'registered-nurses',
        'nursing-assistants',
        'home-health-and-personal-care-aides',
        'medical-assistants',
        'psychiatric-aides'
    ],
    'nursing-assistants': [
        'licensed-practical-and-licensed-vocational-nurses',
        'home-health-and-personal-care-aides',
        'registered-nurses',
        'medical-assistants',
        'psychiatric-aides'
    ],
    'nurse-anesthetists': [
        'nurse-practitioners',
        'registered-nurses',
        'anesthesiologists',
        'physician-assistants',
        'surgical-technologists'
    ],
    'nurse-midwives': [
        'nurse-practitioners',
        'registered-nurses',
        'obstetricians-and-gynecologists',
        'physician-assistants',
        'medical-assistants'
    ],

    // Dental Professions
    'dentists-general': [
        'orthodontists',
        'oral-and-maxillofacial-surgeons',
        'prosthodontists',
        'dental-hygienists',
        'dental-assistants'
    ],
    'orthodontists': [
        'dentists-general',
        'oral-and-maxillofacial-surgeons',
        'prosthodontists',
        'dental-hygienists',
        'dental-assistants'
    ],
    'oral-and-maxillofacial-surgeons': [
        'dentists-general',
        'orthodontists',
        'surgeons',
        'dental-hygienists',
        'surgical-technologists'
    ],
    'prosthodontists': [
        'dentists-general',
        'orthodontists',
        'dental-hygienists',
        'dental-laboratory-technicians',
        'dental-assistants'
    ],
    'dental-hygienists': [
        'dentists-general',
        'dental-assistants',
        'orthodontists',
        'oral-and-maxillofacial-surgeons',
        'registered-nurses'
    ],
    'dental-assistants': [
        'dental-hygienists',
        'dentists-general',
        'medical-assistants',
        'orthodontists',
        'nursing-assistants'
    ],

    // Physician Professions
    'physicians-and-surgeons': [
        'physician-assistants',
        'nurse-practitioners',
        'surgeons',
        'anesthesiologists',
        'registered-nurses'
    ],
    'physician-assistants': [
        'nurse-practitioners',
        'physicians-and-surgeons',
        'registered-nurses',
        'medical-assistants',
        'clinical-laboratory-technologists-and-technicians'
    ],
    'surgeons': [
        'physicians-and-surgeons',
        'surgical-technologists',
        'anesthesiologists',
        'registered-nurses',
        'physician-assistants'
    ],
    'anesthesiologists': [
        'nurse-anesthetists',
        'physicians-and-surgeons',
        'surgeons',
        'physician-assistants',
        'registered-nurses'
    ],

    // Therapy Professions
    'physical-therapists': [
        'occupational-therapists',
        'physical-therapist-assistants',
        'athletic-trainers',
        'exercise-physiologists',
        'recreational-therapists'
    ],
    'occupational-therapists': [
        'physical-therapists',
        'occupational-therapy-assistants',
        'recreational-therapists',
        'speech-language-pathologists',
        'physical-therapist-assistants'
    ],
    'speech-language-pathologists': [
        'audiologists',
        'occupational-therapists',
        'physical-therapists',
        'recreational-therapists',
        'special-education-teachers'
    ],
    'respiratory-therapists': [
        'registered-nurses',
        'respiratory-therapy-technicians',
        'cardiovascular-technologists-and-technicians',
        'physician-assistants',
        'clinical-laboratory-technologists-and-technicians'
    ],

    // Diagnostic Professions
    'radiologic-technologists-and-technicians': [
        'diagnostic-medical-sonographers',
        'magnetic-resonance-imaging-technologists',
        'nuclear-medicine-technologists',
        'cardiovascular-technologists-and-technicians',
        'radiation-therapists'
    ],
    'diagnostic-medical-sonographers': [
        'radiologic-technologists-and-technicians',
        'cardiovascular-technologists-and-technicians',
        'magnetic-resonance-imaging-technologists',
        'nuclear-medicine-technologists',
        'registered-nurses'
    ],
    'clinical-laboratory-technologists-and-technicians': [
        'medical-and-clinical-laboratory-technicians',
        'phlebotomists',
        'clinical-laboratory-technologists',
        'cardiovascular-technologists-and-technicians',
        'diagnostic-medical-sonographers'
    ],

    // Pharmacy Professions
    'pharmacists': [
        'pharmacy-technicians',
        'pharmaceutical-sales-representatives',
        'physicians-and-surgeons',
        'nurse-practitioners',
        'pharmacy-aides'
    ],
    'pharmacy-technicians': [
        'pharmacists',
        'pharmacy-aides',
        'medical-assistants',
        'nursing-assistants',
        'dental-assistants'
    ],

    // Other Healthcare Professions
    'medical-assistants': [
        'nursing-assistants',
        'licensed-practical-and-licensed-vocational-nurses',
        'dental-assistants',
        'pharmacy-technicians',
        'phlebotomists'
    ],
    'phlebotomists': [
        'medical-assistants',
        'clinical-laboratory-technologists-and-technicians',
        'nursing-assistants',
        'cardiovascular-technologists-and-technicians',
        'medical-and-clinical-laboratory-technicians'
    ],
    'optometrists': [
        'ophthalmologists',
        'opticians-dispensing',
        'ophthalmic-medical-technicians',
        'physicians-and-surgeons',
        'audiologists'
    ],
    'chiropractors': [
        'physical-therapists',
        'massage-therapists',
        'acupuncturists',
        'occupational-therapists',
        'athletic-trainers'
    ],
    'veterinarians': [
        'veterinary-technologists-and-technicians',
        'veterinary-assistants-and-laboratory-animal-caretakers',
        'animal-caretakers',
        'physicians-and-surgeons',
        'biological-scientists'
    ],
    'dietitians-and-nutritionists': [
        'health-education-specialists',
        'exercise-physiologists',
        'registered-nurses',
        'physician-assistants',
        'occupational-therapists'
    ]
};

/**
 * Get related professions for a given profession
 */
export function getRelatedProfessions(professionSlug: string): string[] {
    return PROFESSION_RELATIONSHIPS[professionSlug] || [];
}

/**
 * Format profession slug to title
 */
export function formatProfessionTitle(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
