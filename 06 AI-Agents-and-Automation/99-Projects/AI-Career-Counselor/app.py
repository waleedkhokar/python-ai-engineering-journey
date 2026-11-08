
import json
import re
from typing import Any, Dict, List, Optional, Tuple

import streamlit as st
from groq import Groq


# ============================================================
# Configuration
# ============================================================
DEFAULT_GROQ_MODEL = "openai/gpt-oss-120b"
MAX_TEXT_LENGTH = 1200

EDUCATION_OPTIONS = [
    "Matric / O-Level",
    "Intermediate / A-Level",
    "Diploma",
    "Bachelor's",
    "Master's",
    "Other",
]

AGE_RANGES = ["Under 16", "16–18", "19–22", "23–29", "30+"]

INTERESTS = [
    "Technology", "Science", "Mathematics", "Writing", "Literature",
    "Business", "Entrepreneurship", "Design", "Arts", "Education",
    "Healthcare", "Engineering", "Social sciences", "Communication",
    "Research", "Problem solving", "Working with people", "Working with data",
    "Working with machines", "Creativity",
]

SKILLS = [
    "Communication", "Writing", "Mathematics", "Programming", "Problem solving",
    "Critical thinking", "Creativity", "Research", "Leadership", "Teamwork",
    "Public speaking", "Data analysis", "Design", "Time management",
    "Technical skills",
]

ACTIVITIES = [
    "Solving problems", "Creating things", "Writing", "Helping people",
    "Analyzing information", "Building technology", "Managing projects",
    "Teaching", "Researching", "Designing", "Leading teams",
]

WORK_STYLES = ["Working independently", "Working with a team", "Mix of both"]
ENVIRONMENTS = [
    "Office", "Remote", "Laboratory", "Field work", "Classroom",
    "Creative environment", "Business environment", "Flexible/unknown",
]
PRIORITIES = [
    "High income", "Job stability", "Creativity", "Social impact", "Flexibility",
    "Entrepreneurship", "International opportunities", "Work-life balance",
    "Research", "Leadership",
]
GOALS = [
    "First career", "Career change", "Higher education", "Freelancing",
    "Entrepreneurship", "Government career", "Private-sector career",
    "Remote career", "International career",
]
LEVELS = ["Beginner", "Intermediate", "Advanced"]
RATING_LABELS = {
    1: "Not interested",
    2: "Slightly interested",
    3: "Neutral",
    4: "Interested",
    5: "Very interested",
}

