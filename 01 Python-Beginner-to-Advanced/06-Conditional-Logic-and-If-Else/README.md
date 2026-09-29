# 📘 Class 6: Conditional Logic — if, elif, else

> **Date: January 9, 2024** 🎯
> 
> Day 6 of my Python journey — teaching Python how to **make decisions**!

---

## 🎯 What I Learned in Class 6

- `if`, `elif`, `else` statements
- Comparison operators (`==`, `!=`, `<`, `>`, `<=`, `>=`)
- Logical operators (`and`, `or`, `not`)
- Nested conditions
- Membership checks (`in`, `not in`)
- Ternary (one-line) if
- Real-world: Grading system
- User input validation

---

## 🔀 Why Conditional Logic?

Programs need to make **decisions**:
- "If user is admin → show dashboard"
- "If marks >= 80 → grade A+"
- "If user is banned → don't allow post"

Python uses `if`, `elif`, `else` for this.

---

## 📝 Basic Syntax

```python
if condition:
    # runs when True
elif another_condition:
    # runs when first is False, this is True
else:
    # runs when nothing matches
```

**⚠️ Python uses indentation (4 spaces) instead of `{ }`!**

---

## 🔀 if-else Basics

```python
if True:
    print("pakistan zinda bad")
else:
    print("hello world")
```

**Output:**
```
pakistan zinda bad
```

```python
if False:
    print("pakistan zinda bad")
else:
    print("hello world")
```

**Output:**
```
hello world
```

---

## ⚡ Ternary (One-Line If)

**Syntax:** `true_value if condition else false_value`

```python
print("pakistan zinda bad") if True else print("hello world")
print("pakistan zinda bad") if False else print("hello world")
```

**Output:**
```
pakistan zinda bad
hello world
```

---

## 🔗 elif — Multiple Conditions

Use `elif` when you have **more than 2 possibilities**.

```python
if True:
    print("pakistan zinda bad")
elif False:
    print("zinda bad")
elif False:
    print("pakistan zinda")
else:
    print("Pakistan is not zinda bad")
```

**Output:**
```
pakistan zinda bad
```

```python
if False:
    print("pakistan zinda bad")
elif False:
    print("zinda bad")
elif False:
    print("pakistan zinda")
else:
    print("Pakistan is not zinda bad")
```

**Output:**
```
Pakistan is not zinda bad
```

---

## 🎓 Real-World: Grading System

Convert marks → grade:

| Marks | Grade |
|-------|-------|
| 90-100 | A+ |
| 70-89 | A |
| 60-69 | B |
| 50-59 | C |
| 40-49 | D |
| 0-39 | Fail |

```python
from typing import Union

per: Union[int, float] = 88
grade: Union[str, None] = None

if per >= 80:
    grade = "A+"
elif per >= 60:
    grade = "B"
elif per >= 50:
    grade = "C"
elif per >= 40:
    grade = "D"
else:
    grade = "Fail"

print(f"Your percentage is {per}, result: {grade}")
```

**Output:**
```
Your percentage is 88, result: A+
```

---

## ⚠️ Logical Error Example (Wrong Ranges)

When ranges overlap or miss values → **wrong result**.

```python
from typing import Union

per: Union[int, float] = 33
grade: Union[str, None] = None

if per >= 0:
    grade = "fail"       # ← catches everything!
elif per >= 80:
    grade = "A+"         # ← never runs
elif per >= 60:
    grade = "B"
elif per >= 50:
    grade = "C"
elif per >= 40:
    grade = "D"
else:
    grade = "Fail"

print(f"Your percentage is {per}, result: {grade}")
```

**Output:**
```
Your percentage is 33, result: fail
```

**⚠️ Even 99 → "fail" because `per >= 0` is checked first!**

---

## ✅ Correct Version — Proper Ranges

Use `and` to combine conditions properly.

```python
from typing import Union

per: Union[int, float] = 88
grade: Union[str, None] = None

if per >= 0 and per < 33:
    grade = "Fail"
elif per >= 33 and per < 40:
    grade = "D"
elif per >= 40 and per < 50:
    grade = "C"
elif per >= 50 and per < 60:
    grade = "B"
elif per >= 60 and per < 70:
    grade = "A"
elif per >= 70 and per <= 100:
    grade = "A+"
else:
    grade = "Invalid marks"

print(f"Your percentage is {per}, result: {grade}")
```

**Output:**
```
Your percentage is 88, result: A+
```

---

## 📋 Looping Through Many Students

Instead of one, grade a **whole class**!

```python
from typing import Union

PerType = Union[int, float]
percentages: list[PerType] = [50, 60, 70]
grades: list[str] = []

for per in percentages:
    grade: str = ""
    if per >= 0 and per < 33:
        grade = "Fail"
    elif per >= 33 and per < 40:
        grade = "D"
    elif per >= 40 and per < 50:
        grade = "C"
    elif per >= 50 and per < 60:
        grade = "B"
    elif per >= 60 and per < 70:
        grade = "A"
    elif per >= 70 and per <= 100:
        grade = "A+"
    grades.append(grade)

print(percentages)
print(grades)
```

