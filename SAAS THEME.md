# **🎨 SAAS VISUAL CONTROL CENTER**

Ye list un files ki hai jahan aap **Design Change** kar saktay hain bina System ko toray.

## **1\. COLORS, SHADOWS & FONTS (The DNA)**

Agar aap puri site ka rang (Theme) badalna chahtay hain (e.g., Neela say Laal), to yahan jayen.

* **File:** apps/web/tailwind.config.ts  
  * **Kia Change Hoga:** \* colors: Yahan primary, neon, glass colors define hain.  
    * boxShadow: Yahan 'neon' glow ka effect hai.  
    * animation: Yahan pulse, spin ki speed control hoti hai.  
* **File:** apps/web/app/globals.css  
  * **Kia Change Hoga:** \* Background Color (Dark/Light mode defaults).  
    * Base Font Size.

## **2\. HERO SECTION & LANDING PAGE**

Agar aap "Heading Text", "Buttons ka Style", ya "Images" badalna chahtay hain jo visitor ko sab say pehlay dikhtay hain.

* **File:** apps/web/app/(marketing)/page.tsx  
  * **Search Karen:** \<nav\> (Navbar ke liay), \<main\> (Hero Section ke liay).  
  * **Tip:** Is file main Logic (VoiceController) bhi hai, usay mat cheren. Sirf className="..." wali cheezain badlen.

## **3\. SIDEBAR & DASHBOARD LAYOUT**

Agar aap Sidebar ko Left say Right karna chahtay hain, ya Header ki unchai (height) badalna chahtay hain.

* **File:** apps/web/app/(dashboards)/layout.tsx  
  * **Kia Change Hoga:** \* \<aside\> tag Sidebar hai. Width w-64 ko change karen.  
    * bg-glass-gradient class hatayen agar transparent nahi chahiye.

## **4\. LOGO & BRANDING**

Logo ka size, shape, ya rang badalna hai.

* **File:** apps/web/components/ui/logo.tsx  
  * **Kia Change Hoga:** \* Ye ek SVG file hai. Aap \<svg\> tag ke andar path ya fill change kar saktay hain.  
    * Size: width="32" aur height="32" ko badlen.

## **5\. 3D CANVAS BACKGROUND & LIGHTING**

Agar aap 3D model ke peechay ki light ya background color change karna chahtay hain.

* **File:** apps/web/components/3d/ProductViewer.tsx  
  * **Kia Change Hoga:** \* \<Stage intensity={0.6}\>: Roshni kam/zyada karen.  
    * \<Canvas\>: Camera ka angle ya zoom set karen.

## **⚡ SAFE EDITING GUIDE (Kese Edit Karen?)**

### **Scenario 1: "Mujhe Neela Rang pasand nahi, Purple chahiye."**

1. Kholen: apps/web/tailwind.config.ts  
2. Dhoonden: neon: { blue: "\#00f3ff" }  
3. Change Karen: neon: { blue: "\#800080" }  
4. Result: Puri website par jahan bhi neon blue tha, wo purple ho jayega.

### **Scenario 2: "Mujhe Sidebar Left nahi Right par chahiye."**

1. Kholen: apps/web/app/(dashboards)/layout.tsx  
2. Dhoonden: \<div className="flex ..."\>  
3. Change Karen: flex-row ko flex-row-reverse kar den.  
4. Result: Sidebar right par chala jayega, content left par aa jayega.

### **Scenario 3: "Hero Section ka Font bara karna hai."**

1. Kholen: apps/web/app/(marketing)/page.tsx  
2. Dhoonden: text-6xl  
3. Change Karen: text-8xl kar den.

⚠️ WARINING:  
Kabhi bhi .ts ya .tsx files main logic part (jese const, function, return, {variable}) ko delete mat karen. Sirf className ya text content (safed rang main jo likha hota hai) ko change karen.