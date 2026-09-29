# 📘 Class 9: Loops, Input & Control Flow

> **Date: January 11, 2024** 🎯
> 
> Day 9 of my Python journey — mastering loops across all data types + user input!

---

## 🎯 What I Learned in Class 9

- Loop through **all data types** (list, tuple, string, dict, set)
- `while` loop advanced
- `break`, `continue`, `pass`
- `input()` from user
- `sys.argv` — console input
- `zip()` — combine multiple lists
- List comprehension with conditions
- Real-world: build a mini database with input loop
- Type conversion with `input()`

---

## 🔁 Looping Through Iterative Data

**Python can loop through:**

| Type | Example |
|------|---------|
| **List** | `[1, 2, 3]` |
| **Tuple** | `(1, 2, 3)` |
| **String** | `"Pakistan"` |
| **Dict** | `{"a": 1}` |
| **Set** | `{1, 2, 3}` |

---

## 📋 Loop Through a List

```python
l1: list[int] = [1, 2, 3, 4, 5]

for n in l1:
    print(f"Current number: {n}")
```

**Output:**
```
Current number: 1
Current number: 2
Current number: 3
Current number: 4
Current number: 5
```

---

## 📦 Loop Through a Tuple

```python
l1: tuple[int, ...] = (1, 2, 3, 4, 5)

for n in l1:
    print(f"Current number: {n}")
```

**Output:**
```
Current number: 1
Current number: 2
Current number: 3
Current number: 4
Current number: 5
```

**Same as list — tuples are iterable!**

---

## 🔤 Loop Through a String

```python
l1: str = "Pakistan"

for n in l1:
    print(f"Current number: {n}")
```

**Output:**
```
Current number: P
Current number: a
Current number: k
Current number: i
Current number: s
Current number: t
Current number: a
Current number: n
```

**⚠️ String = iterable of characters!**

---

## 📖 Loop Through a Dictionary

### 1. Loop keys only

```python
l1: dict[str, str] = {"name": "Waleed", "nam": "HMAD"}

for ITEM in l1:
    print(f"Current number: {ITEM}")
```

**Output:**
```
Current number: name
Current number: nam
```

**⚠️ By default, loops through keys!**

### 2. Access value with `l1[k]`

```python
for k in l1:
    print(f"Dictionary Key {k} and value is {l1[k]}")
```

**Output:**
```
Dictionary Key name and value is Waleed
Dictionary Key nam and value is HMAD
```

### 3. Best — Loop with `.items()` (covered in Class 7)

```python
for k, v in l1.items():
    print(f"{k} → {v}")
```

---

## 🎲 Loop Through a Set (No Duplicates)

```python
l1: list[int] = list({1, 2, 3, 7, 7, 7, 8})

for k in l1:
    print(f"Current number: {k}")
```

**Output:**
```
Current number: 1
Current number: 2
Current number: 3
Current number: 7
Current number: 8
```

**⚠️ Set removes duplicates automatically!**

---

## 📥 `input()` — Get User Input

### ⚠️ ALWAYS returns a `string`!

```python
name = input("Your Name: \t")

print(type(name))      # <class 'str'>
print(f"Hi dear MR {name}")
```

**Input:** `Waleed`  
**Output:**
```
Hi dear MR Waleed
```

**Even if user types `123`, it's `"123"` (string).**

---

## 🔧 Type Conversion with `input()`

```python
age = input("How old are you? ")     # returns string
age >= 18                             # ❌ TypeError
```

**Error:**
```
TypeError: '>=' not supported between instances of 'str' and 'int'
```

### ✅ Fix: Convert with `int()` or `float()`

```python
age = int(input("How old are you? "))    # convert to int
print(age >= 18)                         # ✅ works
```

**Output:**
```
True
```

**⚠️ Always convert user input to the right type!**

---

## 🖥️ `sys.argv` — Command Line Arguments

Get input from **terminal** when running `.py` files.

```python
import sys

print("line1")
print(type(sys.argv))
print(sys.argv)
```

**Output:**
```
<class 'list'>
['/path/to/script.py', '--arg1', '--arg2']
```

**Usage:**
- `sys.argv[0]` = script name
- `sys.argv[1]` = first argument
- `sys.argv[2]` = second argument

**Example from terminal:**
```bash
python script.py hello world
# sys.argv = ['script.py', 'hello', 'world']
```

---

## 🎯 `zip()` — Combine Multiple Lists

```python
names: list[str] = ['a', 'b', 'c']
fname: list[str] = ['x', 'y', 'z']
age: list[int] = [1, 2, 3]

list(zip(names, fname, age))
```

**Output:**
```
[('a', 'x', 1), ('b', 'y', 2), ('c', 'z', 3)]
```

### Loop with `zip()`

```python
for name, fn, ag in zip(names, fname, age):
    print(f"Welcome dear {name}, s/o {fn}, age {ag}")
```

**Output:**
```
Welcome dear a, s/o x, age 1
Welcome dear b, s/o y, age 2
Welcome dear c, s/o z, age 3
```

**⚠️ `zip()` stops at shortest list!**

---

## 🔁 `while` Loop

**Syntax:**
```python
while condition:
    # loop body
```

