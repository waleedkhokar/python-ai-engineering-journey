# 📘 Class 1: Python Foundations

> **Started: January 1, 2024** 🎯
> 
> My very first step into Python — the beginning of my journey to becoming an **AI Engineer**!

---

## 🐍 What is Python?

Python is a **high-level, easy-to-learn programming language** created by **Guido van Rossum** in **1991**.

### Why Python? 🤔
- ✅ **Easy to read** — looks like English
- ✅ **Beginner friendly** — perfect first language
- ✅ **Most popular** — used by Google, Netflix, NASA, Instagram
- ✅ **Huge community** — millions of developers
- ✅ **Free & open source**

### Where is Python Used? 🌍

| Field | Use Cases |
|-------|-----------|
| 🤖 **AI & ML** | ChatGPT, Tesla Autopilot, Face Recognition |
| 📊 **Data Science** | Netflix recommendations, Stock prediction |
| 🌐 **Web Dev** | Instagram, YouTube, Dropbox |
| 🎮 **Game Dev** | Minecraft-like games, Pygame |
| 🔬 **Science** | NASA, Space research |
| 💰 **Finance** | Banking software, Crypto bots |
| 📱 **Automation** | Bots, Scripts, Web scraping |

---

## 🎯 What I Learned in Class 1

- Setting up Python & VS Code
- Using Command Prompt (Windows)
- Running Python files
- Print function
- Variables & type hints
- Data types (`str`, `int`)
- Exploring objects with `type()`, `id()`, `dir()`

---

## 🛠️ Setup Guide (Beginner Friendly)

### Step 1: Install Python
1. Download from [python.org](https://python.org)
2. ✅ Check **"Add Python to PATH"** during install
3. Verify installation:

```bash
python --version
```

### Step 2: Install VS Code Extension
- Open VS Code
- Go to Extensions (`Ctrl + Shift + X`)
- Search: **Python**
- Click **Install** (by Microsoft)

### Step 3: Check Python Version

```bash
python --version
```

### Step 4: Open Python in Terminal

```bash
python
```

To exit:
```python
exit()
```

---

## 💻 Basic Commands I Learned

### Windows Command Prompt

```bash
# Change drive
d:

# Create new folder
mkdir gi

# Go inside folder
cd gi

# See all files in folder
dir

# Run a Python file
python class.py
```

### Conda Environment (Virtual Environment)

```bash
# Create environment with Python 3.12
conda create -n python12 python==3.12 -y

# Activate environment
conda activate python12

# Install libraries from requirements file
pip install -r requirements.txt
```

**Why use conda?** Keeps projects separate so libraries don't conflict!

---

## 🖨️ How to Print Something

```python
print("hello word")
```

**Output:**
```
hello word
```

### Run from Command Prompt:
```bash
python filename.py
```

---

## 💻 Code Examples from My Notebook

### 1. My First Print
```python
print("Hello word")
print("from rwk")
print("student")
```

**Output:**
```
Hello word
from rwk
student
```

### 2. Variables with Type Hints
```python
name : str = 7000
print(name)   # 7000

aar : int = '10'
print(aar)    # 10
```

💡 **Note:** Python is flexible — you can assign any value to any variable!

### 3. Exploring Strings
```python
name = "Waleed"
print(name)          # Waleed
print(type(name))    # <class 'str'>
print(id(name))      # memory address (like 2733344679056)
print(dir(name))     # all string methods
```

**What each does:**
| Function | Purpose |
|----------|---------|
| `print()` | Shows output on screen |
| `type()` | Tells the data type |
| `id()` | Shows memory location |
| `dir()` | Lists all available methods |

### 4. Practicing Prints
```python
print("waleed khokhar")
print("2024 start")
print("waleed khokhar")
print("2024 start")
# ... repeated 5 times
```

---

## 📂 Files in This Folder

| File | Purpose |
|------|---------|
| `class.ipynb` | My first Jupyter notebook |
| `class.py` | Python script version |
| `essg.py` | Practice exercises |
| `install.txt` | Setup notes |
| `readme.md` | This guide |

---

## 🎓 Key Takeaways

- ✅ Python is beginner-friendly and powerful
- ✅ Everything in Python is an **object**
- ✅ `print()` is your best friend for testing
- ✅ Virtual environments keep projects clean
- ✅ Consistency is key — practice daily!

---

## 📝 Practice Exercises

1. Print your name 3 times
2. Create variables for your name, age, city
3. Print all variables with labels
4. Check data types of each variable
5. Explore the `dir()` of an integer

---

## 🔗 Navigation

- **Next:** [Class 2 — Data Structures](../Class2/)
- **Main:** [Python Complete Journey](../README.md)

---

## 💡 Pro Tip for Beginners

> **Don't rush.** Spend time understanding each concept. 
> Even `print()` has depth — try `print("a", "b", sep="-")` and see what happens!

---

## 📅 My Journey Started

**Date:** January 1, 2024  
**Goal:** Become an AI Engineer 🚀  
**Mission:** Learn Python → Data Analytics → ML → Deep Learning → AI Engineering

---

**⭐ Star this repo if it helps you on your journey!**

*"Every expert was once a beginner. Start today."*