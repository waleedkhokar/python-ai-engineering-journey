# 🎓 AdmissionXAI — Explainable AI Candidate Decision Engine

---

## a. App Name, Purpose, and Problem Solved
* **App Name:** **AdmissionXAI**
* **What it Does:** AdmissionXAI is a full-stack, two-stage Explainable AI (XAI) application built with JavaFX and Python. It automates academic admission screening and program recommendations while providing transparent, human-understandable visual explanations for every individual decision.
* **The Real Problem It Solves:** Modern university and college admission committees face a massive surge in applicant volume, leading to prolonged review cycles. While machine learning can automate screening, traditional models act as "black boxes"—rejecting or accepting candidates without explaining *why*. This lack of transparency causes mistrust and regulatory concerns. AdmissionXAI solves this by providing automated applicant evaluation combined with granular Explainable AI (SHAP) feature attributions, showing exact positive and negative factors for every decision.
* **Target Audience:** University admission officers, academic administrators, and institutional screening committees.

---

## b. Features List
* **Two-Stage Machine Learning Pipeline:** Automatically filters candidates for selection, then maps accepted students to optimal academic pathways (e.g., B.Tech/CSE, Medical, BSc, Arts) based on subject strengths.
* **Dual-Layer SHAP Explainability:** Generates exact feature contribution weights (positive/negative impacts) using SHapley Additive exPlanations for every applicant.
* **Interactive JavaFX UI:** Features a dynamic dashboard and visualizer built with custom CSS styling and responsive layout containers.
* **Smart Candidate Roster:** Real-time data import (`students.csv`), filtering, and search functionality across candidate pools.
* **Automated Action Hooks:** Triggers rejection workflows and automated notification templates highlighting primary negative decision factors.
* **Cross-Language Process Bridge:** Seamless, lightweight JSON payload communication between the JavaFX desktop client and Python machine learning subprocesses.

---

## c. The AI Feature & Model Instructions
The core intelligence relies on a sequential Two-Stage Decision & Explanation Engine:

1. **Data Ingestion:** Student records are loaded via CSV (`students.csv`) or entered manually through the JavaFX dashboard interface.
2. **Stage 1 — Admission Screening (`admission_model.pkl`):** 
   * A `scikit-learn` Decision Tree classifier evaluates the candidate's core metrics (GPA, entrance scores, profile completeness) to predict an admission status of **Selected** or **Not Selected**.
   * *Outcome A (Not Selected):* The system triggers a SHAP analysis to extract primary negative factors causing the rejection and prepares an automated notification.
   * *Outcome B (Selected):* The candidate record is automatically forwarded to Stage 2.
3. **Stage 2 — Program Recommendation (`program_model.pkl`):** 
   * A secondary Decision Tree model analyzes the admitted student's subject-specific strengths (Math, Computer Science, Biology, Chemistry, Physics).
   * Maps the student to the optimal academic track: **B.Tech / CSE**, **Medical**, or **BSc / Arts**.
4. **XAI Explanation Generation (`predict.py`):** 
   * Computes granular SHAP (SHapley Additive exPlanations) values for both admission and program selection in real time.
   * Returns structured JSON data that the JavaFX UI renders into interactive horizontal contribution charts.

---

## d. Tools, Services, and AI Models Used
* **Frontend Framework:** JavaFX (FXML, CSS) for native, high-performance desktop execution.
* **Backend Communication:** Java `ProcessBuilder` subprocess management.
* **Machine Learning Framework:** Python, `scikit-learn` (`DecisionTreeClassifier`).
* **Explainable AI Library:** `shap` (SHapley Additive exPlanations).
* **Data Exchange Format:** JSON.
* **Version Control:** Git and GitHub.

---

## e. How to Run the Project

### Prerequisites
* **Java JDK 21** or higher.
* **Python 3.10+** added to system PATH.

### 1. Clone the Repository

```bash
git clone https://github.com/UzmaArain/AdmissionXAI.git
cd AdmissionXAI
```

### 2. Set Up Python Virtual Environment & Dependencies

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Activate virtual environment (macOS/Linux)
source venv/bin/activate

# Install required Python packages
pip install -r python/requirements.txt
```

### 3. Re-train Models (Optional)

If pre-trained model binaries need to be regenerated:

```bash
python python/train_admission_model.py
python python/train_program_model.py
```

### 4. Run the JavaFX Application

- Open the project directory in your preferred Java IDE (IntelliJ IDEA, Eclipse, or VS Code).
- Ensure JavaFX SDK 21 is configured in your project library settings.
- Run `src/com/admissionxai/Main.java`.

**No API Keys Committed:** Confirmed clean environment configuration without exposed secrets or keys.

### License

This project is open-source and available under the MIT License.
