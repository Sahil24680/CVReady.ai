# 📚 CVReady.ai – AI Resume Coach & Big-Tech Readiness Dashboard

*A full-stack **Next.js 14 (App Router)** project with **Supabase + GPT-4 + GPT-4-mini + RAG** that analyzes résumés like a Big-Tech recruiter and tracks student progress.*

| Layer    | Tech |
|----------|------|
| Frontend | Next.js 14 · TypeScript · Tailwind CSS |
| Backend  | Supabase (Auth · Postgres · Storage · API routes in Next.js) |
| AI       | OpenAI GPT-4 + GPT-4-mini + Retrieval-Augmented Generation (RAG) |
| DevOps   | ESLint · Prettier · Jest · GitHub Actions CI |

---

## ✨ What it does

CVReady.ai helps students and early-career engineers **evaluate and improve their résumés for Big Tech roles**.

Unlike keyword-based ATS scanners, it uses a **two-model pipeline** with **GPT-4-mini** and **GPT-4** for efficiency and accuracy:  

- 🟢 Step 1 – Strict JSON Grading (GPT-4-mini)
A conservative small-model pass returns format, impact, tech depth, projects (0–5 each) and always surfaces 3–5 weak bullets with 12–25 word reasons. It also picks 1–3 focus areas (the lowest subscores) that strictly guide coaching.
The grader penalizes clones, missing deployment/testing, absent metrics, unclear scope/ownership, and format issues. This prevents score inflation and forces concrete, fixable feedback.

- 🟢 **Step 2 – RAG Context Building**  
  Weak bullets are passed to the **RAG layer**, which searches curated rubrics, recruiter examples, ATS keywords, and rewrite patterns specific to the role the user chose.  

  **Example (Backend Role):**  
  - **Weak bullet (input):** *"Improved caching system."*  
  - **Rubric guidance:** Backend bullets should highlight measurable performance wins and safe rollouts.  
  - **Rewrite pattern:** *Before: Improved caching → After: Optimized Redis cache and reduced API latency from 320ms to 140ms across 50k+ daily requests.*  
  - **RAG output:** Suggests rewriting the bullet as:  
    *"Optimized Redis caching layer, cutting API latency by 56% for 50k+ daily requests and improving system reliability during peak load."*  

- 🟢 **Step 3 – Role-Specific Analysis with GPT-4**  
  The retrieved context + weak bullets are then passed to GPT-4, which provides role-specific, evidence-driven coaching limited to your lowest scoring focus areas.  
  Example: Instead of saying “add more technical depth,” it may suggest *“For backend roles, emphasize Redis performance optimizations and safe rollouts.”*  

This layered design makes the system **cost-efficient and more accurate**: GPT-4-mini handles cheap but strict scoring, while GPT-4 focuses only on role-specific recruiter-quality feedback.


## 🎯 Scoring Method (Stricter, Evidence-Based)

**Readiness (1–7)** is computed by the deep pass using **evidence-only** skills and role rubrics:
- Skills are credited **only when supported by a 3–6 word quote** from your Experience/Projects (prevents keyword stuffing).
- Role rubrics contribute most of the score; ATS keywords contribute only if **evidenced**.

**Explicit penalties** (applied before mapping to the final 1–10):
- No metrics anywhere: **–1.0**
- No deployment/testing/CI for full-stack roles: **–0.5**
- Repetitive “clone” projects / weak variety: **–0.5**
- Role mismatch (requested role vs content): **–0.5**
- Failed format checks (tense/bullets/length/skills normalization): **–0.5 each** (max **–1.5**)

**Final score (1–10)** = evidence-based readiness (remapped non-linearly) **+ a capped format boost**  
- Format helps but is **capped** so presentation can’t mask weak content.  
- **Deficit cap:** more focus areas ⇒ lower ceiling.  
- **Exemplary gate:** **9.5–10** requires strong evidence (multiple metrics, **≥3** distinct projects, and deployment/testing).

*Outcome: weak/average resumes land ~**5–7**, strong ones **8–9**, and **10** is rare.*


---

## 🔍 Demo

🎥 [Watch the demo video on Loom] https://www.loom.com/share/ff230261c9c74653bab7755c1c5c6dd7?sid=b5858272-a963-4102-93d5-eaaac01b4cb0

---

## 📊 Accuracy, Cost & Feedback Quality Metrics

I benchmarked the résumé analysis pipeline **before vs after GPT-4-mini + RAG + sanity checks**:

| Metric                        | Before (GPT-4 only) | After (GPT-4-mini + RAG + GPT-4) | Improvement |
|-------------------------------|---------------------|-----------------------------------|-------------|
| Accuracy (skill extraction)   | 74.3%               | 90.1%                             | +15.8% |
| Accuracy (project scope)      | 70.5%               | 87.4%                             | +16.9% |
| Consistency across runs       | ±18% variance       | ±6% variance                      | 3× more stable |
| Avg. latency per résumé       | ~5.2s               | ~5.2s                             | — (no change) |
| Avg. cost per analysis        | $0.0265             | $0.0189                           | –29% |
| Feedback quality (subjective) | Generic suggestions | Role-specific, recruiter-style     | Major upgrade |

### Cost Savings by Résumé Type

