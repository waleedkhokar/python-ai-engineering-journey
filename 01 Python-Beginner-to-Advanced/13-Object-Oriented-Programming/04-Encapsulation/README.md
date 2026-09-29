# 📘 Class 16: OOP — Encapsulation

> **Date: January 18, 2024** 🎯
>
> Class 16 of my Python journey — learning Encapsulation in Object-Oriented Programming.

---

## 🎯 What I Learned

- What Encapsulation is.
- Why Encapsulation is useful.
- Public attributes and methods.
- Protected attributes and methods.
- Private attributes and methods.
- The meaning of `_name` and `__name`.
- Name mangling in Python.
- How to access private attributes safely.
- Getter methods.
- Setter methods.
- Using `@property`.
- Using `@property.setter`.
- Read-only properties.
- Data validation with setters.
- Encapsulation with methods.
- Encapsulation with inheritance.
- Encapsulation with `super()`.
- Real-world examples of Encapsulation.
- When to use Encapsulation.

---

# 📖 What is Encapsulation?

**Encapsulation** means keeping data and the methods that work with that data together inside a class.

It also allows us to control how the data can be accessed or changed.

In simple words:

> **Encapsulation = Keep data safe and control how it is used.**

### Example

A bank account has a balance.

We should not allow every part of a program to change the balance without checking the amount.

Instead, we can provide methods such as:

- `deposit()`
- `withdraw()`
- `get_balance()`

This gives us more control over the data.

---

# 🎯 Why is Encapsulation Useful?

Encapsulation helps us:

- ✅ Protect important data.
- ✅ Control how data is changed.
- ✅ Prevent unwanted changes.
- ✅ Keep code organized.
- ✅ Add validation.
- ✅ Make large applications easier to maintain.
- ✅ Hide internal implementation details.

---

# 📊 Access Levels in Python

Python commonly uses naming conventions to show different levels of access.

| Type | Syntax | Meaning |
|---|---|---|
| Public | `name` | Can be accessed normally |
| Protected | `_name` | Intended for the class and child classes |
| Private | `__name` | Name-mangled and not normally accessed directly |

> ⚠️ Python does not have strict private/protected access modifiers like some other languages. These are mainly conventions and Python's name-mangling mechanism.

---

# 1️⃣ Public Members

A **public member** can be accessed normally from outside the class.

### Example

```python
class Student:
    def __init__(self, name):
        self.name = name


student1 = Student("Waleed")

print(student1.name)
````

**Output:**

```text
Waleed
```

Here, `name` is public.

---

# 2️⃣ Protected Members

A **protected member** is written with one underscore:

```python
_name
```

It means:

> This member is intended to be used inside the class and its child classes.

Python does not strictly block access to it.

### Example

```python
class Person:
    def __init__(self, name):
        self._name = name


class Student(Person):
    def show_name(self):
        print(self._name)


student1 = Student("Waleed")

student1.show_name()
```

**Output:**

```text
Waleed
```

---

# 3️⃣ Private Members

A **private-style member** is written with two underscores:

```python
__name
```

Python uses **name mangling** for these names.

### Example

```python
class Person:
    def __init__(self, name):
        self.__name = name

    def show_name(self):
        print(self.__name)


person1 = Person("Waleed")

person1.show_name()
```

**Output:**

```text
Waleed
```

The private attribute is normally accessed through a method of the class.

---

# 4️⃣ Name Mangling

When an attribute starts with two underscores, Python changes its internal name.

For example:

```python
self.__name
```

is internally changed approximately to:

```python
self._Person__name
```

### Example

```python
class Person:
    def __init__(self):
        self.__name = "Waleed"


person1 = Person()

print(person1._Person__name)
```

**Output:**

```text
Waleed
```

> ⚠️ This is called **name mangling**. It is not the same as true private access control.

---

# 5️⃣ Getter Method

A **getter** is a method used to get or read private data.

### Example

```python
class Student:
    def __init__(self, name):
        self.__name = name

    def get_name(self):
        return self.__name


