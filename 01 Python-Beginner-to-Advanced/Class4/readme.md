# 📘 Class 4: Lists in Python

> **Date: January 5, 2024** 🎯
> 
> Day 4 of my Python journey — mastering lists, the most used data structure!

---

## 🎯 What I Learned in Class 4

- What are Lists
- Positive & Negative Indexing
- Slicing (start : end : step)
- List Methods (append, insert, pop, remove, etc.)
- Copy vs Reference
- `help()` and `dir()` for exploring
- List comprehension basics

---

## 📋 What is a List?

A **list** is an ordered, mutable collection of items.

### Key Features
- ✅ **Dynamic length** — grows/shrinks anytime
- ✅ **Heterogeneous** — stores different data types
- ✅ **Ordered** — items have positions
- ✅ **Mutable** — can change items

### Homogeneous vs Heterogeneous

| Type | Meaning | Example |
|------|---------|---------|
| **Heterogeneous** | Mixed types | `["qasim", 25, True, 3.14]` |
| **Homogeneous** | Single type (array) | `[1, 2, 3, 4]` |

---

## 🔢 Indexing (Positive & Negative)

```python
#       0        1          2
names = ["qasim", "sir zia", "sir inam"]
#      -3       -2         -1

print(names[0])    # qasim
print(names[-2])   # sir zia
```

**Positive:** `0` to `n-1`  
**Negative:** `-1` to `-length`

---

## ✂️ Slicing

**Syntax:** `list[start : end : step]`

| Part | Meaning |
|------|---------|
| `start` | Where to begin (included) |
| `end` | Where to stop (excluded, n-1) |
| `step` | Skip count (default 1) |

```python
characters = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

# Basic slicing
print(characters[0:2])       # ['A', 'B']
print(characters[:2])        # ['A', 'B']
print(characters[-26:-20])   # ['A', 'B', 'C', 'D', 'E', 'F']
print(characters[0:2:1])     # ['A', 'B']
```

### Step Slicing

```python
print(characters[::2])    # every 2nd: A, C, E, G...
print(characters[::5])    # every 5th: A, F, K, P...
print(characters[::10])   # every 10th: A, K, U
print(characters[::-1])   # REVERSE: Z, Y, X...
print(characters[::+1])   # forward: A, B, C...
```

### Combining Index & Slice

```python
characters = ['A', 'B', 'C', 'D', 'E', 'F']
#             -6   -5   -4   -3   -2   -1

print(characters[1:-3])    # ['B', 'C']
print(characters[::-3])    # ['F', 'C']
print(characters[2:-5])    # ['C']
print(characters[-2:-5:-1]) # ['E', 'D', 'C']
```

---

## 🛠️ List Methods (46 total)

### Common Methods

| Method | What it does |
|--------|-------------|
| `append(x)` | Add item at end |
| `insert(i, x)` | Insert at position i |
| `extend(list)` | Add multiple items |
| `remove(x)` | Remove first x |
| `pop()` | Remove & return last |
| `clear()` | Remove all items |
| `count(x)` | Count occurrences |
| `index(x)` | Find position |
| `copy()` | Shallow copy |
| `sort()` | Sort in place |
| `reverse()` | Reverse in place |

---

## 📝 Modifying Lists

### Change an Item
```python
names = ["qasim", "sir zia", "sir inam"]
names[0] = "waleed khokhar"
print(names)   # ['waleed khokhar', 'sir zia', 'sir inam']
```

### Delete an Item
```python
names = ["qasim", "sir zia", "sir inam"]
del names[0]
print(names)   # ['sir zia', 'sir inam']
```

### Append (Add at End)
```python
names: list[str] = []
names.append("Sir zia")
names.append("Sir inam")
names.append("abgid")
print(names)   # ['Sir zia', 'Sir inam', 'abgid']
```

### Insert at Position
```python
a = ["a", "b", "c", "d", "e"]
a.insert(2, "its C")
print(a)   # ['a', 'b', 'its C', 'c', 'd', 'e']
```

### Pop (Remove Last)
```python
names = ["qasim", "waleed", "wajid"]
a = names.pop()
print(a)         # wajid
print(names)     # ['qasim', 'waleed']
```

### Remove by Value
```python
names = ['a', 'b', 'a']
names.remove('b')
print(names)   # ['a', 'a']
```

### Clear All
```python
a = ["a", "b", "c", "d", "e"]
a.clear()
print(a)   # []
```

---

## 🔗 Copy vs Reference (IMPORTANT!)

### Reference (points to same list)
```python
a = ['a', 'b', 'c']
b = a           # b is NOT a copy — same list!
b[0] = "pakistan"
print(a)        # ['pakistan', 'b', 'c']  ← a changed too!
print(b)        # ['pakistan', 'b', 'c']
```

### Copy (separate list)
```python
a = ['a', 'b', 'c']
b = a.copy()    # TRUE copy
b[0] = "pakistan"
print(a)        # ['a', 'b', 'c']          ← a unchanged
print(b)        # ['pakistan', 'b', 'c']
```

**⚠️ Always use `.copy()` to make a real copy!**

---

## 🔢 Count & Index

```python
names = ['a', 'b', 'a']
print(names.count('a'))   # 2

# Index with start/end
names = ['a', 'b', 'a', 'c', 'b', 'c']
print(names.index("b", 2, 5))   # 4
```

---

## 🔗 Append vs Extend

```python
# append → adds as single item
names = ['a', 'b', 'a']
newnames = ['d', 'e', 'f']
names.append(newnames)
print(names)   # ['a', 'b', 'a', ['d', 'e', 'f']]  ← nested!

# extend → adds each item
names = ['a', 'b', 'a']
newnames = ['d', 'e', 'f']
names.extend(newnames)
print(names)   # ['a', 'b', 'a', 'd', 'e', 'f']  ← flat
```

---

## 🔍 Exploring with `dir()`

```python
[i for i in dir(list) if "__" not in i]
```

Shows all 46 list methods:
```
['append', 'clear', 'copy', 'count', 'extend', 'index',
 'insert', 'pop', 'remove', 'reverse', 'sort']
```

---

## 💡 Help System

| Command | What it does |
|---------|--------------|
| `help(print)` | Show docs |
| `?print` | Quick help |
| `??print` | Full source |
| `print?` | Same as `?print` |

---

## 🎓 Key Takeaways

- ✅ Lists are **mutable** & **ordered**
- ✅ Support **positive & negative** indexing
- ✅ **Slicing**: `[start:end:step]`
- ✅ `[::-1]` **reverses** a list
- ✅ `append` adds 1 item, `extend` adds many
- ✅ `b = a` = reference; `b = a.copy()` = real copy
- ✅ 46 built-in list methods

---

## 📝 Practice Exercises

1. Create a list of 5 names, print first and last
2. Reverse a list using slicing
3. Get every 3rd item from a list
4. Append 3 items, then pop 1
5. Copy a list, modify copy, verify original unchanged

---

## 🔗 Navigation

- **Previous:** [Class 3 — Operators](../Class3/)
- **Next:** [Class 5 — Tuples & Sets](../Class5/)
- **Main:** [Python Complete Journey](../../README.md)

---

## 💡 Pro Tip

> **Lists are everywhere in Python.** Master slicing early — you'll use it in pandas, ML, everything.

---

**📅 Date:** January 5, 2024  
**🎯 Goal:** AI Engineer  
**⭐ Star this repo if it helps you!**

*"Lists are the Swiss Army knife of Python — learn them deeply."*
