# 📚 CMS USER GUIDE

**For:** Content Managers & Admins  
**Version:** 1.0  
**Updated:** December 23, 2025

---

## 🎯 Quick Start

### Login to Admin Panel
```
URL: http://localhost:5173/admin
```

Or click **Admin** in your app header (requires login)

### Main Navigation
- 📊 **Dashboard** - Overview stats
- 🏠 **Home Page** - Edit homepage content
- 📄 **Pages** - Create & manage custom pages
- 📋 **Navigation** - Manage menu items
- 🎨 **Brand Assets** - Upload logo, favicon, etc.
- ⚙️ **Platform Settings** - Site configuration

---

## 📄 Managing Pages

### Create a New Page

1. Click **Pages** in sidebar
2. Click **➕ New Page**
3. Fill in the form:
   - **Title:** What appears in browser tab
   - **Slug:** URL path (e.g., `about-us` → `/about-us`)
   - **SEO Title:** (optional) Custom title for search engines
   - **SEO Description:** (optional) Meta description
4. Click **Create Page**
5. Page is created as **draft** (not visible to public)

### Edit Page Content

1. Find the page in the list
2. Click **Edit** button
3. In the editor modal:
   - See all content blocks
   - Add new blocks (Hero, Text, Image, Gallery, CTA)
   - Edit block data (JSON)
   - Delete blocks you don't need
4. Close when done

**Note:** Changes are saved automatically

### Publish a Page

1. Find the page in the list
2. Click **Publish** button
3. Page is now visible at `/[slug]`

### Unpublish a Page

1. Find the page in the list
2. Click **Unpublish** button
3. Page becomes inaccessible to public (still in admin)

### Delete a Page

1. Find the page in the list
2. Click **Delete** button
3. **⚠️ Warning:** This cannot be undone

---

## 📋 Navigation Menu

### View Current Menu

1. Click **Navigation** in sidebar
2. You see all menu items in order

Default items:
- Home
- Features
- Pricing
- Docs
- Contact

### Add a Menu Item

1. Click **➕ Add Item**
2. Fill in:
   - **Label:** What users see (e.g., "About Us")
   - **Slug:** URL path (e.g., "about-us")
   - **Position:** Order in menu (0 = first)
   - **Parent ID:** (optional) For sub-menus
   - **Active:** Checkbox to show/hide
3. Click **Create**

### Edit Menu Item

1. Find the item in the list
2. Click **Edit**
3. Change any fields
4. Click **Update**

### Reorder Menu

Edit the **Position** number:
- 0 = First
- 1 = Second
- etc.

### Hide Menu Item

1. Click the item's checkbox
2. Item becomes inactive (hidden from frontend)

### Delete Menu Item

1. Click **Delete**
2. Item removed from menu

---

## 🎨 Brand Assets

### Current Assets

- **Logo** - Main site logo
- **Favicon** - Browser tab icon
- **OG Image** - Social media preview
- **Banner** - Hero/banner image
- **Placeholder** - Default image

### Upload/Change Asset

1. Click **Brand Assets** in sidebar
2. Find the asset card
3. Click **Upload** (or **Change** if exists)
4. Choose file from computer
5. Click **Upload** button
6. Asset updated instantly

### View Asset Info

Each card shows:
- Asset name
- Current file path (if uploaded)
- Last updated date

### Delete Asset

1. Click **Delete** button on asset
2. Asset file removed but entry kept

---

## 🔍 Content Structure (Block System)

Pages use a **block-based system** for flexibility.

### Block Types

| Block | Use For |
|-------|---------|
| **Hero** | Large header with headline |
| **Text** | Paragraphs, descriptions |
| **Image** | Single image with caption |
| **Gallery** | Multiple images in grid |
| **Call to Action** | Button + text (e.g., "Sign Up") |

### Block Data Format

Each block is JSON:

```json
{
  "type": "hero",
  "data": {
    "headline": "Welcome to Mehaal",
    "subtitle": "Beautiful SaaS platform",
    "image_url": "/images/hero.jpg"
  }
}
```

---

## 📱 SEO Optimization

### Page SEO Fields

