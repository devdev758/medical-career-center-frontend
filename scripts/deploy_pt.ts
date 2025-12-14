import { prisma } from '../src/lib/prisma';
import * as fs from 'fs';

async function deployPT() {
  console.log('📦 Deploying Physical Therapists content...\n');

  const careerGuide = fs.readFileSync('/Users/shirish/.gemini/antigravity/brain/2d2882ec-cb33-4041-8a9e-b6a0bc418eb1/pt_career_guide.md', 'utf-8');
  const interview = fs.readFileSync('/Users/shirish/.gemini/antigravity/brain/2d2882ec-cb33-4041-8a9e-b6a0bc418eb1/pt_interview.md', 'utf-8');
  const certification = fs.readFileSync('/Users/shirish/.gemini/antigravity/brain/2d2882ec-cb33-4041-8a9e-b6a0bc418eb1/pt_certification.md', 'utf-8');
  
  // Extract individual spokes from combined file
  const combined = fs.readFileSync('/Users/shirish/.gemini/antigravity/brain/2d2882ec-cb33-4041-8a9e-b6a0bc418eb1/pt_remaining_spokes.md', 'utf-8');
  
  // Split by spoke markers
  const skills = combined.split('## SPOKE 4: SKILLS')[1].split('## SPOKE 5:')[0].trim();
  const specializations = combined.split('## SPOKE 5: SPECIALIZATIONS')[1].split('## SPOKE 6:')[0].trim();
  const careerPath = combined.split('## SPOKE 6: CAREER PATH')[1].split('## SPOKE 7:')[0].trim();
  const workLife = combined.split('## SPOKE 7: WORK-LIFE BALANCE')[1].split('## SPOKE 8:')[0].trim();
  const resume = combined.split('## SPOKE 8: RESUME')[1].split('END OF PHYSICAL THERAPIST')[0].trim();

  await prisma.careerGuide.update({
    where: { professionSlug: 'physical-therapists' },
    data: {
      fullContent: careerGuide,
      interviewContent: interview,
      certificationContent: certification,
      skillsContent: skills,
      specializationsContent: specializations,
      careerPathContent: careerPath,
      workLifeBalanceContent: workLife,
      resumeContent: resume,
      updatedAt: new Date()
    }
  });

  console.log('✅ Physical Therapists content deployed!\n');
  console.log('📍 Review at:');
  console.log('   Career Guide: https://beta.medicalcareercenter.org/how-to-become-physical-therapists');
  console.log('   Interview: https://beta.medicalcareercenter.org/physical-therapists-interview-questions');
  console.log('   Certification: https://beta.medicalcareercenter.org/physical-therapists-certification');
  console.log('   Skills: https://beta.medicalcareercenter.org/physical-therapists-skills');
  console.log('   Specializations: https://beta.medicalcareercenter.org/physical-therapists-specializations');
  console.log('   Career Path: https://beta.medicalcareercenter.org/physical-therapists-career-path');
  console.log('   Work-Life: https://beta.medicalcareercenter.org/physical-therapists-work-life-balance');
  console.log('   Resume: https://beta.medicalcareercenter.org/physical-therapists-resume');

  await prisma.$disconnect();
}

deployPT().catch(console.error);
