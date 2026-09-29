# 📘 Class 5: Loops in Python

> **Date: January 8, 2024** 🎯
> 
> Day 5 of my Python journey — mastering `for` loops, `while` loops, `range()`, and iteration!

---

## 🎯 What I Learned in Class 5

- `for` loops
- `while` loops
- Why Python uses indentation (no braces `{}`)
- Looping through lists
- `range(start, end, step)`
- `enumerate()` — index + value
- `max()`, `min()`, `sum()` on lists
- List comprehensions
- Tuples (immutable lists)

---

## 🔁 Why Python Uses Indentation

In other languages like C, Java, JavaScript, code blocks use braces `{ }`.

**Example (JavaScript):**
```javascript
for (i = 0; i < names.length; i++) {
    console.log(names[i]);
}
```

**Python uses indentation instead of braces:**
```python
for name in names:
    print(name)
```

- ✅ Python automatically adds **4 spaces** after `:` in a loop
- ✅ Any code with the **same indentation** is part of the loop
- ✅ Code without indentation is **outside** the loop

> **This is why Python is clean and readable!**

---

## 🔄 `for` vs `while` Loop

| Loop | When to use |
|------|-------------|
| `for` | When you know the count / iterating collection |
| `while` | When you loop until a condition is false |

---

## 🔁 `for` Loop Basics

```python
names: list[str] = ["sir zia", "Muhammad qasim", "Dr Noman"]

for name in names:
    print(name)
```

**Output:**
```
sir zia
Muhammad qasim
Dr Noman
```

---

## 🔁 `while` Loop

```python
names: list[str] = ["sir zia", "Muhammad qasim", "Dr Noman"]

i: int = 0
while i < len(names):
    print(names[i])
    i += 1
```

**Output:**
```
sir zia
Muhammad qasim
Dr Noman
```

---

## ✂️ Slicing in Loop

```python
names: list[str] = ["sir zia", "Muhammad qasim", "Dr Noman"]

for name in names[::-2]:
    print(f"Welcome     {name.title()}")
```

**Output:**
```
Welcome     Dr Noman
Welcome     Sir Zia
```

---

## 👥 Looping Through List of Tuples

Real-world use: check user in a "database"

```python
from typing import Tuple

data_base: list[tuple[str, str]] = [
    ("Qasim", "111"),
    ("Waleed", "222"),
    ("ikhlas", "333"),
]

for row in data_base:
    print(row)
```

**Output:**
```
('Qasim', '111')
('Waleed', '222')
('ikhlas', '333')
```

### Unpack Tuples

```python
for row in data_base:
    user, password = row
    print(user, password)
```

**Output:**
```
Qasim 111
Waleed 222
ikhlas 333
```

---

## 🔐 Real-World: User Login Check

```python
from typing import Tuple

data_base: list[tuple[str, str]] = [
    ("Qasim", "111"),
    ("Waleed", "222"),
    ("ikhlas", "333"),
]

input_user: str = input("Enter your name: ")
input_password: str = input("Enter your password: ")

for row in data_base:
    user, password = row
    if input_user == user and input_password == password:
        print("Valid User")
        break
else:
    print("Not found or invalid user")
```

**Output (wrong input):**
```
Not found or invalid user
```

---

## 🎉 Simple Greeting Loop

```python
moun: list[str] = ["alice", "david typr 77", "carolinia", "waleed"]

for i in moun:
    print(f"{i.title()}, thats was great")

print(f"i can't wait your next ytilk {i.title()}.\n")
```

**Output:**
```
Alice, thats was great
David Typr 77, thats was great
Carolinia, thats was great
Waleed, thats was great
i can't wait your next ytilk Waleed.
```

---

## 🧮 Numbers with `range()`

**Syntax:** `range(start, end, step)`
- `start` — begin (default 0)
- `end` — stop (excluded)
- `step` — skip count (default 1)

**`range()` is a generator — you must wrap with `list()` to see values.**

```python
print(range(10))          # range(0, 10)  ← generator object
print(list(range(10)))    # [0, 1, 2, ..., 9]
```