- **SEO Title:** 50-60 characters (appears in search results)
- **SEO Description:** 150-160 characters (appears below title)
- **SEO Image:** URL for social media preview

### Example

- **Title:** "About Us - Mehaal"
- **Description:** "Learn about Mehaal, the platform for modern SaaS businesses."
- **Image:** `/uploads/og-image.png`

### Tips

✅ **Do:**
- Keep titles under 60 characters
- Use keywords naturally
- Write compelling descriptions
- Use descriptive image alt text

❌ **Don't:**
- Stuff keywords
- Copy title as description
- Use placeholder text
- Leave fields empty

---

## 🔐 Admin Permissions

### Who Can Access?

- ✅ **Founder** - Full access
- ✅ **Admin** - Full access
- ❌ **Editor** - Read-only (view pages)
- ❌ **User** - No access

**Current:** All endpoints allow admin-level users

---

## 📊 Publishing Workflow

### Draft → Published → Live

```
1. CREATE PAGE (Draft)
   └─ Only you can see it
   └─ Complete editing

2. PUBLISH PAGE
   └─ Visible at public URL
   └─ Appears in navigation
   └─ Shows in page list

3. LIVE ON SITE
   └─ Users can access
   └─ Links work
   └─ SEO indexed
```

### Unpublish Workflow

```
1. UNPUBLISH PAGE
   └─ Returns to Draft
   └─ URL shows 404
   └─ Hidden from users

2. REDIRECT (Optional)
   └─ Set old URL to redirect
   └─ Users notified page moved

3. DELETE (Optional)
   └─ Permanently remove
   └─ Cannot be recovered
```

---

## 🐛 Troubleshooting

### Page Not Showing

- [ ] Is it **published**? (Check status column)
- [ ] Is the **slug correct**? (URL path matches)
- [ ] Is the backend **running**? (Check http://localhost:8000)

### Can't Edit Navigation

- [ ] Is backend **running**?
- [ ] Are you **logged in** as admin?
- [ ] Try **refreshing** the page

### Brand Asset Won't Upload

- [ ] Is it an **image file**? (JPG, PNG, SVG, GIF)
- [ ] Is it **under 5MB**?
- [ ] Check browser **console** for errors

### Changes Not Saving

- [ ] Is the **network working**?
- [ ] Check browser **network tab** for errors
- [ ] Try **reloading** the page

---

## 📞 Support

### Where to Find Help

- **API Docs:** http://localhost:8000/docs
- **Database:** Check Postgres logs
- **Frontend:** Check browser console (F12 → Console)

### Debug Mode

Enable verbose logging:
```bash
# Backend
export DEBUG=true
python run.py

# Frontend
VITE_DEBUG=true npm run dev
```

---

## 💡 Best Practices

### Content

- ✅ Use short, clear headlines
- ✅ Break text into small paragraphs
- ✅ Use block structure for readability
- ✅ Test links before publishing
- ✅ Keep SEO titles under 60 characters

### Navigation

- ✅ Keep main menu under 7 items
- ✅ Use clear, short labels
- ✅ Group related items with sub-menus
- ✅ Hide inactive pages

### Assets

- ✅ Use high-quality images
- ✅ Optimize file sizes
- ✅ Use consistent branding
- ✅ Keep file names descriptive

### Workflow

- ✅ Draft first, review, then publish
- ✅ Use SEO fields for search visibility
- ✅ Publish during business hours
- ✅ Keep backups of important content

---

## 🎓 Learning Path

**New User:**
1. Read this guide (15 min)
2. Create a test page (5 min)
3. Publish it (2 min)
4. View it live (2 min)

**Intermediate:**
1. Create page with multiple blocks (15 min)
2. Build navigation menu (10 min)
3. Upload brand assets (5 min)
4. Test SEO settings (10 min)

**Advanced:**
1. Design complex pages with blocks (30 min)
2. Create content strategies (varies)
3. Optimize for SEO (varies)
4. Manage team permissions (15 min)

---

**Last Updated:** December 23, 2025  
**Questions?** Contact your tech team  
**Need Help?** Check http://localhost:8000/docs
