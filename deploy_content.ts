import { prisma } from './src/lib/prisma';
import * as fs from 'fs';

async function deployContent() {
  console.log('Starting content deployment...\n');

  // Read the generated content files
  const rnCareerGuide = fs.readFileSync('/Users/shirish/.gemini/antigravity/brain/2d2882ec-cb33-4041-8a9e-b6a0bc418eb1/content_pilot_rn_career_guide.md', 'utf-8');
  const rnInterview = fs.readFileSync('/Users/shirish/.gemini/antigravity/brain/2d2882ec-cb33-4041-8a9e-b6a0bc418eb1/content_pilot_rn_interview.md', 'utf-8');
  const npCareerGuide = fs.readFileSync('/Users/shirish/.gemini/antigravity/brain/2d2882ec-cb33-4041-8a9e-b6a0bc418eb1/content_pilot_np_career_guide.md', 'utf-8');
  const npInterview = fs.readFileSync('/Users/shirish/.gemini/antigravity/brain/2d2882ec-cb33-4041-8a9e-b6a0bc418eb1/content_pilot_np_interview.md', 'utf-8');

  // Update Registered Nurses
  console.log('Updating Registered Nurses...');
  await prisma.careerGuide.update({
    where: { professionSlug: 'registered-nurses' },
    data: {
      fullContent: rnCareerGuide,
      interviewContent: rnInterview,
      updatedAt: new Date()
    }
  });
  console.log('✅ Registered Nurses updated');

  // Update Nurse Practitioners
  console.log('Updating Nurse Practitioners...');
  await prisma.careerGuide.update({
    where: { professionSlug: 'nurse-practitioners' },
    data: {
      fullContent: npCareerGuide,
      interviewContent: npInterview,
      updatedAt: new Date()
    }
  });
  console.log('✅ Nurse Practitioners updated');

  console.log('\n✅ Content deployment complete!');
  console.log('\nReview at:');
  console.log('- https://beta.medicalcareercenter.org/how-to-become-registered-nurses');
  console.log('- https://beta.medicalcareercenter.org/registered-nurses-interview-questions');
  console.log('- https://beta.medicalcareercenter.org/how-to-become-nurse-practitioners');
  console.log('- https://beta.medicalcareercenter.org/nurse-practitioners-interview-questions');

  await prisma.$disconnect();
}

deployContent().catch(console.error);