student1 = Student("Waleed")

print(student1.get_name())
```

**Output:**

```text
Waleed
```

---

# 6️⃣ Setter Method

A **setter** is a method used to change private data.

We can also add validation before changing the value.

### Example

```python
class Student:
    def __init__(self, age):
        self.__age = age

    def get_age(self):
        return self.__age

    def set_age(self, age):
        if age > 0:
            self.__age = age
        else:
            print("Age must be positive")


student1 = Student(23)

print(student1.get_age())

student1.set_age(24)

print(student1.get_age())
```

**Output:**

```text
23
24
```

---

# 7️⃣ Getter and Setter Together

Getters and setters allow us to control access to data.

### Example

```python
class BankAccount:
    def __init__(self, balance):
        self.__balance = balance

    def get_balance(self):
        return self.__balance

    def set_balance(self, balance):
        if balance >= 0:
            self.__balance = balance
        else:
            print("Balance cannot be negative")


account1 = BankAccount(5000)

print(account1.get_balance())

account1.set_balance(7000)

print(account1.get_balance())
```

**Output:**

```text
5000
7000
```

---

# 8️⃣ The `@property` Decorator

Python provides a cleaner way to create getters using `@property`.

Instead of calling:

```python
student1.get_name()
```

we can write:

```python
student1.name
```

### Example

```python
class Student:
    def __init__(self, name):
        self.__name = name

    @property
    def name(self):
        return self.__name


student1 = Student("Waleed")

print(student1.name)
```

**Output:**

```text
Waleed
```

---

# 9️⃣ `@property.setter`

We can use `@property.setter` to control how a property is changed.

### Example

```python
class Student:
    def __init__(self, age):
        self.__age = age

    @property
    def age(self):
        return self.__age

    @age.setter
    def age(self, value):
        if value > 0:
            self.__age = value
        else:
            print("Age must be positive")


student1 = Student(23)

print(student1.age)

student1.age = 24

print(student1.age)
```

**Output:**

```text
23
24
```

---

# 🔟 Data Validation

One of the most useful reasons for Encapsulation is **validation**.

We can prevent invalid data from entering our object.

### Example

```python
class Product:
    def __init__(self, price):
        self.__price = price

    @property
    def price(self):
        return self.__price

    @price.setter
    def price(self, value):
        if value >= 0:
            self.__price = value
        else:
            print("Price cannot be negative")


product1 = Product(1000)

product1.price = 1500

print(product1.price)

product1.price = -500
```

**Output:**

```text
1500
Price cannot be negative
```

---

# 1️⃣1️⃣ Read-Only Property

A property can be made **read-only** by providing a getter without a setter.

### Example

```python
class User:
    def __init__(self, username):
        self.__username = username

    @property
    def username(self):
        return self.__username


user1 = User("Waleed")

print(user1.username)
```

**Output:**

```text
Waleed
```

There is no setter, so the property cannot normally be changed using:

```python
user1.username = "Ali"
```

---

# 1️⃣2️⃣ Encapsulation with Methods

Encapsulation is not only about private variables.

We can also hide internal logic inside methods.

### Example

```python
class BankAccount:
    def __init__(self, balance):
        self.__balance = balance

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            print("Deposit successful")
        else:
            print("Invalid amount")

    def withdraw(self, amount):
        if amount <= 0:
            print("Invalid amount")
        elif amount > self.__balance:
            print("Insufficient balance")
        else:
            self.__balance -= amount
            print("Withdrawal successful")

    def get_balance(self):
        return self.__balance


account1 = BankAccount(5000)

account1.deposit(2000)
account1.withdraw(1000)

print(account1.get_balance())
```

**Output:**

```text
Deposit successful
Withdrawal successful
6000
```

The user interacts with methods instead of directly changing the balance.

---

# 1️⃣3️⃣ Encapsulation with Inheritance

Encapsulation also works with inheritance.

A child class can use protected members from its parent class.

### Example

```python
class Person:
    def __init__(self, name):
        self._name = name


