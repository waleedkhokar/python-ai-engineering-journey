import streamlit as st
import pickle
import string
import time
import nltk
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer


# One-time NLTK downloads (safe to call every run)

for pkg in ["punkt", "punkt_tab", "stopwords"]:
    try:
        nltk.data.find(f"tokenizers/{pkg}")
    except LookupError:
        try:
            nltk.data.find(f"corpora/{pkg}")
        except LookupError:
            nltk.download(pkg, quiet=True)

ps = PorterStemmer()

def transform_text(text):
    text = text.lower()
    text = nltk.word_tokenize(text)

    y = []
    for i in text:
        if i.isalnum():
            y.append(i)

    text = y[:]
    y.clear()

    for i in text:
        if i not in stopwords.words('english') and i not in string.punctuation:
            y.append(i)

    text = y[:]
    y.clear()

    for i in text:
        y.append(ps.stem(i))

    return " ".join(y)

# ---------------------------------------------------------------------------
# Page Configuration & Custom CSS (Dark Navy & Ice Blue)
# ---------------------------------------------------------------------------
st.set_page_config(page_title="Spam Detector", page_icon="🛡️", layout="centered")

st.markdown("""
    <style>
    /* Main Background - Dark Navy */
    .stApp {
        background-color: #071324 !important; 
    }
    
    /* Text styling - Ice Blue */
    h1, h2, h3, p, label {
        color: #BBE1FA !important; 
    }
    
    /* Text Area Customization */
    .stTextArea textarea {
        background-color: #0F2039 !important; 
        color: #E2F1F8 !important; 
        border: 1.5px solid #3282B8 !important; 
        border-radius: 12px !important;
        font-size: 16px !important;
    }
    .stTextArea textarea:focus {
        border-color: #BBE1FA !important;
        box-shadow: 0 0 10px rgba(187, 225, 250, 0.3) !important;
    }
    
    /* Button Customization */
    .stButton > button {
        background-color: #3282B8 !important; 
        color: #071324 !important; 
        font-weight: 700 !important;
        border-radius: 8px !important;
        border: none !important;
        padding: 10px 24px !important;
        width: 100%;
        transition: all 0.3s ease-in-out !important;
    }
    .stButton > button:hover {
        background-color: #1B4965 !important; 
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(50, 130, 184, 0.4) !important;
    }
    
    /* Output Result Boxes */
    .result-box-spam {
        background-color: #2a111a;
        border: 1px solid #ff4b4b;
        color: #ffb4b4;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        box-shadow: 0 4px 10px rgba(255, 75, 75, 0.2);
        animation: fadeIn 0.5s;
    }
    .result-box-ham {
        background-color: #0A2635; 
        border: 1px solid #3282B8; 
        color: #BBE1FA;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        box-shadow: 0 4px 10px rgba(50, 130, 184, 0.2);
        animation: fadeIn 0.5s;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    </style>
""", unsafe_allow_html=True)

# ---------------------------------------------------------------------------
# Load Models
# ---------------------------------------------------------------------------
@st.cache_resource
def load_models():
    tfidf = pickle.load(open('vectorizer.pkl','rb'))
    model = pickle.load(open('model.pkl','rb'))
    return tfidf, model

tfidf, model = load_models()

# ---------------------------------------------------------------------------
# Main UI Elements
# ---------------------------------------------------------------------------
st.title("🛡️ Threat Detection System")
st.markdown("<p style='text-align: center; font-size: 18px; margin-bottom: 20px;'>Analyze incoming SMS or Emails for spam signatures.</p>", unsafe_allow_html=True)

input_sms = st.text_area("Input Communications Log", height=150, placeholder="Paste your message here...")

if st.button('Initialize Scan'):
    if not input_sms.strip():
        st.warning("⚠️ Please enter a message to scan.")
    else:
        with st.spinner("Processing NLP pipeline..."):
            time.sleep(0.5) # Adds a slight simulated delay for UX feel
            
            # 1. preprocess
            transformed_sms = transform_text(input_sms)
            
            # 2. vectorize
            vector_input = tfidf.transform([transformed_sms])
            
            # 3. predict
            result = model.predict(vector_input)[0]
            
            # 4. Display
            st.markdown("<br>", unsafe_allow_html=True)
            if result == 1:
                st.markdown('<div class="result-box-spam">ALERT: This message is SPAM</div>', unsafe_allow_html=True)
            else:
                st.markdown('<div class="result-box-ham">CLEAR: This message is NOT SPAM</div>', unsafe_allow_html=True)