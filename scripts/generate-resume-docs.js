const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, UnderlineType } = require('docx');
const fs = require('fs');
const path = require('path');

// Helper to create section header
function createSectionHeader(text) {
    return new Paragraph({
        text: text,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
    });
}

// Helper to create subsection header
function createSubsectionHeader(text) {
    return new Paragraph({
        children: [
            new TextRun({
                text: text,
                bold: true,
                size: 24,
            }),
        ],
        spacing: { before: 160, after: 80 },
    });
}

// Helper to create bullet point
function createBullet(text) {
    return new Paragraph({
        text: text,
        bullet: { level: 0 },
        spacing: { after: 60 },
    });
}

// Helper to create regular paragraph
function createParagraph(text, options = {}) {
    return new Paragraph({
        children: [
            new TextRun({
                text: text,
                ...options,
            }),
        ],
        spacing: { after: 80 },
    });
}

// Resume 1: New Graduate RN
function createNewGradResume() {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                // Header - Name and Credentials
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "EMILY RODRIGUEZ, RN, BSN",
                            bold: true,
                            size: 32,
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 120 },
                }),
                new Paragraph({
                    text: "Dallas, TX | (214) 555-0123 | emily.rodriguez@email.com",
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 120 },
                }),
                new Paragraph({
                    text: "LinkedIn: linkedin.com/in/emilyrodriguezrn",
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 240 },
                }),

                // Professional Objective
                createSectionHeader("PROFESSIONAL OBJECTIVE"),
                createParagraph("Compassionate and detail-oriented new graduate nurse with BSN from University of Texas Dallas and 600+ clinical hours across medical-surgical, ICU, and pediatric rotations. BLS and ACLS certified. Eager to apply evidence-based nursing practices and patient-centered care in a dynamic acute care hospital environment. Seeking to contribute to exceptional patient outcomes as part of the nursing team at Methodist Dallas Medical Center."),

                // Licenses & Certifications
                createSectionHeader("LICENSES & CERTIFICATIONS"),
                createBullet("Registered Nurse (RN), Texas Board of Nursing, License #987654, Active"),
                createBullet("Basic Life Support (BLS), American Heart Association, Exp. 08/2026"),
                createBullet("Advanced Cardiovascular Life Support (ACLS), AHA, Exp. 08/2026"),
                createBullet("Pediatric Advanced Life Support (PALS), AHA, Exp. 08/2026"),

                // Education
                createSectionHeader("EDUCATION"),
                createSubsectionHeader("Bachelor of Science in Nursing (BSN)"),
                createParagraph("University of Texas at Dallas, Richardson, TX"),
                createParagraph("Graduated: May 2025 | GPA: 3.85 | Summa Cum Laude"),
                createBullet("Dean's List: All Semesters (2021-2025)"),
                createBullet("Recipient of UT Dallas Nursing Excellence Scholarship"),
                createBullet("President, Student Nurses Association (2024-2025)"),

                // Clinical Experience
                createSectionHeader("CLINICAL EXPERIENCE"),
                createSubsectionHeader("Senior Nursing Practicum"),
                createParagraph("Methodist Dallas Medical Center, Dallas, TX | Jan 2025 – May 2025", { italics: true }),
                createBullet("Provided comprehensive nursing care for 6-8 medical-surgical patients per 12-hour shift under RN preceptor supervision"),
                createBullet("Administered medications via multiple routes (PO, IV, IM, SubQ) with 100% accuracy across 300+ medication administrations"),
                createBullet("Performed wound assessments and dressing changes using sterile technique for post-operative and diabetic ulcer patients"),
                createBullet("Collaborated with interdisciplinary team of physicians, physical therapists, and social workers to coordinate patient care"),
                createBullet("Documented patient assessments, interventions, and outcomes in Epic electronic health record system"),

                createSubsectionHeader("ICU Clinical Rotation"),
                createParagraph("Parkland Hospital, Dallas, TX | Sep 2024 – Dec 2024", { italics: true }),
                createBullet("Cared for critically ill patients in 18-bed medical ICU under direct RN supervision"),
                createBullet("Monitored hemodynamic parameters, ventilator settings, and vasoactive medication drips"),
                createBullet("Assisted with central line dressing changes, arterial blood gas draws, and Foley catheter insertions"),
                createBullet("Participated in rapid response team activations and code blue events"),
                createBullet("Gained exposure to CRRT, ECMO, and invasive monitoring technologies"),

                createSubsectionHeader("Pediatric Medical-Surgical Rotation"),
                createParagraph("Children's Medical Center, Dallas, TX | Jun 2024 – Aug 2024", { italics: true }),
                createBullet("Delivered age-appropriate nursing care for pediatric patients ages 6 months to 17 years"),
                createBullet("Administered medications and performed IV starts for pediatric patients using distraction techniques"),
                createBullet("Educated parents on post-discharge care, medication administration, and warning signs"),
                createBullet("Maintained infection control protocols in immunocompromised patient care"),

                // Nursing Student Work Experience
                createSectionHeader("NURSING STUDENT WORK EXPERIENCE"),
                createSubsectionHeader("Patient Care Technician (Per Diem)"),
                createParagraph("Baylor Scott & White, Plano, TX | Jun 2023 – Present", { italics: true }),
                createBullet("Assist nursing staff with activities of daily living for 8-12 patients on medical-surgical unit"),
                createBullet("Monitor and document vital signs, intake/output, and blood glucose levels"),
                createBullet("Transport patients, collect specimens, and maintain clean patient environment"),
                createBullet("Recognized by unit manager for exceptional teamwork during high-census periods"),

                // Skills
                createSectionHeader("SKILLS"),
                createParagraph("Clinical: IV Therapy & Venipuncture | Wound Care | Foley Catheter Insertion | NG Tube Placement | Medication Administration | Vital Signs Monitoring | Blood Glucose Testing | Patient Education", { bold: true }),
                createParagraph("Technical: Epic EMR | Cerner | IV Pumps | Telemetry Monitoring | Glucometers", { bold: true }),
                createParagraph("Soft Skills: Critical Thinking | Time Management | Patient Advocacy | Effective Communication | Cultural Competence | Team Collaboration", { bold: true }),
            ],
        }],
    });

    return doc;
}