CAREER_DB: Dict[str, Dict[str, Any]] = {
    "Software Developer": {
        "skills": {"Programming": "Advanced", "Problem solving": "Advanced", "Technical skills": "Advanced",
                   "Critical thinking": "Intermediate", "Teamwork": "Intermediate", "Time management": "Intermediate"},
        "interests": {"Technology", "Problem solving", "Mathematics", "Creativity", "Research"},
        "subjects": {"Mathematics", "Computer Science", "Physics", "Technology"},
        "work_styles": {"Working independently", "Working with a team", "Mix of both"},
        "environments": {"Office", "Remote", "Flexible/unknown", "Creative environment"},
        "education": ["Computer Science", "Software Engineering", "Information Technology", "related field"],
        "entry_skills": ["Programming fundamentals", "Git/GitHub", "Debugging", "Problem solving"],
        "projects": ["Personal portfolio website", "Task management app", "REST API project"],
        "technical_intensity": 5, "creativity": 4,
    },
    "Data Analyst": {
        "skills": {"Data analysis": "Advanced", "Mathematics": "Intermediate", "Critical thinking": "Advanced",
                   "Problem solving": "Intermediate", "Technical skills": "Intermediate", "Communication": "Intermediate"},
        "interests": {"Working with data", "Mathematics", "Research", "Problem solving", "Technology"},
        "subjects": {"Mathematics", "Statistics", "Computer Science", "Economics"},
        "work_styles": {"Working independently", "Working with a team", "Mix of both"},
        "environments": {"Office", "Remote", "Business environment", "Flexible/unknown"},
        "education": ["Data Science", "Statistics", "Mathematics", "Computer Science", "related field"],
        "entry_skills": ["Excel/spreadsheets", "SQL", "Data visualization", "Basic statistics"],
        "projects": ["Student performance dashboard", "Sales analysis", "Public dataset exploration"],
        "technical_intensity": 4, "creativity": 3,
    },
    "AI/ML Engineer": {
        "skills": {"Programming": "Advanced", "Mathematics": "Advanced", "Data analysis": "Advanced",
                   "Problem solving": "Advanced", "Critical thinking": "Advanced", "Technical skills": "Advanced"},
        "interests": {"Technology", "Mathematics", "Research", "Working with data", "Problem solving"},
        "subjects": {"Mathematics", "Statistics", "Computer Science", "Physics"},
        "work_styles": {"Working independently", "Working with a team", "Mix of both"},
        "environments": {"Office", "Remote", "Laboratory", "Research", "Flexible/unknown"},
        "education": ["Computer Science", "AI", "Data Science", "Mathematics", "related field"],
        "entry_skills": ["Python", "Linear algebra basics", "Statistics", "Machine learning fundamentals"],
        "projects": ["Prediction model", "Recommendation prototype", "Document classification app"],
        "technical_intensity": 5, "creativity": 4,
    },
    "Cybersecurity Analyst": {
        "skills": {"Technical skills": "Advanced", "Critical thinking": "Advanced", "Problem solving": "Advanced",
                   "Research": "Intermediate", "Programming": "Intermediate", "Communication": "Intermediate"},
        "interests": {"Technology", "Problem solving", "Research", "Working with data"},
        "subjects": {"Computer Science", "Mathematics", "Physics", "Technology"},
        "work_styles": {"Working independently", "Working with a team", "Mix of both"},
        "environments": {"Office", "Remote", "Flexible/unknown"},
        "education": ["Cybersecurity", "Computer Science", "Information Technology", "related field"],
        "entry_skills": ["Networking basics", "Linux basics", "Security fundamentals", "Log analysis"],
        "projects": ["Security log analyzer", "Phishing-awareness simulator", "Home lab documentation"],
        "technical_intensity": 5, "creativity": 3,
    },
    "Civil Engineer": {
        "skills": {"Mathematics": "Advanced", "Problem solving": "Advanced", "Technical skills": "Advanced",
                   "Critical thinking": "Intermediate", "Teamwork": "Intermediate", "Time management": "Intermediate"},
        "interests": {"Engineering", "Mathematics", "Science", "Problem solving", "Working with machines"},
        "subjects": {"Mathematics", "Physics", "Engineering", "Chemistry"},
        "work_styles": {"Working with a team", "Mix of both"},
        "environments": {"Field work", "Office", "Flexible/unknown"},
        "education": ["Civil Engineering", "related engineering degree"],
        "entry_skills": ["Engineering mathematics", "Engineering drawing", "Materials basics", "Site safety"],
        "projects": ["Small structural design study", "Drainage design exercise", "Quantity takeoff portfolio"],
        "technical_intensity": 5, "creativity": 3,
    },
    "Mechanical Engineer": {
        "skills": {"Mathematics": "Advanced", "Problem solving": "Advanced", "Technical skills": "Advanced",
                   "Critical thinking": "Intermediate", "Teamwork": "Intermediate", "Creativity": "Intermediate"},
        "interests": {"Engineering", "Mathematics", "Science", "Working with machines", "Problem solving"},
        "subjects": {"Mathematics", "Physics", "Engineering"},
        "work_styles": {"Working with a team", "Mix of both"},
        "environments": {"Field work", "Office", "Laboratory"},
        "education": ["Mechanical Engineering", "related engineering degree"],
        "entry_skills": ["Engineering mathematics", "CAD basics", "Mechanics", "Materials"],
        "projects": ["CAD mechanism", "Energy-efficiency study", "Mechanical prototype"],
        "technical_intensity": 5, "creativity": 4,
    },
    "Electrical Engineer": {
        "skills": {"Mathematics": "Advanced", "Problem solving": "Advanced", "Technical skills": "Advanced",
                   "Critical thinking": "Advanced", "Programming": "Intermediate", "Teamwork": "Intermediate"},
        "interests": {"Engineering", "Mathematics", "Technology", "Working with machines", "Problem solving"},
        "subjects": {"Mathematics", "Physics", "Engineering", "Computer Science"},
        "work_styles": {"Working independently", "Working with a team", "Mix of both"},
        "environments": {"Laboratory", "Field work", "Office"},
        "education": ["Electrical Engineering", "Electronics Engineering", "related field"],
        "entry_skills": ["Circuit fundamentals", "Engineering mathematics", "Electronics", "Technical documentation"],
        "projects": ["Smart home prototype", "Circuit simulation", "Energy monitoring project"],
        "technical_intensity": 5, "creativity": 4,
    },
    "UX/UI Designer": {
        "skills": {"Design": "Advanced", "Creativity": "Advanced", "Critical thinking": "Intermediate",
                   "Communication": "Intermediate", "Research": "Intermediate", "Technical skills": "Intermediate"},
        "interests": {"Design", "Arts", "Creativity", "Technology", "Working with people", "Problem solving"},
        "subjects": {"Art", "Design", "Computer Science", "Psychology"},
        "work_styles": {"Working independently", "Working with a team", "Mix of both"},
        "environments": {"Creative environment", "Remote", "Office"},
        "education": ["Design", "HCI", "Computer Science", "related field"],
        "entry_skills": ["Design principles", "Figma or equivalent", "User research", "Prototyping"],
        "projects": ["Mobile app redesign", "Student portal prototype", "Accessibility audit"],
        "technical_intensity": 3, "creativity": 5,
    },
    "Graphic Designer": {
        "skills": {"Design": "Advanced", "Creativity": "Advanced", "Communication": "Intermediate",
                   "Technical skills": "Intermediate", "Time management": "Intermediate"},
        "interests": {"Design", "Arts", "Creativity", "Writing"},
        "subjects": {"Art", "Design", "Media"},
        "work_styles": {"Working independently", "Working with a team", "Mix of both"},
        "environments": {"Creative environment", "Remote", "Office"},
        "education": ["Graphic Design", "Visual Communication", "related field"],
        "entry_skills": ["Typography", "Composition", "Design software", "Branding basics"],
        "projects": ["Brand identity", "Poster series", "Social media design system"],
        "technical_intensity": 2, "creativity": 5,
    },
    "Content Writer": {
        "skills": {"Writing": "Advanced", "Communication": "Advanced", "Research": "Intermediate",
                   "Creativity": "Advanced", "Critical thinking": "Intermediate", "Time management": "Intermediate"},
        "interests": {"Writing", "Literature", "Communication", "Creativity", "Research"},
        "subjects": {"English", "Literature", "Social sciences", "History"},
        "work_styles": {"Working independently", "Working with a team", "Mix of both"},
        "environments": {"Remote", "Creative environment", "Office", "Flexible/unknown"},
        "education": ["English", "Literature", "Communications", "Journalism", "related field"],
        "entry_skills": ["Clear writing", "Editing", "Research", "Audience awareness"],
        "projects": ["Niche blog", "Editorial portfolio", "Explainer article series"],
        "technical_intensity": 1, "creativity": 5,
    },
    "Technical Writer": {
        "skills": {"Writing": "Advanced", "Communication": "Advanced", "Research": "Advanced",
                   "Technical skills": "Intermediate", "Critical thinking": "Intermediate", "Time management": "Intermediate"},
        "interests": {"Writing", "Technology", "Communication", "Research", "Problem solving"},
        "subjects": {"English", "Computer Science", "Technology", "Science"},
        "work_styles": {"Working independently", "Working with a team", "Mix of both"},
        "environments": {"Remote", "Office", "Creative environment", "Flexible/unknown"},
        "education": ["English", "Communications", "Computer Science", "technical discipline", "related field"],
        "entry_skills": ["Technical documentation", "Markdown", "Information architecture", "Basic Git/GitHub"],
        "projects": ["API documentation sample", "Software user guide", "Open-source documentation contribution"],
        "technical_intensity": 3, "creativity": 4,
    },
    "Teacher": {
        "skills": {"Communication": "Advanced", "Public speaking": "Advanced", "Research": "Intermediate",
                   "Teamwork": "Intermediate", "Time management": "Advanced", "Creativity": "Intermediate"},
        "interests": {"Education", "Working with people", "Communication", "Writing", "Helping people"},
        "subjects": {"Education", "English", "Mathematics", "Science", "Social sciences"},
        "work_styles": {"Working with a team", "Mix of both"},
        "environments": {"Classroom", "Office", "Flexible/unknown"},
        "education": ["Education", "subject-specific bachelor's", "relevant teaching qualification where required"],
        "entry_skills": ["Lesson planning", "Communication", "Assessment", "Classroom management"],
        "projects": ["Mini teaching portfolio", "Lesson-plan collection", "Interactive learning resource"],
        "technical_intensity": 1, "creativity": 4,
    },
    "Lecturer": {
        "skills": {"Communication": "Advanced", "Public speaking": "Advanced", "Research": "Advanced",
                   "Writing": "Advanced", "Critical thinking": "Advanced"},
        "interests": {"Education", "Research", "Writing", "Communication", "Problem solving"},
        "subjects": {"Education", "English", "Science", "Mathematics", "Social sciences"},
        "work_styles": {"Working independently", "Working with a team", "Mix of both"},
        "environments": {"Classroom", "Laboratory", "Office"},
        "education": ["Relevant master's or higher degree depending on institution and jurisdiction"],
        "entry_skills": ["Academic writing", "Research methods", "Presentation", "Subject expertise"],
        "projects": ["Research poster", "Teaching portfolio", "Literature review"],
        "technical_intensity": 2, "creativity": 4,
    },
    "Researcher": {
        "skills": {"Research": "Advanced", "Critical thinking": "Advanced", "Problem solving": "Advanced",
                   "Writing": "Advanced", "Data analysis": "Intermediate", "Communication": "Intermediate"},
        "interests": {"Research", "Science", "Technology", "Mathematics", "Writing", "Problem solving"},
        "subjects": {"Science", "Mathematics", "Computer Science", "Social sciences"},
        "work_styles": {"Working independently", "Working with a team"},
        "environments": {"Laboratory", "Office", "Field work"},
        "education": ["Relevant bachelor's/master's; advanced research roles may require a doctorate"],
        "entry_skills": ["Research methods", "Academic writing", "Data handling", "Literature review"],
        "projects": ["Mini research study", "Literature review", "Public dataset research"],
        "technical_intensity": 3, "creativity": 4,
    },
    "Digital Marketer": {
        "skills": {"Communication": "Advanced", "Writing": "Advanced", "Creativity": "Advanced",
                   "Data analysis": "Intermediate", "Research": "Intermediate", "Design": "Intermediate"},
        "interests": {"Business", "Communication", "Creativity", "Writing", "Working with data"},
        "subjects": {"Business", "Marketing", "English", "Economics", "Mathematics"},
        "work_styles": {"Working independently", "Working with a team", "Mix of both"},
        "environments": {"Remote", "Business environment", "Creative environment", "Office"},
        "education": ["Marketing", "Business", "Communications", "related field; portfolios can be important"],
        "entry_skills": ["Content strategy", "Analytics basics", "SEO basics", "Campaign planning"],
        "projects": ["Mock campaign", "SEO content audit", "Social media strategy"],
        "technical_intensity": 2, "creativity": 5,
    },
    "Business Analyst": {
        "skills": {"Critical thinking": "Advanced", "Communication": "Advanced", "Data analysis": "Intermediate",
                   "Problem solving": "Advanced", "Research": "Intermediate", "Teamwork": "Advanced"},
        "interests": {"Business", "Problem solving", "Working with data", "Communication", "Research"},
        "subjects": {"Business", "Economics", "Mathematics", "Statistics", "Computer Science"},
        "work_styles": {"Working with a team", "Mix of both"},
        "environments": {"Office", "Remote", "Business environment"},
        "education": ["Business", "Economics", "Information Systems", "Computer Science", "related field"],
        "entry_skills": ["Requirements analysis", "Excel", "Process mapping", "Presentation"],
        "projects": ["Process improvement case study", "Business dashboard", "Requirements document"],
        "technical_intensity": 3, "creativity": 3,
    },
    "Entrepreneur": {
        "skills": {"Communication": "Advanced", "Creativity": "Advanced", "Problem solving": "Advanced",
                   "Leadership": "Advanced", "Time management": "Advanced", "Research": "Intermediate"},
        "interests": {"Business", "Entrepreneurship", "Creativity", "Problem solving", "Communication", "Leadership"},
        "subjects": {"Business", "Economics", "Mathematics", "Social sciences"},
        "work_styles": {"Working independently", "Working with a team"},
        "environments": {"Business environment", "Remote", "Flexible/unknown", "Creative environment"},
        "education": ["No single mandatory degree; business/technical/domain education can help"],
        "entry_skills": ["Customer discovery", "Communication", "Basic finance", "Experimentation"],
        "projects": ["Problem-validation study", "Small digital product", "Lean business experiment"],
        "technical_intensity": 2, "creativity": 5,
    },
    "Financial Analyst": {
        "skills": {"Mathematics": "Advanced", "Data analysis": "Advanced", "Critical thinking": "Advanced",
                   "Research": "Intermediate", "Communication": "Intermediate", "Technical skills": "Intermediate"},
        "interests": {"Business", "Mathematics", "Working with data", "Research", "Problem solving"},
        "subjects": {"Mathematics", "Economics", "Accounting", "Statistics", "Business"},
        "work_styles": {"Working independently", "Working with a team", "Mix of both"},
        "environments": {"Office", "Business environment"},
        "education": ["Finance", "Accounting", "Economics", "Mathematics", "related field"],
        "entry_skills": ["Excel", "Financial statements", "Statistics", "Data visualization"],
        "projects": ["Company financial analysis", "Budget model", "Market-data dashboard"],
        "technical_intensity": 3, "creativity": 2,
    },
    "Environmental Scientist": {
        "skills": {"Research": "Advanced", "Science": "Advanced", "Critical thinking": "Advanced",
                   "Data analysis": "Intermediate", "Communication": "Intermediate", "Problem solving": "Advanced"},
        "interests": {"Science", "Research", "Working with data", "Problem solving", "Field work"},
        "subjects": {"Biology", "Chemistry", "Environmental science", "Geography", "Mathematics"},
        "work_styles": {"Working independently", "Working with a team", "Mix of both"},
        "environments": {"Laboratory", "Field work", "Office"},
        "education": ["Environmental Science", "Environmental Engineering", "Biology", "Chemistry", "related field"],
        "entry_skills": ["Scientific method", "Data collection", "Report writing", "Environmental fundamentals"],
        "projects": ["Local water-quality study", "Waste audit", "Environmental data dashboard"],
        "technical_intensity": 3, "creativity": 3,
    },
    "Project Manager": {
        "skills": {"Leadership": "Advanced", "Communication": "Advanced", "Teamwork": "Advanced",
                   "Time management": "Advanced", "Problem solving": "Advanced", "Technical skills": "Intermediate"},
        "interests": {"Managing projects", "Leadership", "Working with people", "Problem solving", "Business"},
        "subjects": {"Business", "Management", "Computer Science", "Engineering", "Social sciences"},
        "work_styles": {"Working with a team", "Mix of both"},
        "environments": {"Office", "Remote", "Business environment", "Flexible/unknown"},
        "education": ["Management", "Business", "Engineering", "Computer Science", "related field"],
        "entry_skills": ["Planning", "Communication", "Risk tracking", "Stakeholder management"],
        "projects": ["Mock project plan", "Event delivery plan", "Agile sprint simulation"],
        "technical_intensity": 3, "creativity": 3,
    },
    "UX Writer": {
        "skills": {"Writing": "Advanced", "Communication": "Advanced", "Creativity": "Advanced",
                   "Research": "Intermediate", "Design": "Intermediate", "Critical thinking": "Intermediate"},
        "interests": {"Writing", "Design", "Technology", "Creativity", "Communication", "Working with people"},
        "subjects": {"English", "Literature", "Design", "Psychology", "Computer Science"},
        "work_styles": {"Working independently", "Working with a team", "Mix of both"},
        "environments": {"Creative environment", "Remote", "Office"},
        "education": ["English", "Design", "HCI", "Communications", "related field"],
        "entry_skills": ["Microcopy", "Content design", "User research", "Basic UX principles"],
        "projects": ["App microcopy redesign", "Onboarding flow", "Accessibility copy audit"],
        "technical_intensity": 2, "creativity": 5,
    },
    "Instructional Designer": {
        "skills": {"Writing": "Advanced", "Communication": "Advanced", "Creativity": "Advanced",
                   "Research": "Intermediate", "Design": "Intermediate", "Technical skills": "Intermediate"},
        "interests": {"Education", "Writing", "Design", "Technology", "Creativity", "Research"},
        "subjects": {"Education", "English", "Design", "Computer Science", "Psychology"},
        "work_styles": {"Working independently", "Working with a team", "Mix of both"},
        "environments": {"Remote", "Classroom", "Creative environment", "Office"},
        "education": ["Education", "Instructional Design", "Communications", "subject/domain degree"],
        "entry_skills": ["Learning objectives", "Content design", "Assessment design", "Authoring tools"],
        "projects": ["Mini online course", "Interactive lesson", "Learning module storyboard"],
        "technical_intensity": 2, "creativity": 5,
    },
}


