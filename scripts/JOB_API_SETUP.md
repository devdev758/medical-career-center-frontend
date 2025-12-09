# Job API Testing - Setup Instructions

## Quick Start

### 1. Adzuna API (Recommended - Free, Good Coverage)

**Sign up**: https://developer.adzuna.com/

**Steps**:
1. Create free account
2. Get your APP_ID and APP_KEY
3. Add to `.env.local`:
   ```
   ADZUNA_APP_ID=your_app_id
   ADZUNA_APP_KEY=your_app_key
   ```

**Limits**: 
- Free tier: Generous limits
- No approval required
- US job coverage: Excellent

---

### 2. Arbeitnow API (No API Key Needed!)

**No signup required!** Just use the API directly.

**Coverage**: 
- Primarily European jobs
- Some remote US positions
- Good for remote healthcare jobs

---

### 3. USAJobs API (Government Jobs)

**Sign up**: https://developer.usajobs.gov/

**Steps**:
1. Create account
2. Get API key
3. Add to `.env.local`:
   ```
   USAJOBS_API_KEY=your_api_key
   USAJOBS_USER_AGENT=your.email@example.com
   ```

**Coverage**:
- US government healthcare jobs only
- VA hospitals, federal facilities
- Good for niche coverage

---

## Run the Test

```bash
# Install axios if not already installed
npm install axios

# Run the test script
npx tsx scripts/test-job-apis.ts
```

## Expected Output

The script will test all three APIs and show:
- ✅ Which APIs work
- 📊 How many jobs each API returns
- 📝 Sample job data structure
- 💡 Recommendation on which to use

---

## Next Steps After Testing

1. **If Adzuna works**: Use as primary source
2. **Create import script**: Based on working API's data structure
3. **Design job page**: Using actual job data fields
4. **Implement caching**: To stay within API limits

---

## API Comparison

| API | Free Tier | Approval | US Jobs | Healthcare | Rate Limit |
|-----|-----------|----------|---------|------------|------------|
| Adzuna | ✅ Yes | ❌ No | ✅ Excellent | ✅ Yes | Generous |
| Arbeitnow | ✅ Yes | ❌ No | ⚠️ Limited | ⚠️ Some | Unknown |
| USAJobs | ✅ Yes | ❌ No | ✅ Gov only | ✅ Yes | Good |
| Indeed | ❌ No* | ✅ Yes** | ✅ Best | ✅ Best | 1000/day |

*Requires 10K+ daily visitors
**Requires approval
