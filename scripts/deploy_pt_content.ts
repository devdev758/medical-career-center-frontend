import { prisma } from '../src/lib/prisma';
import * as fs from 'fs';

async function deployPTContent() {
  console.log('Deploying Physical Therapists content...\n');

  const careerGuide = fs.readFileSync('/Users/shirish/.gemini/antigravity/brain/2d2882ec-cb33-4041-8a9e-b6a0bc418eb1/pt_career_guide.md', 'utf-8');
  const interviewPrep = fs.readFileSync('/Users/shirish/.gemini/antigravity/brain/2d2882ec-cb33-4041-8a9e-b6a0bc418eb1/pt_interview.md', 'utf-8');
  const certification = fs.readFileSync('/Users/shirish/.gemini/antigravity/brain/2d2882ec-cb33-4041-8a9e-b6a0bc418eb1/pt_certification.md', 'utf-8');
  const skills = fs.readFileSync('/Users/shirish/.gemini/antigravity/brain/2d2882ec-cb33-4041-8a9e-b6a0bc418eb1/pt_skills.md', 'utf-8');
  const specializations = fs.readFileSync('/Users/shirish/.gemini/antigravity/brain/2d2882ec-cb33-4041-8a9e-b6a0bc418eb1/pt_specializations.md', 'utf-8');
  const careerPath = fs.readFileSync('/Users/shirish/.gemini/antigravity/brain/2d2882ec-cb33-4041-8a9e-b6a0bc418eb1/pt_career_path.md', 'utf-8');
  const workLifeBalance = fs.readFileSync('/Users/shirish/.gemini/antigravity/brain/2d2882ec-cb33-4041-8a9e-b6a0bc418eb1/pt_work_life_balance.md', 'utf-8');
  const resume = fs.readFileSync('/Users/shirish/.gemini/antigravity/brain/2d2882ec-cb33-4041-8a9e-b6a0bc418eb1/pt_resume.md', 'utf-8');

  await prisma.careerGuide.update({
    where: { professionSlug: 'physical-therapists' },
    data: {
      fullContent: careerGuide,
      interviewContent: interviewPrep,
      certificationContent: certification,
      skillsContent: skills,
      specializationsContent: specializations,
      careerPathContent: careerPath,
      workLifeBalanceContent: workLifeBalance,
      resumeContent: resume,
      updatedAt: new Date()
    }
  });

  console.log('✅ Physical Therapists content deployed!');
  console.log('\nReview at:');
  console.log('- https://beta.medicalcareercenter.org/how-to-become-physical-therapists');
  console.log('- https://beta.medicalcareercenter.org/physical-therapists-interview-questions');
  console.log('- https://beta.medicalcareercenter.org/physical-therapists-certification');
  console.log('- https://beta.medicalcareercenter.org/physical-therapists-skills');
  console.log('- https://beta.medicalcareercenter.org/physical-therapists-specializations');
  console.log('- https://beta.medicalcareercenter.org/physical-therapists-career-path');
  console.log('- https://beta.medicalcareercenter.org/physical-therapists-work-life-balance');
  console.log('- https://beta.medicalcareercenter.org/physical-therapists-resume');

  await prisma.$disconnect();
}

deployPTContent().catch(console.error);