// Resume 2: Experienced Med-Surg RN
function createMedSurgResume() {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                // Header
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "MICHAEL CHEN, RN, BSN, MEDSURG-BC",
                            bold: true,
                            size: 32,
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 120 },
                }),
                new Paragraph({
                    text: "Houston, TX | (832) 555-7890 | michael.chen.rn@email.com",
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 120 },
                }),
                new Paragraph({
                    text: "LinkedIn: linkedin.com/in/michaelchenrn",
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 240 },
                }),

                // Professional Summary
                createSectionHeader("PROFESSIONAL SUMMARY"),
                createParagraph("Dedicated Medical-Surgical Registered Nurse with 4+ years of experience providing high-quality patient care in fast-paced hospital environments. Medical-Surgical Board Certified (MEDSURG-BC) with proven track record of improving patient satisfaction scores, reducing falls, and mentoring new staff. Expertise in complex medication management, post-operative care, and chronic disease management. Seeking to leverage clinical excellence and leadership skills as a Senior Staff Nurse at Memorial Hermann."),

                // Licenses & Certifications
                createSectionHeader("LICENSES & CERTIFICATIONS"),
                createBullet("Registered Nurse (RN), Texas Board of Nursing, License #543210, Active"),
                createBullet("Medical-Surgical Nursing Certification (MEDSURG-BC), AMSN, Exp. 03/2027"),
                createBullet("Basic Life Support (BLS), American Heart Association, Exp. 11/2026"),
                createBullet("Advanced Cardiovascular Life Support (ACLS), AHA, Exp. 11/2026"),

                // Professional Experience
                createSectionHeader("PROFESSIONAL EXPERIENCE"),
                createSubsectionHeader("Staff Registered Nurse"),
                createParagraph("Houston Methodist Hospital, Houston, TX | March 2021 – Present", { italics: true }),
                createParagraph("36-bed Medical-Surgical Unit | Typical patient ratio 1:5-6", { italics: true, size: 20 }),
                createBullet("Provide comprehensive nursing care for medical-surgical patients with diverse conditions including diabetes, COPD, post-operative recovery, sepsis, and heart failure"),
                createBullet("Manage complex medication regimens for 5-6 patients per shift, including IV antibiotics, insulin drips, and pain management protocols"),
                createBullet("Improved unit patient satisfaction (HCAHPS) scores from 72% to 88% through enhanced communication and hourly rounding implementation"),
                createBullet("Reduced patient falls by 35% by initiating bedside mobility assessments and high-risk patient identification protocol"),
                createBullet("Serve as charge nurse for evening shift 2-3 times weekly, coordinating staff assignments and managing unit operations for 36-bed unit"),
                createBullet("Precept an average of 3 new graduate nurses annually, with 100% retention rate among preceptees"),
                createBullet("Led unit-based council initiative to reduce CAUTI rates by 40% through standardized Foley care bundle"),
                createBullet("Collaborate daily with physicians, case managers, physical therapists, and pharmacists to optimize patient outcomes"),
                createBullet('Earned "Nurse of the Quarter" recognition in Q2 2024 for exceptional patient care during high-census period'),

                createSubsectionHeader("Staff Registered Nurse"),
                createParagraph("CHI St. Luke's Health, Houston, TX | June 2020 – March 2021", { italics: true }),
                createParagraph("28-bed Telemetry/Step-Down Unit", { italics: true, size: 20 }),
                createBullet("Delivered care for step-down cardiac and pulmonary patients requiring continuous telemetry monitoring"),
                createBullet("Interpreted cardiac rhythms and responded to telemetry alarms, identifying arrhythmias requiring intervention"),
                createBullet("Administered medications via IV, including vasoactive drips for hemodynamically unstable patients"),
                createBullet("Educated patients and families on disease management, medication compliance, and lifestyle modifications"),
                createBullet("Participated in rapid response team activations, demonstrating critical thinking under pressure"),

                // Education
                createSectionHeader("EDUCATION"),
                createSubsectionHeader("Bachelor of Science in Nursing (BSN)"),
                createParagraph("University of Houston, Houston, TX | Graduated: May 2020"),

                // Skills
                createSectionHeader("SKILLS"),
                createParagraph("Clinical Expertise: Post-Operative Care | Wound Care & VAC Therapy | IV Therapy | Medication Administration | Telemetry Monitoring | Diabetes Management | Pain Management | Patient & Family Education", { bold: true }),
                createParagraph("Technical: Epic EMR (Proficient) | Alaris IV Pumps | Telemetry Systems | Feeding Pumps", { bold: true }),
                createParagraph("Leadership: Charge Nurse Experience | Preceptor for New Graduates | Unit-Based Council Member", { bold: true }),
                createParagraph("Soft Skills: Critical Thinking | Time Management | Crisis Management | Patient Advocacy | Multidisciplinary Collaboration", { bold: true }),

                // Professional Affiliations
                createSectionHeader("PROFESSIONAL AFFILIATIONS"),
                createBullet("Academy of Medical-Surgical Nurses (AMSN), Active Member"),
                createBullet("Texas Nurses Association, Member since 2020"),
            ],
        }],
    });

    return doc;
}

