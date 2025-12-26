# **🔄 THE PROFESSIONAL LIFECYCLE (Dev to Prod)**

Setup mukammal honay kay baad, ye aapka **Rozana ka Maamool (Daily Routine)** hoga.

## **PHASE 1: CONNECTING TO GITHUB (The Source of Truth)**

Abhi sara code aapki local machine par hai. Isay GitHub par bhejna zaroori hai taake CI/CD pipelines active hon.

**VS Code Terminal main run karen:**

\# 1\. Stage all files (jo scaffold nay banaye)  
git add .

\# 2\. First Commit  
git commit \-m "feat: initial saas architecture scaffold"

\# 3\. Create Repo & Push (GitHub CLI agar install hai)  
\# Ya manual repo bana kar remote add karen  
gh repo create Mehaal \--private \--source=. \--remote=origin  
git push \-u origin main

Esoteric Secret:  
Monorepo (apps/web \+ apps/ai-engine) ko handle karnay kay liay GitHub par alag alag repos mat banayen. Ek hi repo main sab rakhna "State Synchronization" kay liay behtar hai.

## **PHASE 2: PRODUCTION DEPLOYMENT (Going Live)**

Localhost sirf aapkay liay hai. Dunya kay liay aapko Cloud par jana hoga.

### **1\. Frontend (Vercel)**

Next.js kay liay Vercel say behtar kuch nahi.

1. **Vercel Dashboard** par jayen \-\> "Add New Project".  
2. Apni GitHub Repo select karen.  
3. **Root Directory:** apps/web select karen (Ye zaroori hai).  
4. **Environment Variables:** .env walay variables yahan copy paste karen.  
5. **Deploy** dabayen.

### **2\. AI Engine (Railway / Fly.io)**

Python/FastAPI ko Vercel par mat rakhen (Timeout ho jayega).

1. **Railway.app** par jayen \-\> "New Project" \-\> "Deploy from GitHub repo".  
2. Settings main "Root Directory" ko apps/ai-engine set karen.  
3. **Variables:** REDIS\_URL add karen (Railway apko Redis bhi dega).  
4. Railway aapko ek URL dega (e.g., https://ai-engine-production.up.railway.app).

### **3\. Connecting the Dots**

Wapis Vercel jayen aur NEXT\_PUBLIC\_AI\_SOCKET\_URL ko update karen:  
wss://ai-engine-production.up.railway.app/ws/s2s  
Ab aapka Frontend (Vercel) aapkay Backend (Railway) say baat karega.

## **PHASE 3: THE DEVELOPMENT LOOP (Feature add kaisay karen?)**

Rozana kaam kartay waqt aap ye cycle follow karenge:

### **Scenario: "Mujhay User Table main 'Phone Number' add karna hai"**

Step 1: Database Change (Schema)  
VS Code main /packages/database/schema.prisma kholen aur change karen:  
model User {  
  // ... purani fields  
  phoneNumber String? // \<-- New Field  
}

Step 2: Database Push  
Terminal main run karen:  
npx prisma db push

*Ye local database ko update karega.*

Step 3: Frontend Update  
Ab /apps/web main us field ko use karen. Kyunkeh hum Monorepo use kar rahay hain, aapko Typescript ka error nahi ayega kyunkeh Prisma Client auto-update ho gaya hai.

## **PHASE 4: DEBUGGING SECRETS (Jab code phat jaye)**

1. AI Engine Logs:  
   Agar AI jawab nahi day raha, to browser console mat dekhen. Terminal 2 (jahan Python chal raha hai) dekhen. Wahan error Traceback hoga.  
2. WebSocket Testing:  
   Agar shak ho keh connection toot gaya hai, to Postman mat use karen. Chrome Console main ye likhen:  
   const ws \= new WebSocket('ws://localhost:8000/ws/s2s');  
   ws.onmessage \= (e) \=\> console.log(e.data);  
   ws.send('Hello AI');

   Agar "AI Processed: Hello AI" wapis aya, to sab theek hai.

## **FINAL CHECKLIST:**

1. \[ \] GitHub Repo created & pushed.  
2. \[ \] Vercel Project connected (Web).  
3. \[ \] Railway Project connected (AI Engine).  
4. \[ \] Environment Variables synced on both clouds.

**Ab aapka SaaS officially "Zinda" hai.**