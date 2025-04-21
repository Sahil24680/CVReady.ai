from django.test import TestCase, Client
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from unittest.mock import patch

# Test cases for the resume upload endpoint (/api/upload/)
class ResumeUploadTests(TestCase):
    def setUp(self):
        # Set up test client and URL for each test
        self.client = Client()
        self.url = reverse("upload_file")

    
    def test_no_file_uploaded(self):
        # Sends request without a file, expects 400 error
        response = self.client.post(self.url, HTTP_X_USER_ID="user123")
        self.assertEqual(response.status_code, 400)
        self.assertIn("No file uploaded", response.json()["error"])

    def test_missing_user_id(self):
        # Sends a file without user ID header, expects 401 error
        fake_file = SimpleUploadedFile("resume.pdf", b"PDF content", content_type="application/pdf")
        response = self.client.post(self.url, {"file": fake_file})
        self.assertEqual(response.status_code, 401)
        self.assertIn("Missing user ID", response.json()["error"])

    def test_invalid_mime_type(self):
        # Sends a file with the wrong MIME type, expects 400 error
        fake_file = SimpleUploadedFile("resume.pdf", b"fake content", content_type="text/plain")
        response = self.client.post(self.url, {"file": fake_file}, HTTP_X_USER_ID="user123")
        self.assertEqual(response.status_code, 400)
        self.assertIn("Unsupported file type", response.json()["error"])

    def test_oversized_file(self):
        # Sends a file over the 1MB limit, expects 400 error
        large_content = b"x" * (2 * 1024 * 1024)  # 2MB
        big_file = SimpleUploadedFile("resume.pdf", large_content, content_type="application/pdf")
        response = self.client.post(self.url, {"file": big_file}, HTTP_X_USER_ID="user123")
        self.assertEqual(response.status_code, 400)
        self.assertIn("File too large", response.json()["error"])

    def test_valid_pdf_upload(self):
        # Sends a valid PDF file and mocks GPT + DB save
        with patch("AIResumeCheck.views.extract_text_from_pdf", return_value='{"feedback": {"big_tech_readiness_score": 7, "resume_format_score": 8, "strengths": [], "weaknesses": [], "tips": [], "motivation": "Good job!"}}'), \
             patch("AIResumeCheck.views.save_to_database", return_value=None):

            fake_pdf = SimpleUploadedFile("resume.pdf", b"%PDF-1.4\n...", content_type="application/pdf")
            response = self.client.post(self.url, {"file": fake_pdf}, HTTP_X_USER_ID="user123")
            self.assertEqual(response.status_code, 200)
            self.assertIn("feedback", response.json())