// Resume 3: ICU/Critical Care Specialist
function createICUResume() {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    children: [new TextRun({ text: "ALEXANDRA WILLIAMS, RN, BSN, CCRN", bold: true, size: 32 })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 120 },
                }),
                new Paragraph({
                    text: "Austin, TX | (512) 555-3456 | alex.williams.rn@gmail.com",
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 240 },
                }),

                createSectionHeader("PROFESSIONAL SUMMARY"),
                createParagraph("Highly skilled Critical Care Registered Nurse with 8 years of progressive ICU experience in Level I Trauma Centers. CCRN-certified specialist in ventilator management, hemodynamic monitoring, CRRT, and ECMO support. Proven leader with extensive experience as charge nurse, preceptor, and unit-based council chair. Track record of improving patient outcomes, reducing ventilator-associated pneumonia, and mentoring nursing staff in high-acuity environments. Seeking Assistant Nurse Manager position to leverage clinical expertise and leadership abilities."),

                createSectionHeader("LICENSES & CERTIFICATIONS"),
                createBullet("Registered Nurse (RN), Texas Board of Nursing, License #234567, Active"),
                createBullet("Critical Care Registered Nurse (CCRN), AACN, Exp. 06/2027"),
                createBullet("Advanced Cardiovascular Life Support (ACLS), AHA, Exp. 10/2026"),
                createBullet("Trauma Nursing Core Course (TNCC), ENA, Completed 2023"),

                createSectionHeader("PROFESSIONAL EXPERIENCE"),
                createSubsectionHeader("Senior Staff RN / Charge Nurse"),
                createParagraph("Dell Seton Medical Center at UT, Austin, TX | Jan 2020 – Present", { italics: true }),
                createBullet("Serve as charge nurse 50% of shifts, managing staffing, patient assignments, and resource allocation for 24-bed MICU"),
                createBullet("Precept 12+ new graduate nurses and experienced RNs transitioning to ICU, with 95% retention rate"),
                createBullet("Manage advanced ventilator modes (APRV, PRVC, HFOV) for ARDS and respiratory failure patients"),
                createBullet("Titrate multiple vasoactive medications based on hemodynamic goals"),
                createBullet("Operate continuous renal replacement therapy (CRRT) for patients with acute kidney injury"),
                createBullet("Reduced ventilator-associated pneumonia rate from 3.2 to 0.8 per 1000 ventilator days"),

                createSectionHeader("EDUCATION"),
                createSubsectionHeader("Master of Science in Nursing (MSN) – In Progress"),
                createParagraph("University of Texas at Arlington (Expected Graduation: May 2027)"),
                createSubsectionHeader("Bachelor of Science in Nursing (BSN)"),
                createParagraph("Texas State University, San Marcos, TX | Graduated: May 2016"),

                createSectionHeader("SKILLS"),
                createParagraph("Advanced Critical Care: Ventilator Management | Hemodynamic Monitoring | CRRT | ECMO | Vasoactive Medication Titration", { bold: true }),
            ],
        }],
    });
    return doc;
}

