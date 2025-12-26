# **🚀 SAAS IGNITION SEQUENCE (Setup & Run)**

Ye guide maanti hai keh aap nay scaffold\_saas\_architecture.sh run kar lia hai aur aap kay paas Mehaal folder mojood hai.

## **STEP 1: SECRETS CONFIGURATION (.env)**

Scaffolding script nay .env file ignore ki thi (security reason). Aapko root folder main .env file banani paregi taake Database aur AI engine baat kar saken.

**Create a file named .env in the root folder:**

\# \--- DATABASE (Docker Local) \---  
\# Format: postgres://user:password@host:port/dbname  
DATABASE\_URL="postgresql://user:pass@localhost:5432/saas?schema=public"

\# \--- REDIS (Queue System) \---  
REDIS\_URL="redis://localhost:6379"

\# \--- AI ENGINE CONNECTION \---  
\# Next.js yahan baat karega  
NEXT\_PUBLIC\_AI\_SOCKET\_URL="ws://localhost:8000/ws/s2s"

\# \--- AUTH (Clerk or NextAuth Secret) \---  
\# Abhi kay liay dummy rakh rahay hain, production main Clerk use hoga  
NEXT\_PUBLIC\_CLERK\_PUBLISHABLE\_KEY="pk\_test\_dummy"  
CLERK\_SECRET\_KEY="sk\_test\_dummy"

\# \--- TENANT SETTINGS \---  
\# Default domain for identifying subdomains  
NEXT\_PUBLIC\_ROOT\_DOMAIN="localhost:3000"

## **STEP 2: INFRASTRUCTURE BOOT (Docker)**

Aapko Postgres aur Redis install karnay ki zarurat nahi. Hum Docker container use karenge jo infrastructure/docker-compose.yml main define hain.

**Terminal 1 main run karen:**

\# Sirf DB aur Redis chalayen (AI Engine aur Web hum alag chalayenge taake logs dekh saken)  
docker-compose up \-d db redis

*Wait karen jab tak containers "Healthy" na ho jayen.*

## **STEP 3: HYDRATE THE DATABASE (Prisma)**

Ab jab database chal gaya hai, humein usay batana hai keh Tables (User, Tenant, Roles) kaisay bananay hain.

**Root terminal main run karen:**

\# 1\. Dependencies install karen  
npm install

\# 2\. Prisma Client generate karen (Type-Safety kay liay)  
npx prisma generate

\# 3\. Schema ko Database main push karen  
npx prisma db push

*Agar ye success ho gaya, iska matlab aapka Next.js ab Database say jur chuka hai.*

## **STEP 4: BRAIN ACTIVATION (Python AI Engine)**

AI Engine ko dependencies chahiye.

**Terminal 2 main run karen:**

cd apps/ai-engine

\# Virtual Environment (Optional but Recommended)  
python \-m venv venv  
source venv/bin/activate  \# Windows: venv\\Scripts\\activate

\# Install requirements  
pip install \-r requirements.txt

\# Start the AI Server  
uvicorn main:app \--reload \--port 8000

*Ab aapka dimagh (AI) localhost:8000 par zinda hai.*

## **STEP 5: FRONTEND LAUNCH (Next.js)**

Ab aakhri hissa, User Interface.

**Terminal 3 (Root) main run karen:**

npm run dev  
\# Ya agar Turbo use kar rahay hain:  
npx turbo dev

## **🎉 SYSTEMS CHECK**

Browser kholen aur check karen:

1. **Web UI:** http://localhost:3000 (Landing page khulni chahiye).  
2. **AI Health:** http://localhost:8000 (JSON return karega {"status": "AI Engine Online"}).  
3. **Database Studio:** npx prisma studio run karen taake aap GUI kay zariye User/Tenant data dekh saken.

## **AGAR MASLA AAYE (Troubleshooting)**

* **Port Conflict:** Agar port 3000 busy hai, to lsof \-i :3000 kar kay process kill karen.  
* **Prisma Error:** Check karen Docker container chal raha hai ya nahi (docker ps).