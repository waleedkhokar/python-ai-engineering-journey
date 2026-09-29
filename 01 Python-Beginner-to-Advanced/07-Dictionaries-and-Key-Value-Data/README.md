# 📘 Class 7: Dictionaries — Key-Value Data

> **Date: January 10, 2024** 🎯
> 
> Day 7 of my Python journey — mastering **dictionaries**, Python's key-value powerhouse!

---

## 🎯 What I Learned in Class 7

- What are dictionaries
- `key: value` pairs
- Accessing values by key
- `Dict[Key, Value]` type hints
- Adding / modifying / deleting items
- Dictionary methods: `keys()`, `values()`, `items()`, `get()`
- Nested dictionaries
- Looping through dictionaries
- Dictionary comprehension
- `pprint` for readable output
- Swapping variables in one line

---

## 📖 What is a Dictionary?

A **dictionary** stores data as **key : value** pairs.

| Concept | Meaning |
|---------|---------|
| **key** | Unique identifier (like index in list) |
| **value** | Data associated with key |
| **items** | All key-value pairs |

**Syntax:**
```python
data = {"key1": "value1", "key2": "value2"}
```

**Access:** `data["key1"]` → `"value1"`

---

## 🧩 Set vs List vs Dict

| Type | Syntax | Duplicates | Order |
|------|--------|-----------|-------|
| **List** | `[1, 2, 3]` | ✅ Yes | ✅ Ordered |
| **Set** | `{1, 2, 3}` | ❌ No | ❌ Unordered |
| **Dict** | `{"a": 1}` | ❌ Keys unique | ✅ Ordered* |

*Python 3.7+ keeps insertion order

---

## 💻 Basic Dictionary

```python
from typing import Dict
import pprint

data: Dict[str, str] = {
    "fname": "Muhhmad",
    "name": "eale",
    "education": "BSCS",
}

pprint.pprint(data)
```

**Output:**
```
{'education': 'BSCS', 'fname': 'Muhhmad', 'name': 'eale'}
```

**💡 Why `pprint`?** Prints dicts in a **clean, readable format** (better than `print` for nested data).

---

## 🔑 Union for Flexible Types

Dictionaries can hold **mixed types**:

```python
from typing import Dict, Union

Key = Union[int, str]
Value = Union[int, str, list, dict, tuple, set]

data: Dict[Key, Value] = {
    "fname": "Muhhmad",
    "1": "eale",
    "education": "BSCS",
}
```

**Output:**
```
{'1': 'eale', 'education': 'BSCS', 'fname': 'Muhhmad'}
```

**⚠️ Advantage:** No error if someone changes data types.

---

## 🧩 Set Example (Removes Duplicates)

```python
abc: set = {1, 2, 3, 2, 2, 2, 1, 1, 4}
print(abc)                        # {1, 2, 3, 4}

abcd: list[int] = list(abc)
print(abcd)                       # [1, 2, 3, 4]
```

**Set auto-removes duplicates.**

---

## 🔍 Accessing Values

```python
data: Dict[str, str] = {
    "fname": "Muhhmad",
    "name": "eale",
    "education": "BSCS",
}

print(data["fname"])       # Muhhmad
print(data["name"])        # eale
print(data["education"])   # BSCS
```

**⚠️ If key doesn't exist → `KeyError`**

---

## 🛠️ Dictionary Methods (11 total)

```python
data: dict = {"fname": "Muhhmad", "name": "eale"}

[i for i in dir(data) if "__" not in i]
```

**Output:**
```
['clear', 'copy', 'fromkeys', 'get', 'items',
 'keys', 'pop', 'popitem', 'setdefault',
 'update', 'values']
```

### All Methods

| Method | Purpose |
|--------|---------|
| `keys()` | All keys |
| `values()` | All values |
| `items()` | All key-value pairs |
| `get(k, default)` | Safe access |
| `pop(k)` | Remove & return value |
| `popitem()` | Remove last item |
| `clear()` | Remove all |
| `copy()` | Shallow copy |
| `update(d)` | Merge another dict |
| `setdefault(k, v)` | Get or set default |
| `fromkeys(keys, val)` | Create dict from keys |

---

## 🎁 Nested Dictionaries

Dictionaries can contain **lists, dicts, tuples** — anything!

