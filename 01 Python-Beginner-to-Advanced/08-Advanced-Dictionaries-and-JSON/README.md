# 📘 Class 8: Advanced Dictionaries & JSON

> **Date: January 11, 2024** 🎯
> 
> Day 8 of my Python journey — going deeper into dictionaries and JSON!

---

## 🎯 What I Learned in Class 8

- Dictionary methods (advanced)
- `clear()` — empty a dict
- `pop()` — remove & return value
- `popitem()` — remove last item
- `get()` — safe access with default
- `setdefault()` — get or create
- `update()` — merge dicts
- `sorted()` — sort dict keys/values
- Nested dictionaries
- Looping with `.items()`
- **JSON** — dict ↔ JSON string
- `json.dumps()` for pretty output
- Real-world: dict as database

---

## 🛠️ Dictionary Methods Recap (11 total)

| Method | Purpose |
|--------|---------|
| `clear()` | Remove all items |
| `copy()` | Shallow copy |
| `fromkeys()` | Create dict from keys |
| `get(k, default)` | Safe access |
| `items()` | All key-value pairs |
| `keys()` | All keys |
| `pop(k)` | Remove & return value |
| `popitem()` | Remove last item |
| `setdefault(k, v)` | Get or create |
| `update(d)` | Merge another dict |
| `values()` | All values |

---

## 🧹 `clear()` — Empty a Dictionary

```python
from typing import Dict, Union
import pprint

key = Union[int, str]
Value = Union[int, str, list, tuple, set]

data: Dict[key, Value] = {
    "fname": "Muhhmad",
    "name": "eale",
    "education": "BSCS",
    "abc": [1, 2, 5],
    "cde": {"a": 1, "b": 2},
}

print("Before", data)
data.clear()
print("After", data)
```

**Output:**
```
Before {'fname': 'Muhhmad', 'name': 'eale', 'education': 'BSCS', 'abc': [1, 2, 5], 'cde': {'a': 1, 'b': 2}}
After {}
```

**⚠️ `clear()` empties but keeps the variable. `del data` deletes the variable itself.**

```python
data: Dict[key, Value] = {"a": 1, "b": 2}
del data
print(data)  # ❌ NameError: name 'data' is not defined
```

---

## 🔙 `pop(key)` — Remove & Return Value

```python
data: Dict[str, str] = {
    "fname": "Muhhmad",
    "name": "eale",
    "education": "BSCS",
}

print("Before", data)

a: str = data.pop("education")
print(a)                        # BSCS

print("After", data)
```

**Output:**
```
Before {'fname': 'Muhhmad', 'name': 'eale', 'education': 'BSCS'}
BSCS
After {'fname': 'Muhhmad', 'name': 'eale'}
```

**Use `pop()` when you need the removed value.**

---

## 📤 `popitem()` — Remove Last Item

```python
data: Dict[str, str] = {
    "fname": "Muhhmad",
    "name": "eale",
    "education": "BSCS",
    "abc": [1, 2, 5],
    "cde": {"a": 1, "b": 2},
}

print("Before", data)

a = data.popitem()
print(a)                        # ('cde', {'a': 1, 'b': 2})

print("After", data)
```

**Output:**
```
Before {'fname': 'Muhhmad', 'name': 'eale', 'education': 'BSCS', 'abc': [1, 2, 5], 'cde': {'a': 1, 'b': 2}}
('cde', {'a': 1, 'b': 2})
After {'fname': 'Muhhmad', 'name': 'eale', 'education': 'BSCS', 'abc': [1, 2, 5]}
```

**Removes and returns the LAST key-value pair.**

---

## 🔍 `get(key, default)` — Safe Access

```python
data: Dict[str, str] = {
    "fname": "Muhhmad",
    "name": "eale",
    "education": "BSCS",
}

a: str = data.get("education", "NOT")
print(a)                        # BSCS

b: str = data.get("missing", "NOT")
print(b)                        # NOT

# data remains unchanged
print("After", data)
```

**Output:**
```
BSCS
NOT
After {'fname': 'Muhhmad', 'name': 'eale', 'education': 'BSCS'}
```

**⚠️ Without `get()`, missing key = `KeyError`**
```python
print(data["missing"])   # ❌ KeyError: 'missing'
```

---

## 🆕 `setdefault(key, default)` — Get or Create

