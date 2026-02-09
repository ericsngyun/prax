# PRAX Website - Media Requirements

This document outlines all required media assets for the PRAX website with specifications and usage locations.

---

## **SERVICES PAGE** (`/services`)

### **Before/After Gallery** (6-8 images)
**Purpose:** Horizontal scroll gallery showcasing transformation quality

**Specifications:**
- **Format:** JPEG or WebP
- **Dimensions:** 1200x1600px minimum (3:4 aspect ratio)
- **Style:** Consistent lighting, same angle for before/after pairs
- **Subjects:** Clean, professional headshots

**Required Pairs:**
1. **Precision Fade** - Before/After (Signature Cut)
2. **Textured Crop** - Before/After (Signature Cut)
3. **Classic Taper** - Before/After (Signature Cut)
4. **Modern Pompadour** - Before/After (Grooming Package)
5. **Beard Sculpting** - Before/After (Grooming Package)
6. **Structural Cut** - Before/After (Signature Cut)
7. *Optional: 2 more pairs for variety*

**Photo Guidelines:**
- Same background (neutral, minimal)
- Same lighting setup
- Same camera angle and distance
- High contrast, editorial feel
- Can be grayscale or desaturated color

---

### **Detail/Process Shots** (3-5 images)
**Purpose:** Show precision work, tools, professional environment

**Specifications:**
- **Format:** JPEG or WebP
- **Dimensions:** 1600x1200px minimum
- **Style:** Close-up, high detail, editorial lighting

**Required:**
1. **Close-up of precision cutting** - Hands, scissors, detailing work
2. **Tools laid out** - Professional barber tools, clean aesthetic
3. **Studio environment** - Chair, minimal background
4. *Optional: Styling in progress*
5. *Optional: Product application*

---

## **TEAM PAGE** (`/team`)

### **Team Portraits** (4-6 images)
**Purpose:** Individual member portraits for team grid

**Specifications:**
- **Format:** JPEG or WebP
- **Dimensions:** 1200x1600px minimum (3:4 aspect ratio)
- **Style:** MUST BE CONSISTENT across all members

**Critical Consistency Requirements:**
- Same background (solid color or minimal texture)
- Same lighting setup (direction, softness, contrast)
- Same camera distance and framing
- Same post-processing (color grade, contrast)
- Professional, editorial quality

**Required Portraits:**
1. **Jack Louii** - Founder & Lead Artist (already have: `teamJack`)
2. **Gavin Chen** - Master Barber (already have: `teamGavin`)
3. **Edward Santos** - Senior Stylist (already have: `teamEdward`)
4. **Steven Park** - Color Specialist (already have: `teamSteven`)
5. *Optional: Additional team members*

**Photo Style:**
- Grayscale or minimal desaturation
- High contrast
- Clean background
- Slight moody/editorial vibe
- Can hover to reveal color (if shot in color)

---

### **Action Shots** (4-6 images)
**Purpose:** Show each team member working (skills/craft)

**Specifications:**
- **Format:** JPEG or WebP
- **Dimensions:** 1920x1080px minimum (16:9 aspect ratio)
- **Style:** Editorial, documentary feel

**Required:**
1. **Jack working** - Teaching or cutting
2. **Gavin working** - Fade precision or detail work
3. **Edward working** - Styling or cutting
4. **Steven working** - Color application or cutting
5. *Additional team members*

**Photo Guidelines:**
- Can be more candid/documentary style
- Show focus and professionalism
- High detail on hands/tools/work
- No need for consistency across members (unlike portraits)

---

### **Team Group Shot** (1 image - OPTIONAL)
**Purpose:** Show cohesion, team dynamic

**Specifications:**
- **Dimensions:** 1920x1080px minimum
- **Style:** Minimal, professional, not overly posed

---

## **ABOUT PAGE** (`/about`)

### **Founder/Jack Photos** (2-3 images)
**Purpose:** Origin story, authority building