// Resume 4: Charge Nurse/Leadership
function createChargeNurseResume() {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    children: [new TextRun({ text: "JENNIFER THOMPSON, RN, MSN", bold: true, size: 32 })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 120 },
                }),
                new Paragraph({
                    text: "San Antonio, TX | (210) 555-9012 | jennifer.thompson.rn@email.com",
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 240 },
                }),

                createSectionHeader("PROFESSIONAL SUMMARY"),
                createParagraph("Results-driven Nursing Leader with 12+ years of progressive clinical and leadership experience in acute care settings. MSN-prepared with expertise in staff development, quality improvement, budget management, and regulatory compliance. Proven success improving patient outcomes, reducing turnover, enhancing staff engagement, and leading high-performing nursing teams. Seeking Nurse Manager position to utilize clinical expertise and leadership competencies."),

                createSectionHeader("LICENSES & CERTIFICATIONS"),
                createBullet("Registered Nurse (RN), Texas Board of Nursing, License #345678, Active"),
                createBullet("Nurse Executive Competency (NE-BC) – In Progress (Exam scheduled April 2026)"),
                createBullet("Basic Life Support (BLS), American Heart Association, Exp. 05/2026"),

                createSectionHeader("EDUCATION"),
                createSubsectionHeader("Master of Science in Nursing (MSN) – Nursing Administration"),
                createParagraph("Texas Tech University Health Sciences Center | Graduated: December 2024 | GPA: 3.9"),
                createSubsectionHeader("Bachelor of Science in Nursing (BSN)"),
                createParagraph("University of Texas Health Science Center San Antonio | Graduated: May 2013"),

                createSectionHeader("PROFESSIONAL EXPERIENCE"),
                createSubsectionHeader("Charge Nurse / Clinical Coordinator"),
                createParagraph("Methodist Hospital, San Antonio, TX | March 2019 – Present", { italics: true }),
                createBullet("Lead daily unit operations as charge nurse 90% of shifts, managing staffing levels for 42-bed unit"),
                createBullet("Improved new hire retention from 75% to 92% through enhanced preceptor training"),
                createBullet("Reduced hospital-acquired pressure injuries by 60% through implementation of Braden Scale assessments"),
                createBullet("Decreased medication errors by 45% by implementing nurse-driven double-check systems"),
                createBullet("Led unit through successful Joint Commission survey with zero findings"),

                createSectionHeader("LEADERSHIP COMPETENCIES"),
                createParagraph("Operational: Budget Management | Staffing & Scheduling | Regulatory Compliance | Process Improvement", { bold: true }),
                createParagraph("People Development: Staff Mentoring | Performance Management | Competency Assessment", { bold: true }),
            ],
        }],
    });
    return doc;
}

