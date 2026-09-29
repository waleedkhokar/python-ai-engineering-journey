# 📘 Class 10: Functions — Introduction

> **Date: January 12, 2024** 🎯
> 
> Day 10 of my Python journey — learning to write reusable code with functions!

---

## 🎯 What I Learned in Class 10

- What are functions
- Pre-defined vs user-defined functions
- Return vs non-return functions
- Function components: declaration, body, calling
- Function syntax with type hints
- Default parameters
- Multiple return values
- Functions calling functions
- Real-world: BMI calculator

---

## 🔧 What is a Function?

A **function** is a reusable block of code that performs a specific task.

**Think of it like:**
- A machine — takes input, gives output
- A recipe — follow steps, get result

### Why Functions?

| Benefit | Why |
|---------|-----|
| **Reusability** | Write once, use many times |
| **Organization** | Break big code into small pieces |
| **Readability** | Named code explains itself |
| **Testing** | Easy to test small pieces |
| **DRY** | Don't Repeat Yourself |

---

## 📋 Two Types of Functions

### 1. Pre-defined (Built-in)
Provided by Python. Ready to use.

Examples:
- `print()`
- `len()`
- `dir()`
- `chr()`
- `ord()`
- `exec()`
- `type()`
- `id()`
- `max()`
- `min()`
- `sum()`

### 2. User-defined
Custom functions you create with `def`.

```python
def my_function():
    # your code
```

---

## 🎁 Return vs Non-Return Functions

### Return Function
- Gives back a value
- Can be stored in a variable
- Use `return` keyword

```python
def add(a, b):
    return a + b

result = add(3, 5)     # result = 8
```

### Non-Return Function
- Doesn't give back a value
- Runs and finishes
- Returns `None` by default

```python
def greet(name):
    print(f"Hello, {name}")

greet("Waleed")        # prints, but returns None
```

---

## ⚠️ `print()` is Non-Return

```python
a: str = print("pakistan")
print(a)
print(type(a))
```

**Output:**
```
pakistan
None
<class 'NoneType'>
```

**⚠️ `print()` shows output but returns `None`!**

---

## ✅ User-defined Function (with return)

```python
def add(a: int, b: int) -> int:
    """Add two numbers and return result."""
    return a + b

result: int = add(3, 5)
print(f"3 + 5 = {result}")
print(f"Type: {type(result)}")
```

**Output:**
```
3 + 5 = 8
Type: <class 'int'>
```

---

## ✅ User-defined Function (non-return)

```python
def greet(name: str) -> None:
    """Print greeting (no return)."""
    print(f"Hello, {name}!")

greet("Waleed")

result = greet("Ali")
print(f"greet() returns: {result}")
```

**Output:**
```
Hello, Waleed!
Hello, Ali!
greet() returns: None
```

---

## 🏗️ Function Components

Every function has **3 parts**:

### 1. Declaration (Define)
```python
def function_name(param1: type, param2: type) -> returnType:
    # function body
```

### 2. Body
The code inside that runs when called.

### 3. Calling
```python
function_name(arg1, arg2)
```

---

## 📝 Function Syntax Template

```python
def function_name(param1: type, param2: type) -> returnType:
    """
    Docstring explaining what this does.
    """
    # function body
    return result

# Call it
function_name(arg1, arg2)
```

---

## 📚 Type Hints + Docstring Example

```python
def multiply(x: float, y: float) -> float:
    """
    Multiply two numbers.
    
    Parameters:
        x (float): First number
        y (float): Second number
    
    Returns:
        float: Product of x and y
    """
    return x * y

print(multiply(2.5, 4.0))
print(multiply.__doc__)     # see the docstring
```

**Output:**
```
10.0

    Multiply two numbers.
    
    Parameters:
        x (float): First number
        y (float): Second number
    
    Returns:
        float: Product of x and y
```

---

## 🎁 Default Parameters

```python
def welcome(name: str, greeting: str = "Hello") -> str:
    """Greet with optional custom greeting."""
    return f"{greeting}, {name}!"

print(welcome("Waleed"))                    # uses default
print(welcome("Ali", "Assalam-o-Alaikum"))  # custom
```

**Output:**
```
Hello, Waleed!
Assalam-o-Alaikum, Ali!
```

---

## 🎯 Multiple Return Values