**Output:**
```
[50, 60, 70]
['B', 'A', 'A+']
```

---

## 📦 `zip()` — Combine Multiple Lists

```python
# Combine percentages + grades
print(list(zip(percentages, grades)))

# Add roll numbers too
roll: list[int] = list(range(len(percentages)))
print(list(zip(roll, percentages, grades)))
```

**Output:**
```
[(50, 'B'), (60, 'A'), (70, 'A+')]
[(0, 50, 'B'), (1, 60, 'A'), (2, 70, 'A+')]
```

---

## 🔤 Case-Sensitive Comparison

`==` is **case-sensitive**:

- `"Audi" == "audi"` → **False**
- `"Audi".lower() == "audi"` → **True**

```python
car = 'Audi'

print(car == 'audi')            # False
print(car.lower() == 'audi')    # True
```

**Output:**
```
False
True
```

---

## 🔍 `in` and `not in` — Membership

Check if an item is **inside** a list/string.

```python
foods: list[str] = ['biryani', 'makhan', 'malai', 'tea']

print('biryani' in foods)      # True
print('wak' in foods)          # False
print('pizza' not in foods)    # True
```

**Output:**
```
True
False
True
```

---

## 🍕 Real-World: Pizza Toppings Check

```python
available_toppings = ['mushrooms', 'olives', 'green peppers',
                       'pepperoni', 'pineapple', 'extra cheese']
requested_toppings = ['mushrooms', 'french fries', 'extra cheese']

for requested_topping in requested_toppings:
    if requested_topping in available_toppings:
        print(f"Adding {requested_topping}.")
    else:
        print(f"Sorry, we don't have {requested_topping}.")

print("\nFinished making your pizza!")
```

**Output:**
```
Adding mushrooms.
Sorry, we don't have french fries.
Adding extra cheese.

Finished making your pizza!
```

---

## 🚫 Empty List Check

An empty list is **False** in Python!

```python
requested_toppings = []

if requested_toppings:
    for t in requested_toppings:
        print(f"Adding {t}.")
    print("\nFinished making your pizza!")
else:
    print("Are you sure you want a plain pizza?")
```

**Output:**
```
Are you sure you want a plain pizza?
```

---

## 👮 Banned User Check

```python
banned_user: list[str] = ['andrew', 'angela', 'glory']
user: str = 'marie'

if user not in banned_user:
    print(f"{user.title()}, you can post a refuge if you want")
else:
    print("You are banned!")
```

**Output:**
```
Marie, you can post a refuge if you want
```

---

## 🗳️ Age-Based Voting Check

```python
age = 17

if age >= 18:
    print("You are old enough to vote!")
    print("Have you registered?")
else:
    print("Sorry, you are too young to vote.")
```

**Output:**
```
Sorry, you are too young to vote.
```

---

## 🎢 Ticket Price Based on Age

```python
age = 12

if age < 4:
    print("Your ticket is free (0$)")
elif age < 18:
    print("Your ticket is 10$")
else:
    print("Your ticket is 20$")
```

**Output:**
```
Your ticket is 10$
```

---

## 🔐 Login Check with OTP

```python
user: str = input("Enter your id: ")
password: str = input("Enter your password: ")

if user == "admin" and password == "admin":
    print("Check email for OTP")
    otp: str = input("Enter your OTP: ")
    if otp == '12345':
        print("Welcome!")
    else:
        print("Invalid OTP")
else:
    print("Invalid User / Password")
```

---

## 📂 Files in This Folder

| File | Purpose |
|------|---------|
| `class6.ipynb` | My Class 6 notebook |
| `readme.md` | This guide |

---

## 🎓 Key Takeaways

- ✅ `if` / `elif` / `else` = decision making
- ✅ Python uses **4-space indentation** (no braces)
- ✅ `and` / `or` / `not` combine conditions
- ✅ Use **proper ranges** — avoid logic errors
- ✅ `in` / `not in` check membership
- ✅ `True` = run, `False` = skip
- ✅ `zip()` combines lists for iteration
- ✅ Empty list = `False` in conditions

---

## 📝 Practice Exercises

1. Check if number is positive, negative, or zero
2. Build a BMI calculator with if-elif-else
3. Password strength checker (weak/medium/strong)
4. Login system with 3 attempts
5. Grade calculator for 5 students using loop + if-else
6. Simple ATM withdrawal with balance check

---

## 🔗 Navigation

- **Previous:** [05-Python-Loops-and-Iteration-Mastery](../05-Python-Loops-and-Iteration-Mastery/)
- **Next:** [07-Dictionaries](../07-Dictionaries/)
- **Main:** [Python Complete Journey](../../README.md)

---

## 💡 Pro Tip

> **Order matters in `if-elif`.** Check the most specific condition first. 
> `per >= 90` before `per >= 0` — or the broad one wins!

---

**📅 Date:** January 9, 2024  
**🎯 Goal:** AI Engineer  
**⭐ Star this repo if it helps you!**

*"Conditions give your code a brain — it can now decide!"*