// Resume 5: Career Changer
function createCareerChangerResume() {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    children: [new TextRun({ text: "DAVID NGUYEN, RN, BSN", bold: true, size: 32 })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 120 },
                }),
                new Paragraph({
                    text: "Phoenix, AZ | (602) 555-6789 | david.nguyen.rn@email.com",
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 240 },
                }),

                createSectionHeader("PROFESSIONAL SUMMARY"),
                createParagraph("Versatile Registered Nurse with 5 years of comprehensive nursing experience in skilled nursing and long-term acute care settings, now seeking to transition clinical expertise to acute hospital medical-surgical environment. Proven ability to manage complex patient conditions, collaborate with interdisciplinary teams, and provide exceptional patient-centered care. Strong background in wound care, medication management, and chronic disease coordination."),

                createSectionHeader("LICENSES & CERTIFICATIONS"),
                createBullet("Registered Nurse (RN), Arizona State Board of Nursing, License #456789, Active"),
                createBullet("Advanced Cardiovascular Life Support (ACLS), AHA, Exp. 12/2026 (Recently obtained)"),
                createBullet("Wound Care Certification (WCC), NAWCO, Exp. 08/2026"),

                createSectionHeader("PROFESSIONAL EXPERIENCE"),
                createSubsectionHeader("Registered Nurse"),
                createParagraph("Select Specialty Hospital, Phoenix, AZ | April 2021 – Present", { italics: true }),
                createBullet("Care for medically complex patients requiring extended acute-level care, including ventilator weaning"),
                createBullet("Manage high patient acuity similar to acute hospital settings: ventilator-dependent patients, complex wounds, IV antibiotics"),
                createBullet("Administer IV medications and manage central lines with zero line infections"),
                createBullet("Successfully transitioned 85% of ventilator-dependent patients to room air or minimal oxygen support"),
                createBullet("Perform complex wound assessments and treatments including wound VACs"),

                createSectionHeader("TRANSFERABLE SKILLS FOR ACUTE CARE"),
                createParagraph("Complex Medication Management: Experience with IV antibiotics, insulin drips, TPN, anticoagulation monitoring", { bold: true }),
                createParagraph("Ventilator Knowledge: Daily management of ventilator settings and weaning protocols", { bold: true }),
                createParagraph("Rapid Assessment: Quick recognition of patient deterioration and appropriate escalation", { bold: true }),

                createSectionHeader("EDUCATION"),
                createSubsectionHeader("Bachelor of Science in Nursing (BSN)"),
                createParagraph("Grand Canyon University, Phoenix, AZ | Graduated: May 2019 | GPA: 3.6"),

                createSectionHeader("PROFESSIONAL DEVELOPMENT"),
                createBullet("ACLS Certification – Completed December 2025 (New)"),
                createBullet("Epic EMR Training Course – Completed September 2025"),
                createBullet("Medical-Surgical Nursing Review Course – Completed November 2025"),
            ],
        }],
    });
    return doc;
}

// Generate all resume files

async function generateAllResumes() {
    const outputDir = path.join(__dirname, '..', 'public', 'downloads', 'resume-examples');

    // Ensure directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate Resume 1: New Grad
    console.log('Generating new-grad-rn-resume.docx...');
    const newGradDoc = createNewGradResume();
    const newGradBuffer = await Packer.toBuffer(newGradDoc);
    fs.writeFileSync(path.join(outputDir, 'new-grad-rn-resume.docx'), newGradBuffer);
    console.log('✓ Created new-grad-rn-resume.docx');

    // Generate Resume 2: Experienced Med-Surg
    console.log('Generating experienced-medsurg-rn-resume.docx...');
    const medSurgDoc = createMedSurgResume();
    const medSurgBuffer = await Packer.toBuffer(medSurgDoc);
    fs.writeFileSync(path.join(outputDir, 'experienced-medsurg-rn-resume.docx'), medSurgBuffer);
    console.log('✓ Created experienced-medsurg-rn-resume.docx');

    // Generate Resume 3: ICU/Critical Care
    console.log('Generating icu-critical-care-rn-resume.docx...');
    const icuDoc = createICUResume();
    const icuBuffer = await Packer.toBuffer(icuDoc);
    fs.writeFileSync(path.join(outputDir, 'icu-critical-care-rn-resume.docx'), icuBuffer);
    console.log('✓ Created icu-critical-care-rn-resume.docx');

    // Generate Resume 4: Charge Nurse/Leadership
    console.log('Generating charge-nurse-leadership-resume.docx...');
    const chargeDoc = createChargeNurseResume();
    const chargeBuffer = await Packer.toBuffer(chargeDoc);
    fs.writeFileSync(path.join(outputDir, 'charge-nurse-leadership-resume.docx'), chargeBuffer);
    console.log('✓ Created charge-nurse-leadership-resume.docx');

    // Generate Resume 5: Career Changer
    console.log('Generating career-changer-transition-resume.docx...');
    const careerDoc = createCareerChangerResume();
    const careerBuffer = await Packer.toBuffer(careerDoc);
    fs.writeFileSync(path.join(outputDir, 'career-changer-transition-resume.docx'), careerBuffer);
    console.log('✓ Created career-changer-transition-resume.docx');

    console.log('\n✅ Successfully generated all 5 resume Word documents!');
}

// Run the generator
generateAllResumes().catch(console.error);
