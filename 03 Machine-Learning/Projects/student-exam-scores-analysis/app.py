import streamlit as st
import joblib
import numpy as np

# Load Model
model = joblib.load("student_exam_model.pkl")

# Title
st.title("🎓 Student Exam Score Predictor")

st.write("Enter student information to predict exam score.")

hours_studied = st.number_input("Hours Studied", min_value=0.0)
sleep_hours = st.number_input("Sleep Hours", min_value=0.0)
attendance_percent = st.number_input("Attendance Percentage", min_value=0.0, max_value=100.0)
previous_scores = st.number_input("Previous Scores", min_value=0.0)

if st.button("Predict Score"):
    features = np.array([[hours_studied, sleep_hours, attendance_percent, previous_scores]])

    prediction = model.predict(features)

    percentage = (prediction[0] / 51.3) * 100

    if percentage >= 90:
        grade = "A+"
    elif percentage >= 80:
        grade = "A"
    elif percentage >= 70:
        grade = "B"
    elif percentage >= 60:
        grade = "C"
    else:
        grade = "D"

    st.success(f"Predicted Result: {percentage:.1f}% | Grade: {grade}")

st.sidebar.markdown("## 👩‍💻 Author:")

st.sidebar.markdown(
    """
    <div style="text-align: center;">
        <h4 style="margin-bottom:0;">Aleesha Nadeem</h4>
        <p style="margin-top:0;"><b>2(AN)K</b></p>
    </div>
    """,
    unsafe_allow_html=True
)

st.sidebar.markdown("---")
st.sidebar.markdown("### 📂 Project")
st.sidebar.write("Student Exam Score Predictor")
st.sidebar.caption("Machine Learning Web Application")