```python
data: Dict[str, str] = {
    "fname": "Muhhmad",
    "name": "eale",
    "education": "BSCS",
}

print("Before", data)

a = data.setdefault("education_new")
print(a)                        # None

b = data.setdefault("education_new", "empty value")
print(b)                        # empty value

print("After", data)
```

**Output:**
```
Before {'fname': 'Muhhmad', 'name': 'eale', 'education': 'BSCS'}
None
empty value
After {'fname': 'Muhhmad', 'name': 'eale', 'education': 'BSCS', 'education_new': None}
```

**Behavior:**
- If key **exists** → returns its value
- If key **missing** → creates it with default, returns default

---

## 🔗 `update()` — Merge Dicts

```python
data: Dict[str, str] = {
    "fname": "Muhhmad",
    "name": "eale",
    "education": "BSCS",
    "abc": [1, 2, 5],
    "cde": {"a": 1, "b": 2},
}

data1: Dict[str, str] = {
    "fname": "Muhhmad",
    "name": "Qasim",
    "Age": "30",
    "Height": "5:10",
}

data.update(data1)
data
```

**Output:**
```
{'fname': 'Muhhmad',
 'name': 'Qasim',
 'education': 'BSCS',
 'abc': [1, 2, 5],
 'cde': {'a': 1, 'b': 2},
 'Age': '30',
 'Height': '5:10'}
```

**⚠️ `update()` OVERWRITES existing keys:**
- `"name"` changed: `"eale"` → `"Qasim"` ✅
- New keys added: `Age`, `Height` ✅

---

## 🔢 `sorted()` — Sort Dict

```python
favorite_languages = {
    'jen': 'python',
    'sarah': 'c',
    'edward': 'rust',
    'phil': 'python',
}

for name in sorted(favorite_languages.keys()):
    print(f"{name.title()}, thank you for taking the poll.")
```

**Output:**
```
Edward, thank you for taking the poll.
Jen, thank you for taking the poll.
Phil, thank you for taking the poll.
Sarah, thank you for taking the poll.
```

**Sorts keys alphabetically!**

### Sort by Value

```python
data_base = [(0, 50, 'B'), (1, 60, 'A'), (2, 70, 'A+')]

sorted(data_base, key=lambda x: x[1], reverse=True)
```

**Output:**
```
[(2, 70, 'A+'), (1, 60, 'A'), (0, 50, 'B')]
```

**`key=lambda x: x[1]` = sort by 2nd element (percentage)**

---

## 🎁 Nested Dictionary Access

```python
data: Dict[str, Any] = {
    "fname": "Muhhmad",
    "abc": [1, 2, 5],
    "cde": {"a": 1, "b": 2},
}

print(data["fname"])           # Muhhmad
print(data["abc"])             # [1, 2, 5]
print(data["cde"])             # {'a': 1, 'b': 2}
print(data["cde"]["b"])        # 2  ← nested access!
```

---

## 🔁 Loop Through Dictionary

```python
data: Dict[str, str] = {
    "fname": "Muhhmad",
    "name": "eale",
    "education": "BSCS",
}

for k, v in data.items():
    print(k, v)
```

**Output:**
```
fname Muhhmad
name eale
education BSCS
```

**Best practice: use `.items()` for key + value.**

---

## 📄 JSON — Dict to String

**JSON = JavaScript Object Notation** — universal data format.

### Convert Dict → JSON String

```python
import json

data: Dict[str, str] = {
    "fname": "Muhhmad",
    "name": "eale",
    "education": "BSCS",
}

data1 = json.dumps(data, indent=2)

print(type(data1))     # <class 'str'>
print(data1)
```

**Output:**
```json
{
  "fname": "Muhhmad",
  "name": "eale",
  "education": "BSCS"
}
```

**Why?**
- ✅ Send to API
- ✅ Save to file
- ✅ Share with other languages
- ✅ Web requests

---

## 🔄 JSON ↔ Python Conversion

| Python | JSON | Method |
|--------|------|--------|
| `dict` | `object` | `json.dumps()` |
| `list` | `array` | `json.dumps()` |
| `str` | `string` | `json.dumps()` |
| JSON string | dict | `json.loads()` |

```python
import json

# Dict → JSON string
json_str = json.dumps({"a": 1, "b": 2})
print(json_str)                  # {"a": 1, "b": 2}

# JSON string → Dict
data = json.loads('{"a": 1, "b": 2}')
print(data)                      # {'a': 1, 'b': 2}
print(type(data))                # <class 'dict'>
```

