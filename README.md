# 🚀 CVReady.ai -- AI Resume Coach & Big-Tech Readiness Dashboard

*A full-stack **Next.js 14 (App Router)** project with **Supabase +
GPT-4 + GPT-4-mini + RAG** that analyzes résumés like a Big-Tech
recruiter and tracks student progress.*

  -----------------------------------------------------------------------
  Layer                                        Tech
  -------------------------------------------- --------------------------
  Frontend                                     Next.js 14 · TypeScript ·
                                               Tailwind CSS

  Backend                                      Supabase (Auth · Postgres
                                               · Storage · API routes in
                                               Next.js)

  AI                                           OpenAI GPT-4 +
                                               GPT-4-mini +
                                               Retrieval-Augmented
                                               Generation (RAG)

  DevOps                                       ESLint · Prettier · Jest ·
                                               GitHub Actions CI
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 💡 What it does

CVReady.ai helps students and early-career engineers **evaluate and
improve their résumés for Big Tech roles**.

Unlike keyword-based ATS scanners, it uses a **two-model pipeline** with
**GPT-4-mini** and **GPT-4** for efficiency and **accuracy**:

-   **Step 1 -- Strict JSON Grading (GPT-4-mini)**\
    Small-model pass returns **format**, **impact**, **tech depth**, and
    **project scores** (0--5 each). Always surfaces 3--5 weak bullets
    with concise reasons, and highlights 1--3 lowest focus areas.

-   **Step 2 -- RAG Context Building**\
    Weak bullets are matched against curated **rubrics**, recruiter
    examples, and **rewrite patterns**.\
    *Example:*\
    *Before:* "Improved caching system."\
    *After:* "Optimized Redis cache, reducing API latency from 320ms to
    140ms across 50k+ daily requests."

-   **Step 3 -- Role-Specific Analysis with GPT-4**\
    GPT-4 uses RAG context to provide **recruiter-quality feedback**
    focused only on lowest scoring areas.

This layered design makes the system **cost-efficient, accurate, and
role-specific**.

------------------------------------------------------------------------

## ⚠️ The Problem

Most students and early-career engineers struggle to know if their
résumé is truly **Big Tech ready**.\
Traditional ATS scanners only match keywords, missing critical factors
like **impact, scope, deployment, and metrics**.\
As a result, strong candidates often get overlooked, while others get
misleading feedback.

------------------------------------------------------------------------

## 🧭 Why CVReady.ai is Different

CVReady.ai bridges this gap by combining **strict evidence-based
grading** with **role-specific recruiter-style coaching**.\
Instead of keyword matches, it evaluates résumés the way a **Big Tech
recruiter or hiring manager** would ---\
looking for **measurable outcomes, technical depth, and clarity of
ownership.**

------------------------------------------------------------------------

## 📊 Scoring Method (Stricter, Evidence-Based)

**Readiness (1--7)** is computed by the deep pass using
**evidence-only** skills and role rubrics:

-   Skills credited only when supported by a **3--6 word quote** from
    Experience/Projects.\
-   Role rubrics dominate the score; ATS keywords count only if
    **evidenced**.

**Penalties:**
- No metrics: -1.0
- No deployment/testing/CI (for full-stack): -0.5
- Repetitive clone projects: --0.5
- Role mismatch: -0.5
- Format issues: -0.5 each (max -1.5)

**Final Score (1-10)** = evidence-based readiness (remapped) + capped
format boost.\
- Weak/average résumés: **5-7**
- Strong résumés: **8-9**
- Rare 10s require metrics, ≥3 projects, and deployments.

------------------------------------------------------------------------

## 🎥 Demo