# ============================================================
# Helpers
# ============================================================
def init_state() -> None:
    defaults = {
        "page": "Dashboard",
        "profile": {},
        "interests": {},
        "skills": {},
        "career_results": [],
        "selected_career": None,
        "ai_cache": {},
        "chat_history": [],
        "weekly_hours": 6,
    }
    for key, value in defaults.items():
        if key not in st.session_state:
            st.session_state[key] = value


def clean_text(value: str, max_len: int = MAX_TEXT_LENGTH) -> str:
    value = (value or "").strip()
    return value[:max_len]


def safe_secrets_get(key: str) -> Optional[str]:
    try:
        value = st.secrets.get(key)
        return str(value).strip() if value else None
    except Exception:
        return None


def get_model() -> str:
    return safe_secrets_get("GROQ_MODEL") or DEFAULT_GROQ_MODEL


def call_groq(system_prompt: str, user_prompt: str, temperature: float = 0.2,
              max_tokens: int = 1800) -> Optional[str]:
    api_key = safe_secrets_get("GROQ_API_KEY")
    if not api_key:
        st.warning("Groq is not configured yet. Add GROQ_API_KEY to Streamlit Secrets to enable AI-generated explanations, roadmaps, projects, and chat.")
        return None
    try:
        client = Groq(api_key=api_key)
        response = client.chat.completions.create(
            model=get_model(),
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=temperature,
            max_tokens=max_tokens,
        )
        content = response.choices[0].message.content
        if not content or not content.strip():
            st.error("The AI returned an empty response. Please try again.")
            return None
        return content.strip()
    except Exception as exc:
        message = str(exc).lower()
        if "401" in message or "authentication" in message or "api key" in message:
            st.error("The Groq API key appears to be invalid. Please check your Streamlit Secrets.")
        elif "429" in message or "rate" in message:
            st.error("The AI counselor is temporarily rate-limited. Please wait a moment and try again.")
        elif "model" in message and ("not found" in message or "404" in message):
            st.error(f"The configured Groq model '{get_model()}' is unavailable. Update GROQ_MODEL in Secrets.")
        else:
            st.error("The AI counselor is temporarily unavailable. Please check your API configuration and try again.")
        return None


