
# 📚 AI Resume Coach & Big‑Tech Readiness Dashboard

*A full‑stack **Next.js 14 (App Router)** + **Django 4 (REST)** project that scores résumés like a Big‑Tech recruiter and tracks student progress.*

| Layer    | Tech |
|----------|------|
| Frontend | Next 14 · TypeScript · Tailwind CSS · Supabase Auth |
| Backend  | Django 4 · Django REST Framework |
| Database | PostgreSQL (via Supabase) |
| AI       | OpenAI GPT‑4 |
| DevOps   | ESLint · Prettier · Jest · GitHub Actions CI |

---

## ✨ What it does

⚙️ Powered by **OpenAI GPT-4**, the system analyzes key résumé traits Big Tech recruiters care about:
- Technical depth (system design, DSA)
- Project scope and ownership
- Clarity of impact and writing


1. **Résumé Upload** – drag‑and‑drop PDF/DOCX.  
2. **AI Analysis** – GPT‑4 returns Big‑Tech readiness + résumé‑clarity scores.  
3. **Storage** – feedback saved in Postgres (Supabase).  



I built this to sharpen Next.js + Django skills while mentoring freshmen who asked:  
*“How do I tweak my résumé for Google or Meta?”*

---


## 🔍 Demo

🎥 [Watch the demo video on Loom](https://www.loom.com/share/26217db1fb88450a9756a74396be56ef?sid=e3a4c019-2b18-4f45-9dd9-89afaf4646c1)



## 🗂 Repo layout
```
.
├─ backend/     # Django API & models
├─ frontend/    # Next.js UI
└─ README.md    # ← this file
```

---

## 🚀 Quick start (local)

```bash
git clone <repo>.git && cd <repo>

# env templates
cp backend/.env.example  backend/.env
cp frontend/.env.example frontend/.env.local
# add OPENAI_API_KEY, Supabase URL & anon key, DATABASE_URL, etc.

# backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver          # http://localhost:8000

# frontend (new terminal)
cd ../frontend
npm install
npm run dev                         # http://localhost:3000
```

---

## 🧰 Common scripts

| Layer | Command | Task |
|-------|---------|------|
| Frontend | `npm run dev` / `build` / `start` | dev / prod build / run |
|          | `npm run lint` / `test`          | ESLint + Prettier / Jest |
| Backend  | `python manage.py test`          | DRF endpoint tests |
|          | `ruff check .`                   | fast Python linter |
| Root CI  | GitHub Actions                   | lint + tests on every PR |

---
In addition to manual testing during development, I added a few non-critical automated tests using **Jest** (frontend) and **Django's built-in test framework** (backend).  
The goal wasn’t full coverage — it was to **learn how modern testing workflows function** and get hands-on with test setup, structure, and syntax in both ecosystems.


## 🔑 Environment variables

| File | Key | Purpose |
|------|-----|---------|
| `backend/.env`          | `OPENAI_API_KEY`, `DJANGO_SECRET_KEY`, `DATABASE_URL` |
| `frontend/.env.local`   | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

> **Secrets stay local** (git‑ignored); only `.env.example` templates are committed.

---

## 📂 Important folders / files

### backend/

| Path | Role |
|------|------|
| `views.py`  | `upload_file` endpoint → GPT‑4 → save JSON |
| `models.py` | `ResumeData` model (user_id, feedback, resume_name, created_at) |


### frontend/

| Path | Role |
|------|------|
| `app/layout.tsx`             | global layout + sidebar |
| `components/Side_bar.tsx`    | navigation + modal trigger |
|`components/Middle_box.tsx`    | displays resume feedback |
|`components/Right_barx.tsx`    | Allows you to switch between resume feedbacks |
| `components/EvaluationModal.tsx` | static “How It Works” dialog |
| `contexts/ModalContext.tsx`  | global modal state |
| `contexts/ResumeContext.tsx` | stores résumé JSON + scores |
| `analysis/page.tsx`          | Recharts bar‑chart of progress |
| `user_setting/page.tsx`      | Allows you to update profile and manage uploads|

---



## 🎓 Motivation

When I started mentoring incoming CS students, one question kept coming up again and again:

> *“How do I get into Google or Meta?”*  
> *“Is my résumé good enough for Big Tech?”*

I saw how worried they were — especially early in college — about whether they had what it takes to stand out. These same questions dominate Discord chats, search trends, and forums like r/cscareerquestions.

I’ve been there too. So I thought:  
**Why not build a tool that does what a Big Tech recruiter would do — and explains why?**  
I’m an engineer, after all.

This project became a way for me to give back to my fellow students while leveling up my own full‑stack skills. It also gave me a chance to explore automated testing using **Jest** and **Django’s test runner** — something I had only heard of before.


