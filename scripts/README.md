# 🌱 lstBooks Content Seeding Scripts

This directory contains scripts to populate your lstBooks platform with **real, professional dental education content**.

## 📋 What Gets Seeded

### 1. **Revision Notes** (4 comprehensive notes)
- ✅ Dental Caries - Complete Overview
- ✅ Local Anesthesia in Dentistry
- ✅ Periodontal Disease - Classification and Management
- ✅ Dental Radiography - Techniques and Interpretation

Each note includes:
- Complete, exam-focused content (2000-3000 words)
- Key points for quick review
- Mnemonics for memorization
- Difficulty levels and estimated read times
- Proper categorization and tagging

### 2. **Study Plans** (2 complete plans)
- ✅ Complete Operative Dentistry Mastery - 30 Days
- ✅ Oral Surgery Fundamentals - 21 Days

Each plan includes:
- Daily structured tasks (read, watch, quiz, practice)
- Learning goals and prerequisites
- Estimated time for each task
- Progressive difficulty
- Comprehensive final assessments

### 3. **Videos** (4 professional videos)
- ✅ Complete Guide to Dental Caries
- ✅ Local Anesthesia Injection Techniques
- ✅ Class II Composite Restoration
- ✅ Root Canal Treatment - Step by Step

Each video includes:
- Detailed chapters with timestamps
- Instructor credentials
- Downloadable attachments
- Difficulty levels and categories
- Proper subject/year tagging

## 🚀 How to Run

### Prerequisites
1. MongoDB must be running
2. Database must have subjects created
3. At least one admin user must exist

### Option 1: Seed All Content (Recommended)
```bash
cd backend/scripts
node seedAllContent.js
```

This will automatically run all three seed scripts in sequence.

### Option 2: Seed Individual Content
```bash
# Seed only revision notes
node seedRevisionNotes.js

# Seed only study plans
node seedStudyPlans.js

# Seed only videos
node seedVideos.js
```

## ⚠️ Important Notes

### Before Running:
1. **Backup your database** if you have existing content
2. These scripts will **DELETE all existing** revision notes, study plans, and videos
3. Make sure you have subjects in your database (Operative Dentistry, Oral Surgery, Periodontics, Oral Radiology, Endodontics)
4. Ensure you have at least one admin user

### After Running:
1. Check the console output for success messages
2. Verify content in your database
3. Test the frontend to ensure content displays correctly

## 📊 Expected Output

```
═══════════════════════════════════════════════════
🌱 SEEDING ALL REAL CONTENT FOR LSTBOOKS
═══════════════════════════════════════════════════

🚀 Running seedRevisionNotes.js...
✅ Connected to MongoDB
🗑️  Cleared existing revision notes
✅ Created 4 revision notes

📝 Revision Notes Created:
   - Dental Caries - Complete Overview (Year 2)
   - Local Anesthesia in Dentistry (Year 2)
   - Periodontal Disease - Classification and Management (Year 3)
   - Dental Radiography - Techniques and Interpretation (Year 2)

✅ Revision Notes seeded successfully!

🚀 Running seedStudyPlans.js...
✅ Connected to MongoDB
🗑️  Cleared existing study plans
✅ Created 2 study plans

📅 Study Plans Created:
   - Complete Operative Dentistry Mastery - 30 Days (30 days)
   - Oral Surgery Fundamentals - 21 Days (21 days)

✅ Study Plans seeded successfully!

🚀 Running seedVideos.js...
✅ Connected to MongoDB
🗑️  Cleared existing videos
✅ Created 4 videos

🎥 Videos Created:
   - Complete Guide to Dental Caries - Pathogenesis and Management (39 min)
   - Local Anesthesia Injection Techniques - Complete Demonstration (33 min)
   - Class II Composite Restoration - Complete Clinical Procedure (26 min)
   - Root Canal Treatment - Step by Step Endodontic Procedure (36 min)

✅ Videos seeded successfully!

═══════════════════════════════════════════════════
🎉 ALL CONTENT SEEDED SUCCESSFULLY!
═══════════════════════════════════════════════════

📊 Summary:
   ✅ Revision Notes - Real dental education content
   ✅ Study Plans - 30-day structured learning paths
   ✅ Videos - Professional dental procedure videos

🚀 Your lstBooks platform now has REAL, VALUABLE content!
   Students can start learning immediately.
```

## 🎓 Content Quality

All content is:
- ✅ **Clinically accurate** - based on current dental education standards
- ✅ **Exam-focused** - includes key points and mnemonics
- ✅ **Comprehensive** - covers topics in depth
- ✅ **Well-structured** - organized for easy learning
- ✅ **Professional** - suitable for dental school curriculum

## 🔄 Updating Content

To add more content:
1. Edit the respective seed file (`seedRevisionNotes.js`, `seedStudyPlans.js`, or `seedVideos.js`)
2. Add new objects to the data arrays
3. Run the seed script again

## 📝 Notes on Video URLs

The video URLs in `seedVideos.js` are placeholders. To use real videos:
1. Upload videos to YouTube or Vimeo
2. Replace the placeholder URLs with actual video URLs
3. Update thumbnail URLs accordingly
4. Or use your own video hosting solution

## 🆘 Troubleshooting

**Error: "No admin user found"**
- Create an admin user first using your user registration system

**Error: "Subject not found"**
- Make sure you have subjects created in your database
- The seed scripts look for subjects by name (e.g., "Operative Dentistry")

**Error: "Connection refused"**
- Check that MongoDB is running
- Verify your MONGODB_URI in .env file

## 📧 Support

If you encounter issues, check:
1. MongoDB connection
2. Database has required collections (users, subjects)
3. Environment variables are set correctly