def level_value(level: str) -> int:
    return {"Beginner": 1, "Intermediate": 2, "Advanced": 3}.get(level, 0)


def normalize_score(score: float) -> int:
    return max(0, min(100, round(score)))


def match_category(score: int) -> Tuple[str, str]:
    if score >= 80:
        return "Strong Match", "🟢"
    if score >= 60:
        return "Good Match", "🟡"
    if score >= 40:
        return "Explore", "🟠"
    return "Low Match", "⚪"


def build_profile() -> Dict[str, Any]:
    return {
        **st.session_state.get("profile", {}),
        "interests": st.session_state.get("interests", {}),
        "skills": st.session_state.get("skills", {}),
    }


def calculate_career_match(career_name: str, profile: Dict[str, Any]) -> int:
    career = CAREER_DB[career_name]
    score = 0.0
    max_score = 0.0

    interest_ratings = profile.get("interests", {})
    for interest in career["interests"]:
        max_score += 2.0
        rating = int(interest_ratings.get(interest, 0))
        score += (rating / 5) * 2.0

    skill_levels = profile.get("skills", {})
    for skill, required in career["skills"].items():
        max_score += 2.0
        current = level_value(skill_levels.get(skill, "Beginner"))
        required_value = level_value(required)
        if current >= required_value:
            score += 2.0
        elif current == required_value - 1:
            score += 1.0
        else:
            score += 0.2

    favorite_subjects = set(profile.get("favorite_subjects", []))
    strongest_subjects = set(profile.get("strongest_subjects", []))
    subjects = favorite_subjects | strongest_subjects
    max_score += 3.0
    if subjects & career["subjects"]:
        score += 3.0
    elif subjects:
        score += 1.0

    work_style = profile.get("work_style")
    max_score += 1.5
    if work_style in career["work_styles"]:
        score += 1.5
    elif work_style:
        score += 0.6

    environment = profile.get("environment")
    max_score += 1.5
    if environment in career["environments"]:
        score += 1.5
    elif environment:
        score += 0.6

    activities = set(profile.get("activities", []))
    activity_map = {
        "Solving problems": {"Problem solving"},
        "Creating things": {"Creativity"},
        "Writing": {"Writing"},
        "Helping people": {"Education", "Healthcare", "Working with people"},
        "Analyzing information": {"Working with data", "Research"},
        "Building technology": {"Technology"},
        "Managing projects": {"Business", "Leadership"},
        "Teaching": {"Education"},
        "Researching": {"Research"},
        "Designing": {"Design", "Creativity"},
        "Leading teams": {"Leadership", "Working with people"},
    }
    aligned_activities = set()
    for activity in activities:
        aligned_activities |= activity_map.get(activity, set())
    max_score += 2.0
    if aligned_activities & career["interests"]:
        score += 2.0
    elif activities:
        score += 0.7

    # Priorities are a light tie-breaker rather than a claim about salary.
    priorities = set(profile.get("priorities", []))
    if "Creativity" in priorities and career["creativity"] >= 4:
        score += 0.5
        max_score += 0.5
    if "Research" in priorities and "Research" in career["interests"]:
        score += 0.5
        max_score += 0.5
    if "Flexibility" in priorities and "Remote" in career["environments"]:
        score += 0.5
        max_score += 0.5

    return normalize_score((score / max_score) * 100 if max_score else 0)


