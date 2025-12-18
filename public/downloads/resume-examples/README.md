# Resume Example Downloads - Setup Instructions

## Directory Structure Created

`/public/downloads/resume-examples/`

This directory will contain 5 downloadable Word document resume examples.

## Required Files

You need to create and upload these 5 professionally formatted Word documents:

### 1. new-grad-rn-resume.docx
**Content**: Emily Rodriguez - New Graduate RN Resume
- Recent BSN graduate format
- Education-first layout
- Clinical rotations section
- Certifications prominent
- **File size target**: ~30-40KB

### 2. experienced-medsurg-rn-resume.docx
**Content**: Michael Chen - Experienced Med-Surg RN Resume
- 4 years experience
- Professional summary approach
- Quantified achievements
- Charge nurse responsibilities
- **File size target**: ~30-40KB

### 3. icu-critical-care-rn-resume.docx
**Content**: Alexandra Williams - ICU/Critical Care Specialist Resume
- 8 years critical care experience
- CCRN certification
- Advanced skills (ECMO, CRRT, ventilators)
- Leadership section
- **File size target**: ~35-45KB

### 4. charge-nurse-leadership-resume.docx
**Content**: Jennifer Thompson - Charge Nurse/Leadership Resume
- 12 years experience, MSN-prepared
- Organized by leadership functions
- Quality metrics and outcomes
- Management competencies
- **File size target**: ~35-45KB

### 5. career-changer-transition-resume.docx
**Content**: David Nguyen - Career Changer Resume
- Transitioning from LTC to acute care
- Transferable skills section
- Proactive preparation activities
- **File size target**: ~30-40KB

## Word Document Requirements

**Security & Best Practices:**
- ✅ Use `.docx` format (NOT `.doc` or `.docm`)
- ✅ NO macros enabled
- ✅ Clean, ATS-friendly formatting
- ✅ Standard fonts (Arial, Calibri, Times New Roman)
- ✅ No embedded images or graphics
- ✅ Simple tables only (if needed)
- ✅ File size under 100KB each

**Formatting Checklist:**
- [ ] Professional, clean layout
- [ ] 1-2 pages as appropriate
- [ ] 0.5"-1" margins
- [ ] 10-12pt font
- [ ] Clear section headers
- [ ] Consistent bullet formatting
- [ ] Contact info at top
- [ ] Certifications section prominent
- [ ] Work experience with bullet points
- [ ] Education section

## How to Create

**Option 1: Manual Creation**
1. Open Microsoft Word or Google Docs
2. Use the content from `/src/lib/resume-examples-content.ts` as reference
3. Format professionally with proper spacing, fonts, and layout
4. Save as `.docx` format
5. Upload to `/public/downloads/resume-examples/`

**Option 2: Use Templates**
1. Start with a professional ATS-friendly template
2. Customize with the example content
3. Save with the filenames listed above

## Upload Instructions

Once created, upload all 5 files to:
```
/public/downloads/resume-examples/
```

The download buttons are already implemented in the UI and will automatically work once files are present.

## Testing

After uploading, test downloads at:
- https://beta.medicalcareercenter.org/downloads/resume-examples/new-grad-rn-resume.docx
- https://beta.medicalcareercenter.org/downloads/resume-examples/experienced-medsurg-rn-resume.docx
- https://beta.medicalcareercenter.org/downloads/resume-examples/icu-critical-care-rn-resume.docx
- https://beta.medicalcareercenter.org/downloads/resume-examples/charge-nurse-leadership-resume.docx
- https://beta.medicalcareercenter.org/downloads/resume-examples/career-changer-transition-resume.docx
