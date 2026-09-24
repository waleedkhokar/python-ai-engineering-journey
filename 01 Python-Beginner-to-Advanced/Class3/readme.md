# 📘 Class 3: Python Operators

> **Date: January 3, 2024** 🎯
> 
> Day 3 of my Python journey — mastering all operator types!

---

## 🎯 What I Learned

- Arithmetic Operators
- Assignment Operators
- Comparison Operators
- Logical Operators
- Identity Operators
- Membership Operators
- ASCII Codes (`chr()`, `ord()`)
- Walrus Operator (`:=`)
- Zen of Python (`import this`)

---

## 🔢 7 Operator Groups in Python

| # | Group | Purpose |
|---|-------|---------|
| 1 | Arithmetic | Math operations |
| 2 | Assignment | Assign values |
| 3 | Comparison | Compare values |
| 4 | Logical | Combine conditions |
| 5 | Identity | Check same object |
| 6 | Membership | Check in collection |
| 7 | Bitwise | Bit-level operations |

---

## ➕ 1. Arithmetic Operators

```python
a : int = 5
b : int = 10

print(a + b)    # 15
print(a - b)    # -5
print(a * b)    # 50
print(a / b)    # 0.5
print(a % b)    # 5
print(2 ** 5)   # 32
print(14 // 3)  # 4
```

---

## 📝 2. Assignment Operators

```python
a : int = 7
print(a)     # 7

a += 5       # 12
a -= 5       # 7
a *= 5       # 35
a /= 5       # 7.0
a %= 5       # 2.0
```

---

## ⚖️ 3. Comparison Operators

```python
print(5 == 5)    # True
print(5 != 5)    # False
print(5 > 10)    # False
print(10 < 15)   # True
print(10 >= 15)  # False
print(10 <= 15)  # True

# Different types
print(5 == '5')  # False
```

---

## 🧠 4. Logical Operators

```python
name : str = "Qweet"
print(not name == "Qweet")   # False
print(name != "Qweet")        # False
```

| Operator | Meaning |
|----------|---------|
| `and` | Both True |
| `or` | At least one True |
| `not` | Reverse result |

---

## 🆔 5. Identity Operators

```python
x : str = 'abc'
z : str = 'abc'

print(id(x))
print(id(z))

print(x is z)       # True
print(x is not z)   # False
```

**`is`** → same object in memory  
**`==`** → same value

---

## 🔍 6. Membership Operators

```python
names = ['Waleed', 'ahmad', 'sir inam']
uinput = input("Enter your name")

print(uinput in names)       # True/False
print(uinput not in names)   # Opposite
```

```python
names = [chr(i) for i in range(65, 91)]
print("pakistan" in names)   # False
print("A" in names)          # True
```

---

## 🔤 ASCII Codes

```python
print(chr(65))   # 'A'
print(ord('A'))  # 65
print(ord('a'))  # 97
```

| Character | ASCII |
|-----------|-------|
| `A` | 65 |
| `Z` | 90 |
| `a` | 97 |
| `z` | 122 |

**`chr()`** → number to char  
**`ord()`** → char to number

---

## 🎁 Walrus Operator (`:=`)

```python
print(b := 7)   # 7
```

Assign + return in one line (Python 3.8+)

---

## 🎨 Unpacking Values

```python
a, b, c = 'qasum', 8, 4.0
print(a, b, c)   # qasum 8 4.0

# * spreads values
data = 'qasum', 8, 4.0
print(*data)     # qasum 8 4.0

# Readable numbers
universe_age = 14_000_000_000
print(universe_age)   # 14000000000
```

---

## 🧮 Order of Operations (PEMDAS)

```python
print(3 + 2 - 2 * 4 / 2 + 2)
```

| Order | Operation |
|-------|-----------|
| 1 | `()` |
| 2 | `**` |
| 3 | `* / // %` |
| 4 | `+ -` |

---

## 🐍 The Zen of Python

```python
import this
```

**Key principles:**
- Beautiful > Ugly
- Explicit > Implicit
- Simple > Complex
- Readability counts

---

## 📂 Files in This Folder

| File | Purpose |
|------|---------|
| `class3.ipynb` | My Class 3 notebook |
| `class3.py` | Python script |
| `readme.md` | This guide |

---

## 🎓 Key Takeaways

- ✅ Python has **7 operator groups**
- ✅ `//` floor division, `**` power
- ✅ `+= -= *= /=` shortcuts
- ✅ `is` = identity, `==` = value
- ✅ `in` checks membership
- ✅ `chr()` / `ord()` for ASCII
- ✅ Walrus `:=` assigns + returns

---

## 📝 Practice Exercises

1. Calculate area of circle using `**`
2. Use `+=` to build running sum 1 to 10
3. Check if user's name is in a list using `in`
4. Convert `'hello'` to ASCII numbers
5. Print the Zen of Python

---

## 🔗 Navigation

- **Previous:** [Class 2 — Strings](../Class2/)
- **Next:** [Class 4 — Loops](../Class4/)
- **Main:** [Python Complete Journey](../../README.md)

---


**📅 Date:** January 3, 2024  
**🎯 Goal:** AI Engineer  
**⭐ Star this repo if it helps you!**

*"Operators are the verbs of programming — they make things happen."*