def calculate_all_matches(profile: Dict[str, Any]) -> List[Dict[str, Any]]:
    results = []
    for career_name in CAREER_DB:
        score = calculate_career_match(career_name, profile)
        category, icon = match_category(score)
        results.append({
            "career": career_name,
            "score": score,
            "category": category,
            "icon": icon,
        })
    return sorted(results, key=lambda x: (-x["score"], x["career"]))


def skill_gap(career_name: str, profile: Dict[str, Any]) -> List[Dict[str, Any]]:
    current = profile.get("skills", {})
    rows = []
    for skill, required in CAREER_DB[career_name]["skills"].items():
        cur = current.get(skill, "Beginner")
        diff = level_value(required) - level_value(cur)
        if diff <= 0:
            status = "Ready"
            icon = "🟢"
        elif diff == 1:
            status = "Moderate gap"
            icon = "🟡"
        else:
            status = "High gap"
            icon = "🔴"
        rows.append({"skill": skill, "current": cur, "required": required, "gap": status, "icon": icon})
    return rows


def profile_summary(profile: Dict[str, Any]) -> str:
    top_interests = sorted(profile.get("interests", {}).items(), key=lambda x: x[1], reverse=True)[:6]
    return json.dumps({
        "name": profile.get("name", ""),
        "age_range": profile.get("age_range", ""),
        "region": profile.get("region", ""),
        "education_level": profile.get("education_level", ""),
        "major": profile.get("major", ""),
        "favorite_subjects": profile.get("favorite_subjects", []),
        "strongest_subjects": profile.get("strongest_subjects", []),
        "disliked_subjects": profile.get("disliked_subjects", []),
        "top_interests": top_interests,
        "skills": profile.get("skills", {}),
        "favorite_skills": profile.get("favorite_skills", []),
        "activities": profile.get("activities", []),
        "work_style": profile.get("work_style", ""),
        "environment": profile.get("environment", ""),
        "priorities": profile.get("priorities", []),
        "goal_type": profile.get("goal_type", ""),
        "long_term_goal": profile.get("long_term_goal", ""),
        "weekly_hours": profile.get("weekly_hours", 6),
    }, indent=2)


# ============================================================
# Modular AI prompts
# ============================================================
def build_career_explanation_prompt(profile: Dict[str, Any], career_name: str, score: int) -> str:
    return f"""
You are a professional, supportive career counselor. Give evidence-based educational guidance, not a guaranteed prediction.
Explain why the selected career may fit this student using ONLY the provided profile and deterministic match score.

Student profile:
{profile_summary(profile)}

Selected career: {career_name}
Estimated compatibility score: {score}/100

Career database signals:
{json.dumps(CAREER_DB[career_name], indent=2)}

Return these headings:
## Why It Fits
## Relevant Strengths
## Academic Alignment
## Work-Preference Alignment
## Potential Challenges
## Bottom Line

Be specific to the student. Mention uncertainty where appropriate. Never say the student "must" choose this career and do not promise jobs or salaries.
"""


def build_skill_gap_prompt(profile: Dict[str, Any], career_name: str, gaps: List[Dict[str, Any]]) -> str:
    return f"""
Act as a career skills mentor. Explain the student's skill gaps for {career_name}.
Student:
{profile_summary(profile)}

Deterministic skill-gap data:
{json.dumps(gaps, indent=2)}

Write:
## What You Already Have
## Highest-Priority Gaps
## How to Close Each Gap
## Suggested Order

Keep advice practical for a student. Do not invent exact salary or employment claims.
"""


def build_roadmap_prompt(profile: Dict[str, Any], career_name: str, gaps: List[Dict[str, Any]]) -> str:
    return f"""
Create a realistic personalized learning roadmap for a student exploring {career_name}.
Student profile:
{profile_summary(profile)}

Skill gaps:
{json.dumps(gaps, indent=2)}

Available weekly study time: {profile.get("weekly_hours", 6)} hours.

Create 4 stages:
1. Foundation
2. Core Skills
3. Portfolio
4. Career Preparation

For every stage include: goals, topics, practice, and a reasonable completion range. Prefer sequencing over arbitrary promises. Include free/low-cost learning directions without inventing specific course URLs. Do not promise employment.
"""


def build_portfolio_prompt(profile: Dict[str, Any], career_name: str) -> str:
    return f"""
Generate 4 portfolio projects for a student exploring {career_name}.
Student:
{profile_summary(profile)}

Career database:
{json.dumps(CAREER_DB[career_name], indent=2)}

Return each project with:
- Project title
- Problem it solves
- Skills practiced
- Difficulty
- Expected outcome
- Suggested technologies

Start at the student's current level and progressively increase difficulty. Avoid projects that require sensitive personal data.
"""


def build_reality_check_prompt(profile: Dict[str, Any], career_name: str) -> str:
    return f"""
Provide a candid career reality check for {career_name}.
Student profile:
{profile_summary(profile)}

Cover:
## What This Career Actually Involves
## Skills You Really Need
## Common Misconceptions
## Typical Entry-Level Challenges
## What Beginners Often Underestimate
## Who May Not Enjoy This Career
## Questions You Should Ask Yourself

Be balanced. Do not discourage the student unnecessarily, and do not guarantee income or employment.
"""