```python
from typing import Dict, Union
import pprint

Key = Union[int, str]
Value = Union[int, str, list, tuple, set]

data: Dict[Key, Value] = {
    "fname": "Muhhmad",
    "name": "eale",
    "education": "BSCS",
    "abc": [1, 2, 5],
    "cde": {"a": 1, "b": 2},
}

print(data["fname"])           # Muhhmad
print(data["abc"])             # [1, 2, 5]
print(data["cde"])             # {'a': 1, 'b': 2}
print(data["cde"]["b"])        # 2  ← nested access!
```

---

## ✏️ Modify Values

Just assign to a key:

```python
data: Dict[str, str] = {"fname": "Muhhmad", "name": "eale"}
print(data)

data['name'] = "M.mishri"
print(data)
```

**Output:**
```
{'fname': 'Muhhmad', 'name': 'eale'}
{'fname': 'Muhhmad', 'name': 'M.mishri'}
```

---

## 🔍 `get()` — Safe Access

**Problem:** `data["missing"]` → **KeyError**

**Solution:** `data.get("missing", "default")` → returns default

```python
data: dict = {
    "fname": "Muhhmad",
    "abc": [1, 2, 5],
}

print(data.get("pakistan", 'NOT'))    # NOT
print(data.get("abc", 'NOT'))         # [1, 2, 5]
print(data.get("fname", 'NOT'))       # Muhhmad
```

**Use `get()` when you're not sure if key exists.**

---

## 🔁 Looping Through Dictionary

### 1. Loop keys only

```python
data: dict = {
    "fname": "Muhhmad",
    "name": "eale",
    "education": "BSCS",
}

for d in data:
    print(d)
```

**Output:**
```
fname
name
education
```

### 2. Keys, Values, Items

```python
print(data.keys())
print(data.values())
print(data.items())
```

**Output:**
```
dict_keys(['fname', 'name', 'education'])
dict_values(['Muhhmad', 'eale', 'BSCS'])
dict_items([('fname', 'Muhhmad'), ('name', 'eale'), ('education', 'BSCS')])
```

### 3. Best Practice — Loop with `items()`

```python
for k, v in data.items():
    print(k, v)
```

**Output:**
```
fname Muhhmad
name eale
education BSCS
abc [1, 2, 5]
cde {'a': 1, 'b': 2}
```

**✅ This is the most Pythonic way!**

---

## ⚡ Dictionary Comprehension

Like list comprehension, but for dicts.

**Syntax:** `{k: v for k, v in data.items()}`

```python
data: dict = {
    "fname": "Muhhmad",
    "name": "eale",
    "education": "BSCS",
}

{k: v for k, v in data.items()}
```

**Output:**
```
{'fname': 'Muhhmad', 'name': 'eale', 'education': 'BSCS'}
```

---

## 🔀 Swapping Values (Python Magic)

```python
a: int = 10
b: int = 5

a, b = b, a

print(a, b)   # 5 10
print(b, a)   # 10 5
```

**No temp variable needed!** Python unpacks `b, a` then assigns to `a, b`.

---

## 📂 Files in This Folder

| File | Purpose |
|------|---------|
| `class7.ipynb` | My Class 7 notebook |
| `readme.md` | This guide |

---

## 🎓 Key Takeaways

- ✅ Dict = `{key: value}` pairs
- ✅ Access with `data["key"]`
- ✅ `.get()` safer than `[]`
- ✅ `.items()` for looping (best practice)
- ✅ Keys are **unique**, values can repeat
- ✅ **Nested dicts** allow complex data
- ✅ `Union` for flexible types
- ✅ Dict comprehension for quick builds
- ✅ `a, b = b, a` swaps in one line
- ✅ `pprint` = readable output

---

## 📝 Practice Exercises

1. Create a dictionary for a student (name, age, grade)
2. Add a new key `city` to it
3. Loop through and print all keys + values
4. Use `.get()` to safely check a missing key
5. Create a nested dict for 3 students
6. Sort students by grade (use `sorted` with `key=lambda`)
7. Build a phonebook app with add/search/delete

---

## 🔗 Navigation

- **Previous:** [06-Conditional-Logic-and-If-Else](../06-Conditional-Logic-and-If-Else/)
- **Next:** [08-Functions-Mastery](../08-Functions-Mastery/)
- **Main:** [Python Complete Journey](../../README.md)

---

## 💡 Pro Tip

> **Use `.get()` instead of `[]` when checking user input.** 
> No crashes, no `KeyError` — just clean code.

---

**📅 Date:** January 10, 2024  
**🎯 Goal:** AI Engineer  
**⭐ Star this repo if it helps you!**

*"Dictionaries are how Python stores real-world data — master them!"*