class Student(Person):
    def introduce(self):
        print(f"My name is {self._name}")


student1 = Student("Waleed")

student1.introduce()
```

**Output:**

```text
My name is Waleed
```

---

# 1️⃣4️⃣ Private Members and Inheritance

Private attributes using `__` are name-mangled with the name of the class where they are created.

Because of this, a child class normally cannot access the parent's private attribute directly.

### Example

```python
class Person:
    def __init__(self):
        self.__name = "Waleed"


class Student(Person):
    def show_name(self):
        print(self.__name)


student1 = Student()

student1.show_name()
```

This causes an error because `Student` does not directly have access to the parent's `__name`.

A parent method can be used instead.

### Better Example

```python
class Person:
    def __init__(self):
        self.__name = "Waleed"

    def get_name(self):
        return self.__name


class Student(Person):
    def show_name(self):
        print(self.get_name())


student1 = Student()

student1.show_name()
```

**Output:**

```text
Waleed
```

---

# 1️⃣5️⃣ Encapsulation with `super()`

A child class can use `super()` to call parent functionality.

### Example

```python
class Person:
    def __init__(self, name):
        self.__name = name

    def get_name(self):
        return self.__name


class Student(Person):
    def introduce(self):
        print(f"My name is {super().get_name()}")


student1 = Student("Waleed")

student1.introduce()
```

**Output:**

```text
My name is Waleed
```

---

# 🎬 Real-World Example — Bank Account

A bank account is a good example of Encapsulation.

The balance should be controlled.

We should not allow invalid operations such as:

* Negative deposits.
* Negative withdrawals.
* Withdrawing more money than the balance.

### Example

```python
class BankAccount:
    def __init__(self, owner, balance):
        self.__owner = owner
        self.__balance = balance

    @property
    def owner(self):
        return self.__owner

    @property
    def balance(self):
        return self.__balance

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            print(f"Deposited: {amount}")
        else:
            print("Deposit must be greater than 0")

    def withdraw(self, amount):
        if amount <= 0:
            print("Withdrawal must be greater than 0")
        elif amount > self.__balance:
            print("Insufficient balance")
        else:
            self.__balance -= amount
            print(f"Withdrawn: {amount}")


account1 = BankAccount("Waleed", 5000)

print(account1.owner)
print(account1.balance)

account1.deposit(2000)
account1.withdraw(1000)

print(account1.balance)
```

**Output:**

```text
Waleed
5000
Deposited: 2000
Withdrawn: 1000
6000
```

---

# 🎬 Real-World Example — Employee Salary

Salary can also be controlled using a property.

```python
class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.__salary = salary

    @property
    def salary(self):
        return self.__salary

    @salary.setter
    def salary(self, value):
        if value >= 0:
            self.__salary = value
        else:
            print("Salary cannot be negative")


employee1 = Employee("Waleed", 100000)

print(employee1.salary)

employee1.salary = 120000

