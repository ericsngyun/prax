# PRAX Website - Pages Summary

All three pages built with professional, minimal design matching homepage quality.

---

## ✅ **1. SERVICES PAGE** (`/services`)

**Route:** `https://yoursite.com/services`

### Sections Built:
1. **Hero** - Clean headline, clear positioning
2. **Service Tiers** - 3 cards (Signature Cut $150, Grooming Package $200, Consultation $50)
3. **Honesty Section** - "Is PRAX Right for You?" (for/not for transparency)
4. **What Makes PRAX Different** - 3 pillars (Structural Approach, Education Standards, Long-Term Results)
5. **Experience Timeline** - 4-step walkthrough (Consultation → Cutting → Detailing → Styling)
6. **Before/After Gallery** - Horizontal scroll (6 placeholder pairs)
7. **Final CTA** - Booking conversion

### Design Features:
- Clean service cards with pricing transparency
- Honest positioning (who it's for/not for)
- Timeline with vertical line connector
- Horizontal scroll gallery with placeholders
- Direct booking CTAs throughout

### Media Placeholders:
- **6-8 before/after pairs** (12-16 images total)
- Each shows "BEFORE PHOTO" and "AFTER PHOTO" with specifications

---

## ✅ **2. TEAM PAGE** (`/team`)

**Route:** `https://yoursite.com/team`

### Sections Built:
1. **Hero** - Team philosophy statement
2. **Team Grid** - 4 members with unified bios
   - Jack Louii (Founder & Lead Artist)
   - Gavin Chen (Master Barber)
   - Edward Santos (Senior Stylist)
   - Steven Park (Color Specialist)
3. **Team Values** - 4 shared beliefs
4. **Educator Credibility** - Stats (500+ barbers, 7 cities, 12+ years)
5. **Final CTA** - Book with the team

### Design Features:
- Alternating grid layout (portrait left/right)
- Consistent bio structure (specialty, experience, credentials, philosophy)
- Portrait + action shot for each member
- Team portraits already linked to Cloudinary (teamJack, teamGavin, teamEdward, teamSteven)
- Grayscale hover effect on portraits

### Media Placeholders:
- **4 action shots** (each member working)
- Team portraits already have assets

---

## ✅ **3. ABOUT PAGE** (`/about`)

**Route:** `https://yoursite.com/about`

### Sections Built:
1. **Hero** - "Built on Craft, Not Hype"
2. **Origin Story** - Why PRAX exists (Jack's vision)
3. **Core Values Deep Dive** - 3 values explained in depth
   - Precision as a Value
   - Design + Discipline
   - Long-Term Vision
4. **Studio Space** - LA location with 6-image grid
5. **The PRAX Standard** - 3 pillars (Precision, Consistency, Education)
6. **Final CTA** - Experience the difference

### Design Features:
- Split layout (story text + founder portrait)
- Large background numbers for values
- Studio photo grid (3 columns)
- Clean, minimal aesthetic

### Media Placeholders:
- **1 founder portrait** (can reuse teamJack)
- **6 studio interior/detail shots**

---

## 🔧 **NAVIGATION & FOOTER UPDATES**

### Header Navigation Updated:
```
Services → /services
Team → /team
About → /about
Academy → /#academy (placeholder)
```

### Footer Links Centralized:
**File:** `/lib/footerConfig.ts`

All pages now use the same footer with:
- **Services:** All Services, Book Appointment
- **Studio:** Team, About, Location
- **Academy:** In-Person Classes, Online Courses
- **Connect:** Instagram (@praxhair), TikTok (@praxhair), Contact

### Social Links Updated:
- Instagram: `https://www.instagram.com/praxhair/`
- TikTok: `https://www.tiktok.com/@praxhair`

---

## 📸 **MEDIA REQUIREMENTS**

See `MEDIA_REQUIREMENTS.md` for complete specifications.

### Priority Order:
1. **HIGH:** Before/After pairs (6-8 pairs = 12-16 images)
2. **MEDIUM:** Team action shots (4 images)
3. **MEDIUM:** Studio interiors (4-6 images)
4. **LOW:** Detail shots (6-9 images)

### All Placeholders Show:
- What type of photo
- Dimensions needed
- Specific requirements
- Example: "BEFORE PHOTO - Portrait shot, consistent lighting"

---

## 🎨 **DESIGN CONSISTENCY**

### All Pages Feature:
- Same minimal, sophisticated aesthetic as homepage
- Serif headlines (Cormorant Garamond)
- Sans body (PP Neue Montreal)
- Ink & Bone color palette
- Clean animations (fade-ups, staggered reveals)
- Professional spacing and typography hierarchy

### Component Reuse:
- DifferentiationSection (used on Homepage, Services)
- CTASection (all pages)
- Footer (centralized config)
- ImageReveal (About, Team)

---

## ✅ **COMPLETED DELIVERABLES**

### New Components Created:
1. `ServiceTiersSection.tsx` - Pricing cards
2. `HonestySection.tsx` - For/not for transparency
3. `ExperienceTimelineSection.tsx` - Step-by-step timeline
4. `BeforeAfterGallery.tsx` - Horizontal scroll gallery
5. `TeamGridSection.tsx` - Unified team bios
6. `TeamValuesSection.tsx` - Shared beliefs
7. `OriginStorySection.tsx` - Founder story
8. `CoreValuesDeepDive.tsx` - Values explained
9. `StudioSpaceSection.tsx` - Space showcase

### New Pages Created:
1. `/app/services/page.tsx`
2. `/app/team/page.tsx`
3. `/app/about/page.tsx`

### Configuration Files:
1. `/lib/footerConfig.ts` - Centralized footer links
2. `/MEDIA_REQUIREMENTS.md` - Complete photo specifications
3. `/PAGES_SUMMARY.md` - This document

---

## 🚀 **NEXT STEPS**

1. **Provide Photos:** Follow specifications in `MEDIA_REQUIREMENTS.md`
2. **Upload to Cloudinary:** Add new assets to CDN
3. **Update Asset Links:** Replace placeholder `src=""` with real URLs
4. **Test Responsiveness:** Verify all layouts on mobile/tablet/desktop
5. **Academy Page:** Build when content is ready
6. **Contact Form:** Add if needed

---

## 📝 **NOTES**

- All pages follow Jack's guidelines (clear positioning, no hype, direct language)
- All booking CTAs link to Squire platform
- Design maintains Awwwards-level quality while being minimal
- All placeholders clearly labeled for easy photo replacement
- Footer and navigation now consistent across all pages
- Social links updated to correct PRAX accounts