**Output:**
```
range(0, 10)
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### Range with Step

```python
# Even numbers 2 to 20
print(list(range(2, 21, 2)))
```

**Output:**
```
[2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
```

### Multiples of 3

```python
for n in range(3, 31, 3):
    print(n)
```

**Output:**
```
3, 6, 9, 12, 15, 18, 21, 24, 27, 30
```

### Times Table of 3

```python
for n in range(1, 6):
    print(f" 3 x {n} = {n * 3}")
```

**Output:**
```
 3 x 1 = 3
 3 x 2 = 6
 3 x 3 = 9
 3 x 4 = 12
 3 x 5 = 15
```

### Full 5 Times Table

```python
for n in range(1, 11):
    print(f" 5 x {n} = {n * 5}")
```

**Output:**
```
 5 x 1 = 5
 5 x 2 = 10
 5 x 3 = 15
 5 x 4 = 20
 5 x 5 = 25
 5 x 6 = 30
 5 x 7 = 35
 5 x 8 = 40
 5 x 9 = 45
 5 x 10 = 50
```

### Squares

```python
for i in range(1, 11):
    print(i ** 2)
```

**Output:**
```
1 4 9 16 25 36 49 64 81 100
```

---

## 📍 `enumerate()` — Index + Value

When you need **both index and item** in a loop.

```python
mon = ["alice", "david typr 77", "carolinia", "waleed"]

print(list(enumerate(mon)))
```

**Output:**
```
[(0, 'alice'), (1, 'david typr 77'), (2, 'carolinia'), (3, 'waleed')]
```

```python
for dex, name in enumerate(mon):
    print(dex, name)
```

**Output:**
```
0 alice
1 david typr 77
2 carolinia
3 waleed
```

---

## ⚡ List Comprehensions

**Shortcut for building lists** from another list or range.

**Syntax:** `[expression for item in iterable]`

```python
[i ** 2 for i in range(1, 6)]
```

**Output:**
```
[1, 4, 9, 16, 25]
```

### Compare with Loop

```python
squares = []
for values in range(1, 11):
    square = values ** 2
    squares.append(square)

print(squares)
```

**Output:**
```
[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
```

**Same result, but comprehension is 1 line:**
```python
[x ** 2 for x in range(1, 11)]
```

---

## 🔢 `max()`, `min()`, `sum()` on Lists

```python
digits: list[int] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0]

print(max(digits))   # 10
print(min(digits))   # 0
print(sum(digits))   # 55
```

**Output:**
```
10
0
55
```

---

## 🎁 Tuples — Immutable Lists

A **tuple** is like a list but **cannot be changed** after creation.

| Feature | List | Tuple |
|---------|------|-------|
| Mutable | ✅ | ❌ |
| Syntax | `[1, 2, 3]` | `(1, 2, 3)` |
| Speed | Slower | Faster |
| Use | Dynamic data | Fixed data |

```python
data: tuple[str, ...] = ("A", "B", "C")

print(data[0])       # A
print(data[0:2])     # ('A', 'B')
```

**Output:**
```
A
('A', 'B')
```

### ⚠️ Tuples are IMMUTABLE

You **cannot** change items in a tuple after creation.

```python
data: tuple = ("A", [1, 2, 3], True)
data[0] = "palis"   # ❌ ERROR
```

**Error:**
```
TypeError: 'tuple' object does not support item assignment
```

### ✅ Using `Any` for Mixed Types

```python
from typing import Any

data: tuple[Any] = ("A", [1, 2, 3], True)
print(data)
```

**Output:**
```
('A', [1, 2, 3], True)
```

---

## 📂 Files in This Folder

| File | Purpose |
|------|---------|
| `class5.ipynb` | My Class 5 notebook |
| `readme.md` | This guide |

---

## 🎓 Key Takeaways

- ✅ `for` = iterate collection, `while` = loop until false
- ✅ Python uses **indentation** (4 spaces) instead of `{}`
- ✅ `range(start, end, step)` generates numbers
- ✅ `enumerate()` gives index + value
- ✅ List comprehension = one-line list builder
- ✅ `max()`, `min()`, `sum()` for quick math
- ✅ Tuples are **immutable** lists
- ✅ `data, password = row` unpacks tuples

---

## 📝 Practice Exercises

1. Print 1 to 20 using `for` and `range`
2. Print even numbers 2 to 50
3. Loop through list of 5 names, print each
4. Make a tuple of 3 favorite foods — verify you can't change it
5. Use `enumerate()` on a list of cities
6. Build squares 1-10 with list comprehension

---

## 🔗 Navigation

- **Previous:** [Class 4 — Lists](../Class4/)
- **Next:** [Class 6 — Dictionaries](../Class6/)
- **Main:** [Python Complete Journey](../../README.md)

---

## 💡 Pro Tip

> **Master `for` loops and `enumerate()` first.** 90% of Python code uses them. 
> Comprehension is optional but makes you look pro.

---

**📅 Date:** January 8, 2024  
**🎯 Goal:** AI Engineer  
**⭐ Star this repo if it helps you!**

*"Loops are the heartbeat of programming — they make computers do the boring work."*