---

## 🎬 Real-World Example: Alien Game

```python
alien = {'color': 'green', 'points': 5}
print(alien['color'])     # green
print(alien['points'])    # 5
```

### Moving Alien Based on Speed

```python
alien = {'x_position': 0, 'y_position': 25, 'speed': 'medium'}

print(f"Original position: {alien['x_position']}")

if alien['speed'] == 'slow':
    x_increment = 1
elif alien['speed'] == 'medium':
    x_increment = 3
else:
    x_increment = 4

alien['x_position'] = alien['x_position'] + x_increment
print(f"New position: {alien['x_position']}")
```

**Output:**
```
Original position: 0
New position: 3
```

---

## 👥 Loop with `.keys()` and Check

```python
favorite_languages = {
    'jen': 'python',
    'sarah': 'c',
    'edward': 'rust',
    'phil': 'python',
}

friends = ['phil', 'sarah']

for name in favorite_languages.keys():
    print(f"Hi {name.title()}.")
    if name in friends:
        language = favorite_languages[name].title()
        print(f"\t{name.title()}, I see you love {language}!")
```

**Output:**
```
Hi Jen.
Hi Sarah.
	Sarah, I see you love C!
Hi Edward.
Hi Phil.
	Phil, I see you love Python!
```

---

## 🎯 `get()` with Default — Better User Experience

```python
alien_0 = {'color': 'green', 'speed': 'slow'}
point_value = alien_0.get('points', 'No point value assigned.')
print(point_value)
```

**Output:**
```
No point value assigned.
```

**No crash, graceful fallback!**

---

## 📚 List of Aliens (List of Dicts)

```python
alien_0 = {'color': 'green', 'points': 5}
alien_1 = {'color': 'yellow', 'points': 10}
alien_2 = {'color': 'red', 'points': 15}

aliens = [alien_0, alien_1, alien_2]
for alien in aliens:
    print(alien)
```

**Output:**
```
{'color': 'green', 'points': 5}
{'color': 'yellow', 'points': 10}
{'color': 'red', 'points': 15}
```

### Create 30 Aliens Dynamically

```python
aliens: list[dict] = []

for alien_number in range(30):
    new_alien = {'color': 'green', 'points': 5, 'speed': 'slow'}
    aliens.append(new_alien)

for alien in aliens[:5]:
    print(alien)

print(f"Total number of aliens: {len(aliens)}")
```

---

## 📂 Files in This Folder

| File | Purpose |
|------|---------|
| `class8.ipynb` | My Class 8 notebook (dict methods + JSON) |
| `practice.ipynb` | Practice exercises |
| `README.md` | This guide |

---

## 🎓 Key Takeaways

- ✅ `clear()` empties dict, `del` removes variable
- ✅ `pop(key)` removes & returns value
- ✅ `popitem()` removes last item
- ✅ `get()` safer than `[]` — no crashes
- ✅ `setdefault()` creates if missing
- ✅ `update()` merges dicts (overwrites)
- ✅ `sorted()` sorts dict keys
- ✅ Nested access: `data["outer"]["inner"]`
- ✅ `.items()` best for looping
- ✅ JSON = universal data format
- ✅ `json.dumps()` with `indent=2` for readable

---

## 📝 Practice Exercises

1. Create a dict of 5 countries → capitals
2. Use `pop()` to remove 2 countries
3. Use `get()` to safely access a missing country
4. Use `setdefault()` to add default if missing
5. Merge 2 dicts with `update()`
6. Sort dict keys with `sorted()`
7. Convert dict → JSON string with `indent=4`
8. Build a mini phonebook with dict

---

## 🔗 Navigation

- **Previous:** [07-Dictionaries-and-Key-Value-Data](../07-Dictionaries-and-Key-Value-Data/)
- **Next:** [09-Loops-Input-and-Control-Flow](../09-Loops-Input-and-Control-Flow/)
- **Main:** [Python Complete Journey](../../README.md)

---

## 💡 Pro Tip

> **`get()` and `setdefault()` are your best friends** for handling user data safely.
> No more `KeyError` crashes!

---

**📅 Date:** January 11, 2024  
**🎯 Goal:** AI Engineer  
**⭐ Star this repo if it helps you!**

*"Advanced dict methods = professional Python code!"*