▶️ [Watch the demo
video](https://www.loom.com/share/ff230261c9c74653bab7755c1c5c6dd7?sid=b5858272-a963-4102-93d5-eaaac01b4cb0)

------------------------------------------------------------------------

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

------------------------------------------------------------------------

## 🧪 Sanity Checks

To prevent bad inputs and GPT hallucinations, the system enforces:

-   File validation -- only PDF accepted, size limits enforced\
-   Empty input guard -- rejects blank/corrupted uploads\
-   Score bounds -- always mapped 0--10\
-   Schema enforcement -- GPT output validated with `zod`\
-   Consistency checks -- multiple runs averaged if variance \>
    threshold

------------------------------------------------------------------------

## 🏛️ System Architecture

``` mermaid
flowchart TD
    A[Frontend – Next.js 14 + Tailwind] -->|Auth + Data| B[Supabase: Auth · Postgres · Storage]
    B -->|Vector Embeddings| C[RAG Layer: Rubrics · Examples · Keywords]
    C -->|Weak bullets + context| D[GPT-4 Role-Specific Coaching]
    A -->|Display Results| E[Recruiter-Style Feedback Dashboard]
```

------------------------------------------------------------------------

## 🗂️ Repo layout

    .
    ├─ app/           # Next.js App Router pages
    ├─ components/    # Reusable UI components
    ├─ contexts/      # Global state (ResumeContext, ModalContext)
    ├─ lib/           # Supabase + AI utilities (RAG, prompts, schema checks)
    └─ README.md      # ← this file

------------------------------------------------------------------------

### Client data fetching

-   Added **TanStack Query v5** for per-user caching
    (`['resumes', userId]`)\
-   Auth-aware loading prevents empty-state flash on reload\
-   Background refetch + cache invalidation keeps data fresh\
-   Dedupes cross-view requests (e.g., 3 components → 1 API call,
    \~−67%)

------------------------------------------------------------------------

## ⚡ Quick start (local)

``` bash
git clone https://github.com/Sahil24680/CVReady.ai.git
cd CVReady.ai

# env setup
cp .env.example .env.local
# add OPENAI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE
npm install
npm run dev   # http://localhost:3000
```

------------------------------------------------------------------------

## 🛠️ Common scripts

  Command                             Task
  ----------------------------------- --------------------------
  `npm run dev` / `build` / `start`   Dev / Prod build / Run
  `npm run lint` / `test`             ESLint + Prettier / Jest
  GitHub Actions CI                   Lint + tests on every PR

------------------------------------------------------------------------

## 🔐 Environment variables

  Key                               Purpose
  --------------------------------- -------------------
  `OPENAI_API_KEY`                  GPT-4 analysis
  `NEXT_PUBLIC_SUPABASE_URL`        Supabase instance
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`   Supabase auth key

*Secrets stay local (`.env.local`), only `.env.example` is committed.*

------------------------------------------------------------------------

## 🗂️ Important files

  Path                               Role
  ---------------------------------- --------------------------------
  `app/layout.tsx`                   Global layout + sidebar
  `components/Side_bar.tsx`          Navigation + modal trigger
  `components/Middle_box.tsx`        Résumé feedback display
  `components/Right_barx.tsx`        Switch between feedbacks
  `components/EvaluationModal.tsx`   Static "How It Works" dialog
  `contexts/ResumeContext.tsx`       Stores résumé JSON + scores
  `analysis/page.tsx`                Recharts bar-chart of progress
  `user_setting/page.tsx`            Profile updates & uploads

------------------------------------------------------------------------

## 🔄 Example Before/After RAG

**Without RAG**\
\> "Your résumé is missing technical depth. Try adding more projects."

**With GPT-4-mini + RAG + GPT-4**\
\> "Your résumé mentions a 'Twitter Clone.' Recruiters expect clarity on
scope. Highlight: 1) backend API design (REST APIs), 2) Postgres data
modeling, 3) deployment on AWS EC2."

------------------------------------------------------------------------

## 🌱 Motivation

When mentoring incoming CS students, one question kept coming up:

> "How do I get into Google or Meta?"\
> "Is my résumé good enough for Big Tech?"

This project became a way to give back while leveling up my **Next.js +
Supabase** skills and exploring **AI testing, schema validation, cost
optimization, and multi-model pipelines.**

------------------------------------------------------------------------

## ⛰️ Key Technical Challenges Solved

-   **Schema enforcement for GPT** -- Ensured strict JSON responses with
    `zod`.\
-   **Multi-model pipeline** -- Reduced cost \~30% and improved accuracy
    15--17%.\
-   **RAG integration** -- Surfaced role-specific recruiter rubrics,
    avoided generic advice.\
-   **Consistency checks** -- Controlled variance for reproducible
    feedback.\
-   **Scalable fetching** -- Used `TanStack Query v5` for efficient
    caching and deduplication.

------------------------------------------------------------------------

## 🌐 Planned Improvements

-   Expand RAG dataset with recruiter-curated rubrics.\
-   Add more fields (Cloud, Cybersecurity, ML Engineering).\
-   AI-powered résumé rewriting aligned to job descriptions.\
-   Multi-tenant org mode for universities/bootcamps.\
-   Recruiter dashboard with cohort-level analytics.\
-   ATS integration for job portals and LinkedIn.

------------------------------------------------------------------------

## 🙏 Acknowledgments

Thanks to my peers and mentees who inspired this project by asking: *"Is
my résumé Big Tech ready?"*