def build_chat_prompt(profile: Dict[str, Any], selected_career: Optional[str], history: List[Dict[str, str]], question: str) -> str:
    return f"""
You are the student's personal career counselor.
Use the student's profile and selected career as context. Give practical, personalized guidance.
Do not make decisions for the student, guarantee a job, or present match scores as scientific predictions.
If information is missing, say what is missing and give a useful conditional answer.

Student:
{profile_summary(profile)}

Selected career:
{selected_career or "None"}

Recent conversation:
{json.dumps(history[-8:], indent=2)}

Student question:
{clean_text(question)}
"""


# ============================================================
# UI pages
# ============================================================
def home_page() -> None:
    st.title("🎓 AI Career Counselor")
    st.subheader("Discover Your Career. Understand Your Skills. Build Your Path.")
    st.write(
        "AI Career Counselor helps students explore career options based on their "
        "interests, strengths, academic background, skills, preferences, and goals."
    )
    if st.button("🚀 Start Career Assessment", type="primary", use_container_width=True):
        st.session_state.page = "My Profile"
        st.rerun()

    st.markdown("### How It Works")
    cols = st.columns(5)
    steps = [
        ("1", "Tell us about yourself"),
        ("2", "Discover your career matches"),
        ("3", "Understand your skill gaps"),
        ("4", "Build your learning roadmap"),
        ("5", "Take your next step"),
    ]
    for col, (n, text) in zip(cols, steps):
        with col:
            st.metric(n, text)

    st.info(
        "Your match score is an estimate based on the information you provide. "
        "It is designed to help you explore options, not determine your future."
    )


def profile_page() -> None:
    st.header("👤 My Profile")
    with st.form("profile_form"):
        c1, c2 = st.columns(2)
        with c1:
            name = st.text_input("Name (optional)", value=st.session_state.profile.get("name", ""))
            age_range = st.selectbox("Age range", AGE_RANGES, index=AGE_RANGES.index(st.session_state.profile.get("age_range", AGE_RANGES[1])))
            education = st.selectbox("Current education level", EDUCATION_OPTIONS, index=EDUCATION_OPTIONS.index(st.session_state.profile.get("education_level", EDUCATION_OPTIONS[1])))
        with c2:
            region = st.text_input("Country/region (optional)", value=st.session_state.profile.get("region", ""))
            major = st.text_input("Major / field", value=st.session_state.profile.get("major", ""))

        st.markdown("### Academic Background")
        favorite_subjects = st.multiselect(
            "Favorite subjects",
            sorted({"Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "English", "Literature",
                    "History", "Geography", "Economics", "Accounting", "Business", "Statistics", "Art", "Design",
                    "Psychology", "Environmental science", "Engineering", "Social sciences", "Education", "Technology"}),
            default=st.session_state.profile.get("favorite_subjects", []),
        )
        strongest_subjects = st.multiselect(
            "Strongest subjects",
            sorted({"Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "English", "Literature",
                    "History", "Geography", "Economics", "Accounting", "Business", "Statistics", "Art", "Design",
                    "Psychology", "Environmental science", "Engineering", "Social sciences", "Education", "Technology"}),
            default=st.session_state.profile.get("strongest_subjects", []),
        )
        disliked_subjects = st.multiselect(
            "Subjects you dislike",
            sorted({"Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "English", "Literature",
                    "History", "Geography", "Economics", "Accounting", "Business", "Statistics", "Art", "Design",
                    "Psychology", "Environmental science", "Engineering", "Social sciences", "Education", "Technology"}),
            default=st.session_state.profile.get("disliked_subjects", []),
        )

        st.markdown("### Study Time")
        weekly_hours = st.slider("How many hours can you realistically study per week?", 1, 30, int(st.session_state.profile.get("weekly_hours", 6)))

        submitted = st.form_submit_button("Save Profile", type="primary")
        if submitted:
            if not education:
                st.error("Please select your current education level.")
            elif len(major) > MAX_TEXT_LENGTH:
                st.error("Major/field is too long.")
            else:
                st.session_state.profile.update({
                    "name": clean_text(name, 100),
                    "age_range": age_range,
                    "region": clean_text(region, 100),
                    "education_level": education,
                    "major": clean_text(major, 200),
                    "favorite_subjects": favorite_subjects,
                    "strongest_subjects": strongest_subjects,
                    "disliked_subjects": disliked_subjects,
                    "weekly_hours": weekly_hours,
                })
                st.success("Profile saved.")
                st.session_state.page = "Interest Assessment"
                st.rerun()


def interest_page() -> None:
    st.header("🧠 Interest Assessment")
    st.caption("Rate each area from 1 (Not interested) to 5 (Very interested).")
    with st.form("interest_form"):
        ratings = {}
        for interest in INTERESTS:
            current = int(st.session_state.interests.get(interest, 3))
            ratings[interest] = st.slider(
                interest, 1, 5, current, format="%d",
                help=f"1 = {RATING_LABELS[1]}, 5 = {RATING_LABELS[5]}",
            )
        if st.form_submit_button("Save Interest Assessment", type="primary"):
            st.session_state.interests = ratings
            st.session_state.profile["interests"] = ratings
            st.success("Interest assessment saved.")
            st.session_state.page = "Skills Assessment"
            st.rerun()


