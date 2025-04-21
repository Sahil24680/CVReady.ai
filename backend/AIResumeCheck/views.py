from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
import pdfplumber
from docx import Document
import openai
import os
import json
import re
from .models import Resume_data 

"""
views.py – Handles resume upload, validation, text extraction (PDF/DOCX),
and GPT-based feedback analysis for resume improvement.

Core Flow:
1. User uploads a resume file (PDF or DOCX).
2. File is validated (type, size, format).
3. Text is extracted (only 1st page for PDF).
4. Text is analyzed using OpenAI (GPT-4).
5. Feedback is saved to database and returned as structured JSON.
"""


client = openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
ALLOWED_EXTENSIONS = [".pdf", ".docx"]
ALLOWED_MIME_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
MAX_FILE_SIZE_MB = 1
MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024


def extract_json_from_response(response_text):
    """ Clean GPT's response to extract just the JSON part only"""
    match = re.search(r"\{.*\}", response_text, re.DOTALL)
    if match:
        return match.group(0)
    raise ValueError("No valid JSON object found in GPT's response.")


def analyze_resume_with_openai(text):
    """
    Sends extracted resume text to OpenAI's GPT model and receives structured 
    career feedback tailored for Big Tech roles.

    The prompt instructs the model to:
    - Score readiness for Big Tech interviews.
    - Identify strengths and weaknesses.
    - Suggest resume and interview improvements.
    - Return motivational, actionable advice.
    
    Returns:
        str: Raw GPT response as a JSON-formatted string (to be parsed later).
    """

    prompt = f"""
You are an elite Big Tech career advisor from companies like Google, Meta, and Amazon.

Speak directly to the candidate using second-person voice (“you”, “your”). Be clear, constructive, and motivational — like a mentor guiding them toward success.

🔍 Your goal is to be highly descriptive, detailed, and example-driven. Break down your reasoning in plain terms. Use real-world interview patterns, analogies, or scenarios when helpful. 

---

Your task:
1. Extract structured insights from the resume (assume raw resume text is already provided).
2. Analyze the candidate’s **readiness for Big Tech roles** and assign a **readiness score (1–10)** based on their skills, education, and experience.
3. Provide **3–5 personalized improvement tips** in 2–5 concise sentences each. Base each one on a skill, concept, or qualification the candidate currently lacks that is important for Big Tech success.

Tips should focus on areas such as:
- High-impact LeetCode topics (e.g., dynamic programming, graphs) → Include a Big‑Tech reference for each (e.g., “Meta frequently asks graph‑traversal problems in its coding rounds”).
- Common coding patterns (e.g., sliding window, DFS/BFS) → State a real company context or project that uses the pattern (e.g., “Netflix’s stream‑windowing analytics relies on sliding‑window techniques”).
- Resume improvements (e.g., quantifying achievements, clarifying impact)

For each tip:
- Explain why it matters
- Use a simple example or analogy
- Use a motivational tone to encourage action

❌ Do not include tips about behavioral interviews or STAR-format responses — that will be added separately.

4. Score **resume clarity and writing quality (1–10)** — based on action verbs, conciseness, STAR format, and tone.
5. Put **Final Thoughts** in the `motivation` field as one plain paragraph (no headings, no line breaks):
   - First 2‑3 sentences → clearly state where the candidate currently stands on their Big‑Tech journey, anchoring at least one fact with a 3‑6‑word résumé quote in *italics*.  
   - Last sentence → close with an uplifting note, e.g.,“Everyone starts somewhere; trust me, every genius once stood where you stand—keep going, you’ve got this!”.  
6. Identify their **strengths** and **weaknesses** in 1–2 sentences each, using 3–6 word resume quotes in (*italics*) as evidence. Explain why each one matters for Big Tech (e.g., impact, scalability, ownership, technical depth).

⚠️ OUTPUT RULES:
- Return only valid JSON (no extra text).
- Follow this exact format:

{{
  "feedback": {{
    "big_tech_readiness_score": 0,
    "resume_format_score": 0,
    "strengths": ["..."],
    "weaknesses": ["..."],
    "tips": ["..."],
    "motivation": "..."
  }}
}}

---

Here is the candidate's resume:
\"\"\"{text}\"\"\"
"""

    response = client.chat.completions.create(
        model="gpt-4",  
        messages=[
            {
                "role": "system",
                "content": "You are an expert Big Tech career advisor (ex-Google, Meta, Amazon) helping junior developers break into top companies. Be direct, supportive, and beginner-friendly."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.5,
    )

    return response.choices[0].message.content



def extract_text_from_pdf(file):
    """Extracts text from the first page of a PDF resume using pdfplumber."""
    with pdfplumber.open(file) as pdf:
        first_page = pdf.pages[0]
        text = first_page.extract_text()
        if text:
            return analyze_resume_with_openai(text)
        return ""


def extract_text_from_docx(file):
    """Extracts all text from a DOCX resume using python-docx."""
    doc = Document(file)
    text_lines = [para.text.strip() for para in doc.paragraphs if para.text.strip()]
    text = "\n".join(text_lines)
    if text:
        return analyze_resume_with_openai(text)
    return ""

def save_to_database(json_file,file_name, user_id):
    """Saves analyzed resume feedback to the Resume_data table."""
    Resume_data.objects.create(
            Resume_name=file_name,
            openai_feedback=json_file,
            user_id=user_id 

        )

# API endpoint
@csrf_exempt
@api_view(['POST'])
def upload_file(request):
    """
    Handles resume uploads from users. Accepts PDF or DOCX files (under 1MB),
    extracts text, sends it to OpenAI for analysis, and stores feedback in DB (supabase).

    Expects: 'file' in request.FILES and 'x-user-id' in headers.
    Returns: JSON response with feedback or error message.
    """
    
    file = print("📥 Upload route hit")
    print("📎 Headers:", request.headers)
    print("📎 FILES:", request.FILES)
    request.FILES.get("file")

    if not file:
        return JsonResponse({"error": "No file uploaded"}, status=400)
    
    
    if file.size > MAX_FILE_SIZE:
        return JsonResponse({
        "error": (
            f"❗ File too large. Your resume is over {MAX_FILE_SIZE_MB}MB. "
            "Make sure it’s only one page and contains clean, readable text. "
            "Avoid using images or scanned PDFs."
        )
        }, status=400)

    name = file.name.lower()
    user_id = request.headers.get("x-user-id")
    if not user_id:
        return JsonResponse({"error": "Missing user ID"}, status=401)

    try:
        # MIME type check
        if file.content_type not in ALLOWED_MIME_TYPES:
            return JsonResponse({"error": "Unsupported file type. File content is not a valid PDF or DOCX."}, status=400)
        
        #  Check extension as additional safeguard — users can rename .exe → .pdf
        if name.endswith(".pdf"):
            raw = extract_text_from_pdf(file)
        elif name.endswith(".docx"):
            raw = extract_text_from_docx(file)
        else:
            return JsonResponse({"error": "Unsupported file type. Only PDF or DOCX files are accepted."}, status=400)

        print("🧠 Raw GPT output:\n", raw)  
        STATIC_TIP = "Prepare for behavioral and situational questions using the **STAR** (Situation, Task, Action, Result) format. Big Tech companies value not just technical skills, but also **soft skills** like **teamwork**, **leadership**, and **problem-solving**. Be ready to share a **situation** where you faced a **challenge**, what **task** you were responsible for, the **action** you took, and the **result** of that action."
        clean_json= extract_json_from_response(raw)  
        parsed_json = json.loads( clean_json)
        if "feedback" in parsed_json and "tips" in parsed_json["feedback"]:
            parsed_json["feedback"]["tips"].append(STATIC_TIP)
        
        



        save_to_database(parsed_json,file.name,user_id)
        return JsonResponse(parsed_json, status=200)

    except Exception as e:
        # Catch any unexpected errors during resume processing (e.g. parsing, OpenAI call, DB save)
        print("❌ Error:", e) 
        return JsonResponse({"error": str(e)}, status=500)