```python
def get_min_max(numbers: list[int]) -> tuple[int, int]:
    """Return both min and max."""
    return min(numbers), max(numbers)

lowest, highest = get_min_max([4, 8, 1, 15, 7])
print(f"Min: {lowest}, Max: {highest}")
```

**Output:**
```
Min: 1, Max: 15
```

---

## 🔗 Function Calling Function

```python
def square(n: int) -> int:
    return n * n

def sum_of_squares(a: int, b: int) -> int:
    return square(a) + square(b)

print(sum_of_squares(3, 4))     # 9 + 16 = 25
```

**Output:**
```
25
```

---

## 🌍 Real-World Example: BMI Calculator

```python
def calculate_bmi(weight_kg: float, height_m: float) -> float:
    """
    Calculate BMI = weight / (height²)
    
    Args:
        weight_kg: Weight in kilograms
        height_m: Height in meters
    
    Returns:
        BMI value (rounded to 2 decimals)
    """
    bmi = weight_kg / (height_m ** 2)
    return round(bmi, 2)

print(calculate_bmi(70, 1.75))   # 22.86


def bmi_category(bmi: float) -> str:
    """Return BMI category."""
    if bmi < 18.5:
        return "Underweight"
    elif bmi < 25:
        return "Normal"
    elif bmi < 30:
        return "Overweight"
    else:
        return "Obese"

bmi = calculate_bmi(70, 1.75)
print(f"BMI: {bmi} → {bmi_category(bmi)}")
```

**Output:**
```
22.86
BMI: 22.86 → Normal
```

---

## 🔍 Built-in Function Examples

| Function | Purpose | Returns |
|----------|---------|---------|
| `print()` | Show output | `None` |
| `len()` | Length of collection | `int` |
| `type()` | Data type | `<class>` |
| `id()` | Memory address | `int` |
| `dir()` | List methods | `list` |
| `chr()` | Number → character | `str` |
| `ord()` | Character → number | `int` |
| `max()` | Highest value | number |
| `min()` | Lowest value | number |
| `sum()` | Total of list | number |
| `int()` | Convert to int | `int` |
| `str()` | Convert to string | `str` |
| `abs()` | Absolute value | number |
| `round()` | Round decimal | number |

```python
x: int = len("Pakistan")
print(x)            # 8

y: str = chr(65)
print(y)            # A

z: int = ord('A')
print(z)            # 65

print("Hello")      # prints, returns None

result = print("test")
print(f"print() returns: {result}")
```

**Output:**
```
8
A
65
Hello
test
print() returns: None
```

---

## 📂 Files in This Folder

| File | Purpose |
|------|---------|
| `class10.ipynb` | My Class 10 notebook |
| `README.md` | This guide |

---

## 🎓 Key Takeaways

- ✅ Functions = reusable code blocks
- ✅ **Pre-defined** = Python provides (`print`, `len`)
- ✅ **User-defined** = you create with `def`
- ✅ **Return** = gives back value, can store
- ✅ **Non-return** = runs only, returns `None`
- ✅ 3 parts: declaration, body, calling
- ✅ Type hints make code clearer
- ✅ **Docstring** documents your function
- ✅ **Default params** make args optional
- ✅ Functions can return **multiple values**
- ✅ Functions can call other functions

---

## 📝 Practice Exercises

1. Check the return type of `len("hello")`
2. Check what `print("hi")` returns
3. Try `type(max([1, 5, 3]))`
4. Test `chr(97)` and `ord('z')`
5. Print `sum([1, 2, 3, 4, 5])`
6. Write a `double(n)` function that returns `n * 2`
7. Write a `greet(name, greeting="Hello")` function
8. Write a `min_max(numbers)` function returning both

---

## 🔗 Navigation

- **Previous:** [09-Loops-Input-and-Control-Flow](../09-Loops-Input-and-Control-Flow/)
- **Next:** [11-User-Defined-Functions](../11-User-Defined-Functions/)
- **Main:** [Python Complete Journey](../../README.md)

---

## 💡 Pro Tip

> **Docstrings are your best friend.** Write them for every function.
> In 3 months, you'll thank yourself!

---

**📅 Date:** January 12, 2024  
**🎯 Goal:** AI Engineer  
**⭐ Star this repo if it helps you!**

*"Functions are the building blocks of clean code — learn them well!"*