def skills_page() -> None:
    st.header("🛠️ Skills Assessment")
    with st.form("skills_form"):
        ratings = {}
        for skill in SKILLS:
            current = st.session_state.skills.get(skill, "Beginner")
            ratings[skill] = st.select_slider(
                skill, options=LEVELS, value=current,
            )
        favorite_skills = st.multiselect(
            "Which skills do you enjoy using most?",
            SKILLS,
            default=st.session_state.profile.get("favorite_skills", []),
        )
        activities = st.multiselect(
            "What do you enjoy doing?",
            ACTIVITIES,
            default=st.session_state.profile.get("activities", []),
        )
        work_style = st.radio(
            "Preferred work style",
            WORK_STYLES,
            index=WORK_STYLES.index(st.session_state.profile.get("work_style", WORK_STYLES[2])),
        )
        environment = st.selectbox(
            "Preferred environment",
            ENVIRONMENTS,
            index=ENVIRONMENTS.index(st.session_state.profile.get("environment", ENVIRONMENTS[-1])),
        )
        priorities = st.multiselect(
            "Career priorities",
            PRIORITIES,
            default=st.session_state.profile.get("priorities", []),
        )
        goal_type = st.multiselect(
            "What are you looking for?",
            GOALS,
            default=st.session_state.profile.get("goal_type", []),
        )
        long_term_goal = st.text_area(
            "What is your long-term goal?",
            value=st.session_state.profile.get("long_term_goal", ""),
            max_chars=MAX_TEXT_LENGTH,
            placeholder="Example: I want a flexible career where I can combine writing and technology.",
        )
        if st.form_submit_button("Analyze My Career Options", type="primary"):
            if not long_term_goal.strip():
                st.warning("A long-term goal helps personalize your results. You can still continue, but consider adding one.")
            st.session_state.skills = ratings
            st.session_state.profile.update({
                "skills": ratings,
                "favorite_skills": favorite_skills,
                "activities": activities,
                "work_style": work_style,
                "environment": environment,
                "priorities": priorities,
                "goal_type": goal_type,
                "long_term_goal": clean_text(long_term_goal),
            })
            results = calculate_all_matches(build_profile())
            st.session_state.career_results = results
            st.session_state.selected_career = results[0]["career"] if results else None
            st.session_state.page = "Career Matches"
            st.rerun()


def matches_page() -> None:
    st.header("🎯 Your Career Matches")
    profile = build_profile()
    results = st.session_state.career_results or calculate_all_matches(profile)
    st.session_state.career_results = results

    st.caption("Scores are deterministic compatibility estimates from your inputs—not scientific predictions.")
    cols = st.columns(min(3, len(results[:5])))
    for i, result in enumerate(results[:5]):
        with cols[i % len(cols)]:
            st.metric(f"{i + 1}. {result['career']}", f"{result['score']}%")
            st.write(f"{result['icon']} {result['category']}")
            st.progress(result["score"] / 100)

    selected = st.selectbox(
        "Explore a career",
        [r["career"] for r in results],
        index=max(0, [r["career"] for r in results].index(st.session_state.selected_career))
        if st.session_state.selected_career in [r["career"] for r in results] else 0,
    )
    st.session_state.selected_career = selected

    selected_result = next(r for r in results if r["career"] == selected)
    st.markdown(f"### {selected} — {selected_result['score']}%")
    if st.button("✨ Generate Personalized Career Explanation", type="primary"):
        with st.spinner("Analyzing your profile..."):
            text = call_groq(
                "You are a careful, supportive career counselor. Personalize explanations and avoid guarantees.",
                build_career_explanation_prompt(profile, selected, selected_result["score"]),
                temperature=0.25,
            )
        if text:
            st.session_state.ai_cache[f"explain:{selected}"] = text

    text = st.session_state.ai_cache.get(f"explain:{selected}")
    if text:
        st.markdown(text)

    if st.button("Explore My Top Career", use_container_width=True):
        st.session_state.selected_career = results[0]["career"]
        st.session_state.page = "Skill Gap"
        st.rerun()


def skill_gap_page() -> None:
    st.header("🧩 Your Skill Gap")
    career = st.session_state.selected_career
    if not career:
        st.info("Complete the assessment and choose a career first.")
        return

    profile = build_profile()
    rows = skill_gap(career, profile)
    for row in rows:
        c1, c2, c3, c4 = st.columns([2, 1, 1, 2])
        c1.write(f"**{row['skill']}**")
        c2.write(row["current"])
        c3.write(row["required"])
        c4.write(f"{row['icon']} {row['gap']}")

    if st.button("🤖 Explain My Skill Gaps", type="primary"):
        with st.spinner("Building your gap analysis..."):
            text = call_groq(
                "You are a practical skills mentor. Use the supplied deterministic gap data.",
                build_skill_gap_prompt(profile, career, rows),
                temperature=0.2,
            )
        if text:
            st.session_state.ai_cache[f"gap:{career}"] = text

    if st.session_state.ai_cache.get(f"gap:{career}"):
        st.markdown(st.session_state.ai_cache[f"gap:{career}"])


def roadmap_page() -> None:
    st.header("🗺️ Your Career Roadmap")
    career = st.session_state.selected_career
    if not career:
        st.info("Select a career from Career Matches first.")
        return

    if st.button("🚀 Generate Personalized Roadmap", type="primary"):
        with st.spinner("Designing your learning path..."):
            text = call_groq(
                "You are a career-learning planner. Build a realistic, staged roadmap from current level to career readiness.",
                build_roadmap_prompt(build_profile(), career, skill_gap(career, build_profile())),
                temperature=0.25,
                max_tokens=2200,
            )
        if text:
            st.session_state.ai_cache[f"roadmap:{career}"] = text

    text = st.session_state.ai_cache.get(f"roadmap:{career}")
    if text:
        st.markdown(text)
    else:
        st.info("Your roadmap will connect your current education and skill gaps to Foundation → Core Skills → Portfolio → Career Preparation.")


def education_page() -> None:
    st.header("🎓 Education Path")
    career = st.session_state.selected_career
    if not career:
        st.info("Select a career first.")
        return
    data = CAREER_DB[career]
    st.write(f"**Current level:** {build_profile().get('education_level', 'Not provided')}")
    st.write(f"**Possible education routes toward {career}:**")
    for item in data["education"]:
        st.write(f"- {item}")
    st.warning("Education requirements vary by country, institution, employer, and role. Treat these as possible routes, not universal rules.")


def portfolio_page() -> None:
    st.header("💼 Build Your Portfolio")
    career = st.session_state.selected_career
    if not career:
        st.info("Select a career first.")
        return
    if st.button("💡 Generate Portfolio Projects", type="primary"):
        with st.spinner("Designing projects for your level..."):
            text = call_groq(
                "You are a portfolio mentor. Give realistic projects that demonstrate skills without requiring sensitive data.",
                build_portfolio_prompt(build_profile(), career),
                temperature=0.35,
                max_tokens=2200,
            )
        if text:
            st.session_state.ai_cache[f"portfolio:{career}"] = text

    text = st.session_state.ai_cache.get(f"portfolio:{career}")
    if text:
        st.markdown(text)
    else:
        st.write("Your projects should demonstrate skills progressively. Generate 4 tailored ideas when you are ready.")


