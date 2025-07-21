import pytesseract
from pdf2image import convert_from_path
import pdfplumber
import nltk
import spacy
import re
import json
from nltk.corpus import stopwords
from nltk.tokenize import TreebankWordTokenizer
from PIL import Image, ImageEnhance, ImageFilter
from difflib import get_close_matches
import sys

# Setup
nltk.download('stopwords')
nltk.download('punkt')

stop_words = set(stopwords.words('english'))
nlp = spacy.load('en_core_web_sm')
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

COMMON_SKILLS = [
    "python", "java", "c++", "sql", "react", "node", "html", "css", "javascript",
    "aws", "docker", "kubernetes", "machine learning", "data science", "mongodb",
    "flask", "django", "excel", "power bi", "tableau", "git", "github", "pandas",
    "numpy", "communication", "leadership", "teamwork", "problem solving"
]

def extract_text_from_pdf(file_path):
    with pdfplumber.open(file_path) as pdf:
        text = "\n".join(page.extract_text() or "" for page in pdf.pages)
    return text.strip()

def extract_text_from_pdf_ocr(file_path):
    pages = convert_from_path(file_path, dpi=300)
    full_text = ''
    for page in pages:
        image = page.convert('L')
        image = image.filter(ImageFilter.SHARPEN)
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(2)
        text = pytesseract.image_to_string(image)
        full_text += text + '\n'
    return full_text.strip()

def extract_email(text):
    text = text.replace(' ', '')
    emails = re.findall(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)
    return emails[0] if emails else ""

def extract_phone(text):
    match = re.search(r"(\+91[\s-]?)?[0]?[789]\d{9}", text)
    return match.group() if match else ""

def extract_skills(text):
    text = text.lower()
    text = re.sub(r'[^\w\s]', ' ', text)
    tokenizer = TreebankWordTokenizer()
    tokens = tokenizer.tokenize(text)
    tokens = [t for t in tokens if t.isalpha() and t not in stop_words]
    
    matched_skills = set()
    for skill in COMMON_SKILLS:
        skill_tokens = skill.lower().split()
        if all(token in tokens for token in skill_tokens):
            matched_skills.add(skill)
        else:
            close = get_close_matches(skill, tokens, n=1, cutoff=0.85)
            if close:
                matched_skills.add(skill)

    return list(matched_skills)

def compute_score(matched_skills, job_description):
    job_desc = job_description.lower()
    job_desc = re.sub(r'[^\w\s]', ' ', job_desc)
    tokenizer = TreebankWordTokenizer()
    job_tokens = tokenizer.tokenize(job_desc)
    job_tokens = [t for t in job_tokens if t.isalpha()]

    jd_skill_matches = set()
    for skill in COMMON_SKILLS:
        skill_tokens = skill.split()
        if all(word in job_tokens for word in skill_tokens):
            jd_skill_matches.add(skill)

    if not jd_skill_matches:
        return 0.0

    intersection = set(matched_skills) & jd_skill_matches
    return round(len(intersection) / len(jd_skill_matches) * 100, 2)

def main(file_path, job_description):
    text = extract_text_from_pdf(file_path)
    if not text or len(text.strip()) < 100:
        text = extract_text_from_pdf_ocr(file_path)

    email = extract_email(text)
    phone = extract_phone(text)
    skills = extract_skills(text)
    score = compute_score(skills, job_description)

    result = {
        "email": email,
        "phone": phone,
        "skills": skills,
        "score": score
    }

    print(json.dumps(result))  # ✅ Only JSON

if __name__ == "__main__":
    if len(sys.argv) != 3:
        pass  # No print to avoid breaking JSON
    else:
        main(sys.argv[1], sys.argv[2])
