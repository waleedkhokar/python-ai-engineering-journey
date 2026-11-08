
import os

import streamlit as st
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

st.set_page_config(
    page_title="AI StudyMate",
    page_icon="📚",
    layout="wide",
)

st.title("📚 AI StudyMate")
st.subheader("Your personal AI-powered study assistant")
st.write("Summarize notes, generate quizzes, and learn difficult topics.")

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    st.error("API key not found. Check that your .env file is saved.")
    st.stop()

client = Groq(api_key=api_key)

MODEL = "openai/gpt-oss-120b"

def ask_ai(prompt):
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are AI StudyMate, a helpful tutor. "
                    "Explain concepts clearly in student-friendly language."
                ),
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0.4,
    )
    return response.choices[0].message.content


feature = st.selectbox(
    "Choose a feature",
    ["Summarize Notes", "Generate Quiz", "AI Tutor"],
)

if feature == "Summarize Notes":
    st.header("📝 Notes Summarizer")
    notes = st.text_area("Paste your study notes here", height=220)

    if st.button("Summarize Notes"):
        if notes.strip():
            with st.spinner("Creating your summary..."):
                try:
                    result = ask_ai(
                        "Summarize these study notes using simple language. "
                        "Include key points and important definitions:\n\n" + notes
                    )
                    st.markdown(result)
                except Exception as error:
                    st.error(f"AI request failed: {error}")
        else:
            st.warning("Please enter your notes first.")

elif feature == "Generate Quiz":
    st.header("🧠 Quiz Generator")
    notes = st.text_area("Paste notes or enter a topic", height=220)
    number = st.slider("Number of questions", 3, 10, 5)

    if st.button("Generate Quiz"):
        if notes.strip():
            with st.spinner("Generating your quiz..."):
                try:
                    result = ask_ai(
                        f"Create {number} multiple-choice questions from this material. "
                        "Give four options per question and show the correct answer "
                        "with a short explanation after each question.\n\n" + notes
                    )
                    st.markdown(result)
                except Exception as error:
                    st.error(f"AI request failed: {error}")
        else:
            st.warning("Please enter a topic or notes first.")

else:
    st.header("🎓 AI Tutor")
    question = st.text_area("What would you like to understand?", height=150)
    level = st.selectbox(
        "Explanation level",
        ["Beginner", "University student", "Exam revision"],
    )

    if st.button("Ask AI Tutor"):
        if question.strip():
            with st.spinner("Your tutor is thinking..."):
                try:
                    result = ask_ai(
                        f"Explain this topic at the {level} level. "
                        "Use clear headings, examples, and a short recap:\n\n"
                        + question
                    )
                    st.markdown(result)
                except Exception as error:
                    st.error(f"AI request failed: {error}")
        else:
            st.warning("Please enter a question first.")