### Basic While

```python
flag: bool = True
current_number: int = 1

while flag:
    print(f"Current number is: {current_number}")
    current_number += 1
    if current_number == 10:
        break
```

**Output:**
```
Current number is: 1
Current number is: 2
...
Current number is: 9
```

### While with Index

```python
l1: list[int] = [100, 200, 300]
index: int = 0

while index < len(l1):
    print(f"Index: {index}, Value: {l1[index]}")
    index += 1
```

**Output:**
```
Index: 0, Value: 100
Index: 1, Value: 200
Index: 2, Value: 300
```

---

## 🗄️ Real-World: Mini Database with Input Loop

```python
data: list[dict[str, str]] = []
flag: bool = True

while flag:
    print("Write 'exit' or 'stop' to end")
    name: str = input("Your good name? : ")
    education: str = input("Your education? : ")
    
    if name in ['exit', 'stop', 'close'] or education in ['exit', 'stop', 'close']:
        flag = False
        break
    
    data.append({"name": name, "education": education})

display(data)
```

**Interactive — builds database from user input until "exit".**

---

## 🛑 Control Statements

| Statement | Purpose |
|-----------|---------|
| `break` | Exit loop immediately |
| `continue` | Skip current iteration, go to next |
| `pass` | Do nothing (placeholder) |

---

## 🛑 `break` — Stop Loop

```python
for i in range(1, 11):
    print(i)
    if i == 5:
        break
```

**Output:**
```
1
2
3
4
5
```

**Loop stops at 5, ignores 6-10.**

---

## ⏭️ `continue` — Skip Iteration

```python
for i in range(1, 11):
    if i == 5:
        continue
    print(i)
```

**Output:**
```
1
2
3
4
6
7
8
9
10
```

**5 is skipped, loop continues.**

---

## 🔄 `continue` in While — Skip Even Numbers

```python
current_number = 0
while current_number < 10:
    current_number += 1
    if current_number % 2 == 0:
        continue
    print(current_number)
```

**Output:**
```
1
3
5
7
9
```

**Only odd numbers print.**

---

## 🎯 Filter with List Comprehension

### Odd Numbers Only

```python
data: list[int] = [1, 2, 3, 4, 8, 9, 88]
[i for i in data if i % 2 != 0]
```

**Output:**
```
[1, 3, 9]
```

### Even Numbers Only

```python
[i for i in data if i % 2 == 0]
```

**Output:**
```
[2, 4, 8, 88]
```

---

## 🏙️ Real-World: City Input Loop

```python
prompt = "\nPlease enter the name of a city you have visited:"
prompt += "\n(Enter 'quit' when you are finished.) "

while True:
    city = input(prompt)
    if city == 'quit':
        break
    else:
        print(f"I'd love to go to {city.title()}!")
```

**Output:**
```
I'd love to go to Paris!
I'd love to go to Tokyo!
I'd love to go to New York!
```

---

## 🍕 Multiplication Table with Loop

```python
for i in range(1, 6):
    print(f"2 X {i} = {i * 2}")
```

**Output:**
```
2 X 1 = 2
2 X 2 = 4
2 X 3 = 6
2 X 4 = 8
2 X 5 = 10
```

---

## ➕ Multi-line Expressions (with `\`)

```python
print(1 + 3 \
    + 7 \
    + 7)
```

**Output:**
```
18
```

**Backslash `\` = continue line on next line.**

---

## 📂 Files in This Folder

| File | Purpose |
|------|---------|
| `class9.ipynb` | My Class 9 notebook |
| `README.md` | This guide |

---

## 🎓 Key Takeaways

- ✅ Loop through any iterable (list, tuple, str, dict, set)
- ✅ Dict loop → keys by default
- ✅ Use `.items()` for key+value
- ✅ `input()` always returns **string**
- ✅ Convert with `int()` / `float()` for math
- ✅ `sys.argv` = terminal arguments
- ✅ `zip()` combines multiple lists
- ✅ `break` = exit, `continue` = skip, `pass` = nothing
- ✅ `while True` + `break` = common input pattern
- ✅ Comprehension `[x for x if cond]` = quick filter

---

## 📝 Practice Exercises

1. Loop through `[10, 20, 30]` and print each
2. Loop through `"Hello"` and print each character
3. Create a dict, loop `.items()`, print each pair
4. Ask user for age → check if ≥ 18
5. Use `zip()` on 3 lists → print pairs
6. Print odd numbers 1-20 with `continue`
7. Build a shopping list app with input until "exit"

---

## 🔗 Navigation

- **Previous:** [08-Advanced-Dictionaries-and-JSON](../08-Advanced-Dictionaries-and-JSON/)
- **Next:** [10-Functions-Introduction](../10-Functions-Introduction/)
- **Main:** [Python Complete Journey](../../README.md)

---

## 💡 Pro Tip

> **`while True:` + `break`** is the standard pattern for input loops.
> Clean, readable, powerful. Master it!

---

**📅 Date:** January 11, 2024  
**🎯 Goal:** AI Engineer  
**⭐ Star this repo if it helps you!**

*"Loops let your code run forever — but you decide when to stop!"*