**Specifications:**
- **Format:** JPEG or WebP
- **Dimensions:** 1200x1600px or 1600x1200px
- **Style:** Editorial, high-quality

**Required:**
1. **Jack portrait** - Can reuse from team page or different angle
2. **Jack teaching/working** - Shows educator role
3. *Optional: Jack with students or in early studio days (archival)*

---

### **Studio Interior Shots** (4-6 images)
**Purpose:** Show the designed space, LA location, minimal aesthetic

**Specifications:**
- **Format:** JPEG or WebP
- **Dimensions:** 1600x1200px or 1200x1600px
- **Style:** Architectural, clean, minimal

**Required:**
1. **Main cutting floor** - Wide shot showing multiple stations
2. **Individual station** - Detail of a single cutting area
3. **Waiting/reception area** - Shows minimal aesthetic
4. **Studio exterior** - Building or entrance (optional)
5. *Optional: Hallway, product area, etc.*

**Photo Guidelines:**
- Clean, uncluttered
- Show design aesthetic
- Natural or professional lighting
- Minimal distractions

---

### **Detail Shots** (3-4 images)
**Purpose:** Aesthetic moments, texture, brand feeling

**Specifications:**
- **Format:** JPEG or WebP
- **Dimensions:** 1200x1600px (portrait) or 1600x1200px (landscape)
- **Style:** High contrast, editorial, detail-focused

**Required:**
1. **Tool close-up** - Scissors, clippers, professional tools
2. **Product shelf** - Curated selection, minimal aesthetic
3. **Texture detail** - Could be fabric, materials, surfaces
4. *Optional: Hands/craftsmanship detail*

---

## **HOMEPAGE** (Already Has Video)

### **Portfolio/Work Showcase** (6 images - ALREADY PROVIDED)
Currently using Cloudinary assets:
- `portfolio01`, `portfolio03`, `portfolio04`, `portfolio05`, `portfolio06`, `portfolio07`

**If replacing, specs:**
- **Dimensions:** 1200x1600px minimum
- **Style:** Clean haircuts, professional photography
- High quality finished work

---

## **SUMMARY: Total Media Needed**

| Category | Quantity | Priority |
|----------|----------|----------|
| Before/After Pairs | 6-8 pairs (12-16 images) | **HIGH** |
| Team Portraits | 4 (already have) | Complete ✓ |
| Team Action Shots | 4 | **MEDIUM** |
| Studio Interiors | 4-6 | **MEDIUM** |
| Detail Shots | 6-9 | **LOW** |
| Founder Photos | 2-3 | **MEDIUM** |

---

## **Photo Style Guidelines (All Images)**

### **Color Palette:**
- Grayscale preferred
- Or desaturated with minimal color
- High contrast (deep blacks, bright whites)
- Consistent with "Ink & Bone" brand

### **Lighting:**
- Professional, not flat
- Dramatic but not harsh
- Consistent across similar image types

### **Framing:**
- Clean compositions
- Minimal backgrounds
- Subject-focused

### **Post-Processing:**
- Editorial feel (not Instagram filters)
- Subtle grain acceptable
- No heavy HDR or oversaturation

---

## **Placeholder Status**

All pages currently use **placeholder boxes** with labels indicating:
- What type of photo goes there
- Dimensions needed
- Any specific requirements

**Example placeholders:**
- "BEFORE PHOTO - Portrait shot, consistent lighting"
- "TEAM PORTRAIT - Jack Louii"
- "STUDIO INTERIOR - Main floor"

These make it clear what needs to be shot and how it will be used.

---

## **Delivery Format**

**When ready to add real photos:**
1. Upload to Cloudinary (or another CDN)
2. Update `lib/cloudinary.ts` with new asset URLs
3. Replace placeholder `src=""` with actual image paths
4. Test responsiveness and loading performance

---

## **Questions?**

Contact developer with:
- Sample images for style approval
- Questions about specific shot requirements
- Timeline for photo delivery