print(employee1.salary)
```

**Output:**

```text
100000
120000
```

---

# 📊 Public vs Protected vs Private

| Feature           | Public       | Protected               | Private                     |
| ----------------- | ------------ | ----------------------- | --------------------------- |
| Syntax            | `name`       | `_name`                 | `__name`                    |
| Normal access     | Yes          | Yes                     | Not directly                |
| Main idea         | Open access  | Internal-use convention | Name mangling               |
| Child class       | Yes          | Yes                     | Not directly                |
| Strict protection | No           | No                      | No                          |
| Common use        | General data | Internal/subclass data  | Hide implementation details |

---

# 📊 Getter vs Setter vs Property

| Feature            | Purpose                | Example            |
| ------------------ | ---------------------- | ------------------ |
| Getter             | Read data              | `get_age()`        |
| Setter             | Change data            | `set_age()`        |
| `@property`        | Read like an attribute | `student.age`      |
| `@property.setter` | Control assignment     | `student.age = 24` |

---

# ⚠️ Important Python Point

Python does not provide strict access modifiers like:

```text
private
protected
public
```

Instead, Python uses:

* `name` → public convention
* `_name` → protected convention
* `__name` → private-style name mangling

The goal is mainly to communicate how a member should be used and to avoid accidental access.

---

# 🧠 Encapsulation vs Data Hiding

These concepts are related but not exactly the same.

### Encapsulation

Keeping data and methods together inside a class and controlling access to the data.

### Data Hiding

Making internal data harder to access directly.

Python supports data hiding mainly through naming conventions and name mangling.

---

# 🏗️ When Should We Use Encapsulation?

Encapsulation is useful when:

* Data should not be changed directly.
* Data needs validation.
* A class has important internal rules.
* You want to hide implementation details.
* You want to control how users interact with an object.
* You are building larger applications.

---

# 💼 Real-World Use in Software

Encapsulation is commonly useful in:

* 💳 Banking systems
* 🛒 E-commerce applications
* 👤 User management
* 🏥 Hospital systems
* 📦 Inventory systems
* 💰 Payment systems
* 🤖 AI applications
* 🌐 Backend APIs
* 🗄️ Database applications

For example, in an e-commerce backend, you may not want code from every part of the application to directly modify an order's payment status. A method such as `mark_as_paid()` can control that operation.

---

# 🎓 Key Takeaways

* ✅ Encapsulation keeps data and related methods together.
* ✅ It helps control how data is accessed and changed.
* ✅ Public members use normal names.
* ✅ Protected members use `_name`.
* ✅ Private-style members use `__name`.
* ✅ Python uses name mangling for double-underscore names.
* ✅ Getters can be used to read private data.
* ✅ Setters can be used to change data safely.
* ✅ `@property` provides a cleaner getter syntax.
* ✅ `@property.setter` allows controlled assignment.
* ✅ Setters can validate data.
* ✅ Read-only properties can be created without a setter.
* ✅ Encapsulation can be used with inheritance.
* ✅ Encapsulation is useful in real-world software systems.

---

# 📝 Practice Exercises

## 🟢 Beginner

1. Create a `Student` class with a public `name` attribute.
2. Create a `Person` class with a protected `_age` attribute.
3. Create a `BankAccount` class with a private `__balance`.
4. Create a method to display the private balance.
5. Create a private `__password` attribute.

## 🟡 Intermediate

6. Create getter and setter methods for a student's age.
7. Add validation so age cannot be negative.
8. Create a `Product` class with a private price.
9. Use `@property` to read the price.
10. Use `@property.setter` to validate the price.
11. Create a read-only username property.
12. Create a `BankAccount` with deposit and withdrawal validation.

## 🔴 Advanced

13. Create an employee system with private salary.
14. Create a parent class with protected data and access it from a child class.
15. Create a parent class with a private attribute and access it through a parent method.
16. Use `super()` with encapsulated data.
17. Build a complete bank account system using Encapsulation.
18. Build a product system with price validation.
19. Build a user account system with a private password.
20. Create a real-world class where invalid data cannot be stored.

---

# 📂 Files in This Folder

| File            | Purpose                                                          |
| --------------- | ---------------------------------------------------------------- |
| `class16.ipynb` | Notebook with Encapsulation explanations, examples, and practice |
| `README.md`     | Complete guide to Python Encapsulation                           |

---

# 🔗 Navigation

* **Previous:** [Class 15 — Polymorphism](../03-Polymorphism/)
* **Next:** [Python OOP — Advanced Topics](../)
* **Main:** [Python AI Engineering Journey](../../README.md)

---

## 💡 Pro Tip

> Don't think of Encapsulation as simply "making variables private." The bigger idea is **controlling how an object's data is used and changed**.

---

**📅 Date:** January 18, 2024
**🎯 Goal:** Full-Stack AI Engineer

*“Good code does not only work — it also protects its data and controls its behavior.”*