def reality_page() -> None:
    st.header("⚠️ Career Reality Check")
    career = st.session_state.selected_career
    if not career:
        st.info("Select a career first.")
        return
    if st.button("🔎 Generate Reality Check", type="primary"):
        with st.spinner("Preparing a balanced reality check..."):
            text = call_groq(
                "You are a candid but supportive career counselor. Avoid hype and guarantees.",
                build_reality_check_prompt(build_profile(), career),
                temperature=0.3,
                max_tokens=2200,
            )
        if text:
            st.session_state.ai_cache[f"reality:{career}"] = text
    text = st.session_state.ai_cache.get(f"reality:{career}")
    if text:
        st.markdown(text)


def compare_page() -> None:
    st.header("⚖️ Compare Careers")
    results = st.session_state.career_results or calculate_all_matches(build_profile())
    names = [r["career"] for r in results]
    selected = st.multiselect("Select up to 3 careers", names, default=names[:2], max_selections=3)
    if not selected:
        st.info("Select at least one career.")
        return

    rows = []
    profile = build_profile()
    for career in selected:
        score = calculate_career_match(career, profile)
        gaps = skill_gap(career, profile)
        high = sum(g["gap"] == "High gap" for g in gaps)
        moderate = sum(g["gap"] == "Moderate gap" for g in gaps)
        data = CAREER_DB[career]
        rows.append({
            "Career": career,
            "Match": f"{score}%",
            "High gaps": high,
            "Moderate gaps": moderate,
            "Technical intensity": f"{data['technical_intensity']}/5",
            "Creativity": f"{data['creativity']}/5",
            "Work style": ", ".join(data["work_styles"]),
        })
    st.dataframe(rows, use_container_width=True, hide_index=True)
    st.caption("Technical intensity and creativity are qualitative indicators from the app's career profile, not standardized occupational measurements.")


def chat_page() -> None:
    st.header("💬 Ask Your Career Counselor")
    career = st.session_state.selected_career
    if career:
        st.caption(f"Selected career: **{career}**")

    for message in st.session_state.chat_history:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    question = st.chat_input("Ask about careers, skills, degrees, or your next step...")
    if question:
        question = clean_text(question)
        st.session_state.chat_history.append({"role": "user", "content": question})
        with st.chat_message("user"):
            st.markdown(question)
        with st.chat_message("assistant"):
            with st.spinner("Thinking..."):
                answer = call_groq(
                    "You are a supportive professional career counselor. Personalize advice using the supplied profile.",
                    build_chat_prompt(build_profile(), career, st.session_state.chat_history, question),
                    temperature=0.3,
                    max_tokens=1600,
                )
            if answer:
                st.markdown(answer)
                st.session_state.chat_history.append({"role": "assistant", "content": answer})


def dashboard_page() -> None:
    if not st.session_state.profile and not st.session_state.career_results:
        home_page()
        return

    st.title("🏠 Career Dashboard")
    profile = build_profile()
    st.markdown("### Career Profile")
    c1, c2, c3 = st.columns(3)
    c1.metric("Interests", ", ".join([x for x, v in sorted(profile.get("interests", {}).items(), key=lambda x: x[1], reverse=True)[:3]]) or "Not assessed")
    c2.metric("Strengths", ", ".join(profile.get("favorite_skills", [])[:3]) or "Not assessed")
    c3.metric("Education", profile.get("education_level", "Not provided"))

    st.markdown("### Top Career Matches")
    results = st.session_state.career_results or calculate_all_matches(profile)
    st.session_state.career_results = results
    for i, r in enumerate(results[:3], 1):
        st.write(f"**{['🥇','🥈','🥉'][i-1]} {r['career']} — {r['score']}%**")
        st.progress(r["score"] / 100)

    if st.button("Explore My Top Career", type="primary"):
        st.session_state.selected_career = results[0]["career"]
        st.session_state.page = "Career Matches"
        st.rerun()


def about_page() -> None:
    st.header("ℹ️ About")
    st.markdown(
        "**AI Career Counselor** provides educational career exploration and personalized guidance "
        "based on the information you provide. Career match scores are estimates, not scientific "
        "predictions or guarantees. Students should consider discussions with teachers, career counselors, "
        "professionals, and current information about education and employment before making major career decisions."
    )
    st.info("Avoid entering sensitive personal information. Never provide national IDs, passwords, financial information, or medical information.")
    st.markdown("### Hackathon USP")
    st.success("**Don't just recommend a career. Show students the path to reach it.**")
    st.markdown("### Demo Scenario")
    st.write(
        "A BS English student who likes writing, technology, and education, with advanced writing and "
        "communication skills but beginner programming, may see Technical Writer, UX Writer, and "
        "Instructional Designer rise to the top. The app then connects the chosen path to skill gaps, "
        "a roadmap, portfolio projects, and a reality check."
    )


def sidebar() -> None:
    st.sidebar.title("🎓 AI Career Counselor")
    pages = [
        "Dashboard", "My Profile", "Interest Assessment", "Skills Assessment",
        "Career Matches", "Skill Gap", "Career Roadmap", "Education Path",
        "Portfolio Builder", "Career Reality Check", "Compare Careers",
        "AI Counselor", "About",
    ]
    current = st.session_state.page if st.session_state.page in pages else "Dashboard"
    choice = st.sidebar.radio("Navigate", pages, index=pages.index(current))
    st.session_state.page = choice
    st.sidebar.divider()
    st.sidebar.caption("Privacy")
    st.sidebar.caption("Recommendations use only the information you provide. Avoid sensitive personal information.")
    st.sidebar.caption(f"AI model: `{get_model()}`")


def main() -> None:
    st.set_page_config(
        page_title="AI Career Counselor",
        page_icon="🎓",
        layout="wide",
        initial_sidebar_state="expanded",
    )
    init_state()
    sidebar()

    page = st.session_state.page
    if page == "Dashboard":
        dashboard_page()
    elif page == "My Profile":
        profile_page()
    elif page == "Interest Assessment":
        interest_page()
    elif page == "Skills Assessment":
        skills_page()
    elif page == "Career Matches":
        matches_page()
    elif page == "Skill Gap":
        skill_gap_page()
    elif page == "Career Roadmap":
        roadmap_page()
    elif page == "Education Path":
        education_page()
    elif page == "Portfolio Builder":
        portfolio_page()
    elif page == "Career Reality Check":
        reality_page()
    elif page == "Compare Careers":
        compare_page()
    elif page == "AI Counselor":
        chat_page()
    elif page == "About":
        about_page()


if __name__ == "__main__":
    main()
