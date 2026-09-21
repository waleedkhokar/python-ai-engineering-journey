# 📘 Class 2: Strings in Python

> **Date: January 2, 2024** 🎯
> 
> Day 2 of my Python journey — mastering strings!

---

## 🧵 What is a String?

A **string** is a sequence of characters wrapped in quotes.

### 4 Ways to Create Strings

```python
'string text'      # single quotes
"string text"      # double quotes
'''string text'''  # triple single quotes
"""string text"""  # triple double quotes
```

All do the same thing!

```python
name : str = "Muhammad Qadun"
print(type(name))   # <class 'str'>
print(name)         # Muhammad Qadun
```

---

## 🔍 Exploring Strings

```python
name : str = "pakistan"
print(name)                # pakistan
print(type(name))          # <class 'str'>
print(id(name))            # memory address
print([i for i in dir(name) if "__" not in i])  # 46 methods
```

---

## 🔤 String Methods (46 total)

| Method | What it does |
|--------|-------------|
| `capitalize()` | First letter uppercase |
| `lower()` | All lowercase |
| `upper()` | All uppercase |
| `title()` | Each Word Capitalized |
| `strip()` | Remove spaces both sides |
| `lstrip()` | Remove spaces from left |
| `rstrip()` | Remove spaces from right |
| `replace()` | Replace text |
| `split()` | Split into list |
| `join()` | Join list into string |
| `find()` | Find position |
| `count()` | Count occurrences |
| `startswith()` | Check beginning |
| `endswith()` | Check ending |
| `removeprefix()` | Remove prefix |
| `removesuffix()` | Remove suffix |

```python
name : str = "Waleed Khooookhar"

print(name.capitalize())   # Waleed khooookhar
print(name.lower())        # waleed khooookhar
print(name.title())        # Waleed Khooookhar
```

---

## 🎨 String Formatting (3 Ways)

### 1. Concatenation (`+`)

```python
name = "Waleed"
education = "University"
age = 20

card = "PIAIC Card\nStudent: " + name + "\nAge: " + str(age)
print(card)
```

⚠️ **Cannot concatenate `str` + `int` directly!**

```python
name = "PIAIC: " + "University" + "/age:" + age  # ❌ TypeError
name = "PIAIC: " + "University" + "/age:" + str(age)  # ✅
```

### 2. `.format()` method

```python
name = "Waleed khokhar"
education = "BSCS"
age = 20

card = """
PIAIC card
Student name: {a}
Education: {b}
age: {c}
""".format(a=name, b=education, c=age)
print(card)
```

Or with positions:

```python
card = """
Student: {0}
Education: {1}
Age: {2}
""".format(name, education, age)
```

### 3. f-strings ⭐ (BEST)

```python
name = "Waleed khokhar"
education = "BSCS"
age = 20

card = f"""
PIAIC card
Student name: {name}
Education: {education}
Total: {20 + 5}
"""
print(card)
```

**Why f-strings win:**
- ✅ Cleanest syntax
- ✅ Can use expressions inside `{}`
- ✅ Fastest performance

---

## 📏 Whitespace Handling

```python
name = "           Waleed    "

print(name)              # with spaces
print(name.lstrip())     # left stripped
print(name.rstrip())     # right stripped
print(name.strip())      # both stripped
```

**Real-world use:** Clean user input!

---

## 🧹 Advanced: Regex to Clean Spaces

```python
import re

name = "          Waleed  Khokhar          "
print(name)

name1 = re.sub(' {9,90}', '', name)
print(name1)   # Waleed  Khokhar
```

---

## 🔤 Escape Characters

| Escape | Meaning |
|--------|---------|
| `\n` | New line |
| `\t` | Tab |
| `\b` | Backspace |

```python
print("Name:\n Waleed")   # new line
print("Name:\t Waleed")   # tab
print("Name:\b Waleed")   # backspace
```

---

## 📌 f-string Real Example

```python
first_name = "ada"
lastname = "Loveplace"

fullname = f"{first_name} {lastname}"
print(fullname)                          # ada Loveplace

print(f"hello, {fullname}")              # hello, ada Loveplace

messg = f"hello, {fullname.title()}!"    # .title() inside f-string!
print(messg)                             # hello, Ada Loveplace!
```

---

## 🎯 `removeprefix()` Example

```python
nostarch_url = 'https://nostarch.com'
print(nostarch_url.removeprefix('http'))   # s://nostarch.com
```

---

## 🧠 Predefined (Global) Functions

| Function | Purpose |
|----------|---------|
| `print()` | Show output |
| `type()` | Show data type |
| `id()` | Show memory address |
| `dir()` | List all methods |
| `len()` | Count items |
| `str()` | Convert to string |
| `int()` | Convert to integer |

```python
a : list[str] = [i for i in dir(str) if "_" not in i]
print(a)
print(len(a))   # 46 methods
```

---

## 📂 Files in This Folder

| File | Purpose |
|------|---------|
| `class2.ipynb` | My Class 2 notebook |
| `class2.py` | Python script version |
| `readme.md` | This guide |

---

## 🎓 Key Takeaways

- ✅ Strings have **46 built-in methods** — learn the common ones
- ✅ **f-strings** are the best way to format
- ✅ `str()` converts numbers to strings for concatenation
- ✅ `strip()` cleans whitespace — great for user input
- ✅ Escape chars `\n`, `\t` help format output
- ✅ Cannot concatenate `str` + `int` directly

---

## 📝 Practice Exercises

1. Create a string with your full name, print in title case
2. Take a messy string with extra spaces → clean it
3. Use f-string to make a bio card
4. Print a multi-line address using `\n`
5. Take a URL → remove `https://`

---

## 🔗 Navigation

- **Previous:** [Class 1 — Python Foundations](../Class1/)
- **Next:** [Class 3 — Data Structures](../Class3/)
- **Main:** [Python Complete Journey](../../README.md)

---

## 💡 Pro Tip

> **Master f-strings early.** You'll use them in every project.
> `f"Hello {name}, you are {age} years old"` — clean, readable, fast.

---

**📅 Date:** January 2, 2024  
**🎯 Goal:** AI Engineer  
**⭐ Star this repo if it helps you!**

*"Strings are the backbone of every program. Master them first."*
```

---

## **Push it:**

```bash
cd "/Users/waleedkhokhar/Documents/DG Skills AI Python/python-complete-journey"

git add "01 Python-Beginner-to-Advanced/Class2/"
git commit -m "Jan 2, 2024 — Class 2: Strings complete guide"
git push origin main
```

**If network fails:** Retry when WiFi works — commit is saved locally.

---

## **What this README covers:**

✅ What strings are  
✅ 46 methods table  
✅ 3 formatting ways (concatenation, format, f-strings)  
✅ Whitespace handling  
✅ Regex cleaning  
✅ Escape characters  
✅ Real examples  
✅ Key takeaways  
✅ Practice exercises  
✅ Navigation links

**This is a COMPLETE beginner guide — anyone can learn strings from this!** 🚀