| Resume Type | Old Cost ($) | New Cost ($) | Savings ($) | Savings (%) |
| ----------- | ------------- | ------------- | ------------ | ----------- |
| **Strong**  | 0.0218        | 0.0098        | 0.0120       | **55.0%**   |
| **Average** | 0.0265        | 0.0200        | 0.0065       | **24.5%**   |
| **Weak**    | 0.0300        | 0.0287        | 0.0013       | **4.3%**    |

**Key Takeaways**
- Accuracy improved **15–17%** thanks to GPT-4-mini grading + RAG context.  
- Outputs became **3× more consistent** across runs.  
- Cost dropped by ~30% due to using GPT-4-mini for strict grading.  
- Feedback went from **generic** (e.g., “add more technical depth”) to **specific & role-aware** (e.g., *“For backend roles, emphasize Redis caching optimizations and measurable outcomes”*).

---

## 🧪 Sanity Checks

To prevent bad inputs and GPT hallucinations, the system enforces:

- ✅ **File validation** – only PDF accepted, size limits enforced.  
- ✅ **Empty input guard** – rejects blank/corrupted uploads.  
- ✅ **Score bounds** – scores always mapped 0–10.  
- ✅ **Schema enforcement** – GPT output validated via zod schema.  
- ✅ **Consistency checks** – multiple runs averaged if variance > threshold.  

These keep feedback **structured, safe, and recruiter-like**.

---

## 📂 Repo layout
```
.
├─ app/           # Next.js App Router pages
├─ components/    # Reusable UI components
├─ contexts/      # Global state (ResumeContext, ModalContext)
├─ lib/           # Supabase + AI utilities (RAG, prompts, schema checks)
└─ README.md      # ← this file
```
---

### 🧱 Architecture: Client data fetching
- Added **TanStack Query v5** for per-user caching (`['resumes', userId]`)
- Auth-aware loading (tri-state) prevents empty-state flash on hard reload
- Background refetch + cache invalidation for refresh (keeps data visible)
- Dedupes cross-view requests (e.g., 3 components → 1 API call, ~−67%)


## 🚀 Quick start (local)

```bash
git clone https://github.com/Sahil24680/CVReady.ai.git
cd CVReady.ai

# env setup
cp .env.example .env.local
# add OPENAI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE (used only when storing embeddings into the vector database; see scripts/Create_Embeddings.ts for how to run the ingestion script).
npm install
npm run dev   # http://localhost:3000
```

---

## 🧰 Common scripts

| Command | Task |
|---------|------|
| `npm run dev` / `build` / `start` | dev / prod build / run |
| `npm run lint` / `test`           | ESLint + Prettier / Jest |
| GitHub Actions CI                 | lint + tests on every PR |

---

## 🔑 Environment variables

| Key | Purpose |
|-----|---------|
| `OPENAI_API_KEY`              | GPT-4 analysis |
| `NEXT_PUBLIC_SUPABASE_URL`    | Supabase instance |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase auth key |

> **Secrets stay local** (git-ignored); only `.env.example` template is committed.

---

## 📂 Important files

| Path | Role |
|------|------|
| `app/layout.tsx`             | global layout + sidebar |
| `components/Side_bar.tsx`    | navigation + modal trigger |
| `components/Middle_box.tsx`  | résumé feedback display |
| `components/Right_barx.tsx`  | switch between feedbacks |
| `components/EvaluationModal.tsx` | static “How It Works” dialog |
| `contexts/ResumeContext.tsx` | stores résumé JSON + scores |
| `analysis/page.tsx`          | Recharts bar-chart of progress |
| `user_setting/page.tsx`      | profile updates & uploads |

---

## 📈 Example Before/After RAG

**Without RAG**  
> “Your résumé is missing technical depth. Try adding more projects.”  

**With GPT-4-mini + RAG + GPT-4**  
> “Your résumé mentions a ‘Twitter Clone.’ Recruiters expect clarity on scope. Highlight: 1) backend API design (REST APIs), 2) Postgres data modeling, 3) deployment on AWS EC2. This shows ownership beyond coding.”  

➡️ The difference: **generic vs recruiter-specific actionable advice**.

---

## 🎓 Motivation

When I started mentoring incoming CS students, one question kept coming up again and again:

> “How do I get into Google or Meta?”  
> “Is my résumé good enough for Big Tech?”

I’ve been there too. So I thought:  
**Why not build a tool that does what a Big Tech recruiter would do — and explains why?**

This project became a way for me to give back to my fellow students while leveling up my **Next.js + Supabase** skills. It also gave me a chance to explore **AI testing, schema validation, cost optimization, and multi-model pipelines (GPT-4-mini + GPT-4)**.

---

## 🔮 Planned Improvements

- [ ] Expand RAG dataset with higher-quality recruiter examples and rubrics.  
- [ ] Broaden coverage to more fields (e.g., Cloud Engineering, Cybersecurity) so feedback is role-specific across domains.  
- [ ] Add AI-powered résumé rewrite suggestions based on Job Descriptions (JD alignment).  

---

## ❤️ Acknowledgments

Thanks to my peers and mentees who kept asking, “Is my résumé Big Tech ready?” — you inspired this project.
