# 📘 Class 14: OOP — Inheritance

> **Date: January 16, 2024** 🎯
>
> Class 14 of my Python journey — learning Inheritance in Object-Oriented Programming.

---

## 🎯 What I Learned

- What inheritance is.
- What parent and child classes are.
- How a child class gets features from a parent class.
- Single inheritance.
- Multilevel inheritance.
- Multiple inheritance.
- Hierarchical inheritance.
- Hybrid inheritance.
- The `super()` function.
- Method overriding.
- Constructor inheritance.
- Attributes and methods in inheritance.
- Method Resolution Order (MRO).
- The Diamond Problem.
- `isinstance()` and `issubclass()`.
- Protected and private members with inheritance.
- Abstract classes and inheritance.
- Composition vs inheritance.
- Real-world uses of inheritance.

---

## 📖 What is Inheritance?

**Inheritance** is an OOP feature that allows one class to use the attributes and methods of another class.

The class that gives the features is called the **parent class**.

The class that receives the features is called the **child class**.

Inheritance helps us reuse existing code instead of writing the same code again.

---

## 👨‍👦 Parent Class and Child Class

A **parent class** is the class from which another class inherits.

A **child class** is the class that inherits from the parent class.

### Example

```python
class Animal:
    def eat(self):
        print("Animal is eating")


class Dog(Animal):
    pass


dog1 = Dog()

dog1.eat()
````

**Output:**

```text
Animal is eating
```

Here:

* `Animal` is the parent class.
* `Dog` is the child class.
* `Dog` inherits the `eat()` method from `Animal`.

---

# 1️⃣ Single Inheritance

**Single inheritance** means one child class inherits from one parent class.

### Example

```python
class Animal:
    def eat(self):
        print("Animal is eating")


class Dog(Animal):
    def bark(self):
        print("Dog is barking")


dog1 = Dog()

dog1.eat()
dog1.bark()
```

**Output:**

```text
Animal is eating
Dog is barking
```

The `Dog` class can use:

* `eat()` from the parent.
* `bark()` from itself.

---

# 2️⃣ Multilevel Inheritance

**Multilevel inheritance** means inheritance happens in multiple levels.

For example:

```text
Animal
   ↓
Dog
   ↓
Puppy
```

### Example

```python
class Animal:
    def eat(self):
        print("Animal is eating")


class Dog(Animal):
    def bark(self):
        print("Dog is barking")


class Puppy(Dog):
    def play(self):
        print("Puppy is playing")


puppy1 = Puppy()

puppy1.eat()
puppy1.bark()
puppy1.play()
```

**Output:**

```text
Animal is eating
Dog is barking
Puppy is playing
```

The `Puppy` class gets features from both `Dog` and `Animal`.

---

# 3️⃣ Multiple Inheritance

**Multiple inheritance** means one child class inherits from more than one parent class.

### Example

```python
class Father:
    def work(self):
        print("Father is working")


class Mother:
    def care(self):
        print("Mother is caring")


class Child(Father, Mother):
    pass


child1 = Child()

child1.work()
child1.care()
```

**Output:**

```text
Father is working
Mother is caring
```

The `Child` class inherits from both `Father` and `Mother`.

---

# 4️⃣ Hierarchical Inheritance

**Hierarchical inheritance** means multiple child classes inherit from the same parent class.

Example:

```text
        Animal
       /      \
     Dog      Cat
```

### Example

```python
class Animal:
    def eat(self):
        print("Animal is eating")


class Dog(Animal):
    def bark(self):
        print("Dog is barking")


class Cat(Animal):
    def meow(self):
        print("Cat is meowing")


dog1 = Dog()
cat1 = Cat()

dog1.eat()
dog1.bark()

cat1.eat()
cat1.meow()
```

**Output:**

```text
Animal is eating
Dog is barking
Animal is eating
Cat is meowing
```

---

# 5️⃣ Hybrid Inheritance

**Hybrid inheritance** is a combination of two or more types of inheritance.

For example:

```text
        Animal
       /      \
     Dog      Cat
       \      /
        Pet
```

### Example

```python
class Animal:
    def eat(self):
        print("Animal is eating")


class Dog(Animal):
    def bark(self):
        print("Dog is barking")


class Cat(Animal):
    def meow(self):
        print("Cat is meowing")


class Pet(Dog, Cat):
    pass


pet1 = Pet()

pet1.eat()
pet1.bark()
pet1.meow()
```

**Output:**

```text
Animal is eating
Dog is barking
Cat is meowing
```

Python uses **Method Resolution Order (MRO)** to decide which class to search first.

---

# 6️⃣ `super()` Function

The `super()` function is used to access methods or the constructor of a parent class.

### Example

```python
class Animal:
    def __init__(self, name):
        self.name = name


class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)
        self.breed = breed


dog1 = Dog("Buddy", "German Shepherd")

print(dog1.name)
print(dog1.breed)
```

**Output:**

```text
Buddy
German Shepherd
```

### Why use `super()`?

It allows the child class to use parent-class functionality without directly writing the parent class name.

---

# 7️⃣ Method Overriding

**Method overriding** happens when a child class creates a method with the same name as a method in the parent class.

The child version is used when called from the child object.

### Example

```python
class Animal:
    def sound(self):
        print("Animal makes a sound")


class Dog(Animal):
    def sound(self):
        print("Dog barks")


dog1 = Dog()

dog1.sound()
```

**Output:**

```text
Dog barks
```

The `Dog` class overrides the `sound()` method from `Animal`.

---

# 8️⃣ Calling the Parent Method with `super()`

We can also call the parent's version of an overridden method.

### Example

```python
class Animal:
    def sound(self):
        print("Animal makes a sound")


class Dog(Animal):
    def sound(self):
        super().sound()
        print("Dog barks")


dog1 = Dog()

dog1.sound()
```

**Output:**

```text
Animal makes a sound
Dog barks
```

---

# 9️⃣ Constructor Inheritance

A child class can use the parent's `__init__()` constructor if it does not define its own constructor.

### Example

```python
class Person:
    def __init__(self, name):
        self.name = name


class Student(Person):
    pass


student1 = Student("Waleed")

print(student1.name)
```

**Output:**

```text
Waleed
```

The `Student` class uses the constructor inherited from `Person`.

---

# 🔟 Child Constructor with Parent Constructor

If the child class has its own `__init__()`, it can use `super()` to call the parent constructor.

### Example

```python
class Person:
    def __init__(self, name):
        self.name = name


class Student(Person):
    def __init__(self, name, university):
        super().__init__(name)
        self.university = university


student1 = Student("Waleed", "MIU")

print(student1.name)
print(student1.university)
```

**Output:**

```text
Waleed
MIU
```

---

# 1️⃣1️⃣ Inheriting Attributes and Methods

A child class can use both:

* Parent attributes.
* Parent methods.

It can also add its own attributes and methods.

### Example

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def introduce(self):
        print(f"My name is {self.name}")


class Student(Person):
    def study(self):
        print(f"{self.name} is studying")


student1 = Student("Waleed", 23)

print(student1.age)
student1.introduce()
student1.study()
```

**Output:**

```text
23
My name is Waleed
Waleed is studying
```

---

# 1️⃣2️⃣ Method Resolution Order (MRO)

**MRO** tells Python the order in which it searches classes for a method or attribute.

We can check MRO using:

```python
ClassName.mro()
```

or:

```python
ClassName.__mro__
```

### Example

```python
class A:
    pass


class B(A):
    pass


class C(B):
    pass


print(C.mro())
```

**Output:**

```text
[<class '__main__.C'>, <class '__main__.B'>, <class '__main__.A'>, <class 'object'>]
```

Python searches:

```text
C → B → A → object
```

---

# 1️⃣3️⃣ The Diamond Problem

The **Diamond Problem** can happen with multiple inheritance.

Example:

```text
        A
       / \
      B   C
       \ /
        D
```

Both `B` and `C` inherit from `A`.

Then `D` inherits from both `B` and `C`.

Python uses **MRO** to decide the order in which classes are searched.

### Example

```python
class A:
    def show(self):
        print("A")


class B(A):
    def show(self):
        print("B")


class C(A):
    def show(self):
        print("C")


class D(B, C):
    pass


d1 = D()

d1.show()

print(D.mro())
```

**Output:**

```text
B
[<class '__main__.D'>, <class '__main__.B'>, <class '__main__.C'>, <class '__main__.A'>, <class 'object'>]
```

Python checks `B` before `C` because of the MRO.

---

# 1️⃣4️⃣ `isinstance()`

`isinstance()` checks whether an object belongs to a particular class or its child classes.

### Example

```python
class Animal:
    pass


class Dog(Animal):
    pass


dog1 = Dog()

print(isinstance(dog1, Dog))
print(isinstance(dog1, Animal))
```

**Output:**

```text
True
True
```

A `Dog` object is also considered an `Animal` because `Dog` inherits from `Animal`.

---

# 1️⃣5️⃣ `issubclass()`

`issubclass()` checks whether one class is a child of another class.

### Example

```python
class Animal:
    pass


class Dog(Animal):
    pass


print(issubclass(Dog, Animal))
print(issubclass(Animal, Dog))
```

**Output:**

```text
True
False
```

---

# 1️⃣6️⃣ Protected Members

Python uses `_name` as a convention for a **protected** member.

It means:

> This member is intended to be used inside the class and its child classes.

Python does not strictly prevent access.

### Example

```python
class Person:
    def __init__(self):
        self._name = "Waleed"


class Student(Person):
    def show_name(self):
        print(self._name)


student1 = Student()

student1.show_name()
```

**Output:**

```text
Waleed
```

---

# 1️⃣7️⃣ Private Members

Python uses `__name` for a **private** attribute.

Python changes its internal name using **name mangling**.

### Example

```python
class Person:
    def __init__(self):
        self.__name = "Waleed"

    def show_name(self):
        print(self.__name)


person1 = Person()

person1.show_name()
```

**Output:**

```text
Waleed
```

A child class cannot normally access `__name` directly.

---

# 1️⃣8️⃣ Abstract Classes and Inheritance

An **abstract class** provides a common structure for child classes.

Python provides abstract classes through the `abc` module.

### Example

```python
from abc import ABC, abstractmethod


class Animal(ABC):

    @abstractmethod
    def sound(self):
        pass


class Dog(Animal):

    def sound(self):
        print("Dog barks")


dog1 = Dog()

dog1.sound()
```

**Output:**

```text
Dog barks
```

The child class must implement the abstract method.

---

# 1️⃣9️⃣ Composition vs Inheritance

Inheritance means:

> **is-a**

Composition means:

> **has-a**

### Inheritance

```text
Dog is an Animal
```

### Composition

```text
Car has an Engine
```

### Composition Example

```python
class Engine:
    def start(self):
        print("Engine started")


class Car:
    def __init__(self):
        self.engine = Engine()

    def start_car(self):
        self.engine.start()
        print("Car started")


car1 = Car()

car1.start_car()
```

**Output:**

```text
Engine started
Car started
```

---

# 🎬 Real-World Example

A company can have different types of employees.

The common information can be placed in a parent class.

```python
class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

    def show_info(self):
        print(f"Name: {self.name}")
        print(f"Salary: {self.salary}")


class Developer(Employee):
    def code(self):
        print(f"{self.name} is writing code")


class Manager(Employee):
    def manage(self):
        print(f"{self.name} is managing the team")


developer1 = Developer("Waleed", 100000)
manager1 = Manager("Ali", 150000)

developer1.show_info()
developer1.code()

print()

manager1.show_info()
manager1.manage()
```

**Output:**

```text
Name: Waleed
Salary: 100000
Waleed is writing code

Name: Ali
Salary: 150000
Ali is managing the team
```

This avoids repeating common employee code.

---

# 📊 Types of Inheritance

| Type         | Meaning                          |
| ------------ | -------------------------------- |
| Single       | One parent → one child           |
| Multilevel   | Parent → child → grandchild      |
| Multiple     | Multiple parents → one child     |
| Hierarchical | One parent → multiple children   |
| Hybrid       | Combination of inheritance types |

---

# 📊 Important Terms

| Term              | Simple Meaning                       |
| ----------------- | ------------------------------------ |
| Parent class      | Class that provides features         |
| Child class       | Class that inherits features         |
| Inheritance       | Reusing features from another class  |
| `super()`         | Access parent-class functionality    |
| Overriding        | Child changes a parent method        |
| MRO               | Order Python uses to search classes  |
| `isinstance()`    | Checks an object's class             |
| `issubclass()`    | Checks class inheritance             |
| Protected `_name` | Member intended for class/subclasses |
| Private `__name`  | Name-mangled member                  |
| Abstract class    | Class used as a common structure     |

---

# 🎓 Key Takeaways

* ✅ Inheritance allows us to reuse code.
* ✅ A parent class provides attributes and methods.
* ✅ A child class can use and extend the parent class.
* ✅ Python supports several types of inheritance.
* ✅ `super()` is useful for accessing parent functionality.
* ✅ A child class can override a parent method.
* ✅ MRO controls the method search order.
* ✅ `isinstance()` checks objects.
* ✅ `issubclass()` checks classes.
* ✅ Abstract classes provide a common structure.
* ✅ Composition is useful when one object contains another object.

---

# 📝 Practice Exercises

### Beginner

1. Create an `Animal` class with an `eat()` method.
2. Create a `Dog` class that inherits from `Animal`.
3. Add a `bark()` method to `Dog`.
4. Create two different `Dog` objects.
5. Create a `Person` class and a `Student` child class.

### Intermediate

6. Create a multilevel inheritance example.
7. Create a multiple inheritance example.
8. Create a hierarchical inheritance example.
9. Use `super()` in a child constructor.
10. Override a parent method.
11. Check inheritance using `isinstance()`.
12. Check inheritance using `issubclass()`.

### Advanced

13. Create a diamond inheritance example and check its MRO.
14. Create an abstract `Shape` class.
15. Create `Circle` and `Rectangle` child classes.
16. Create a real-world employee inheritance system.
17. Create a `Car` and `Engine` example using composition.
18. Decide whether inheritance or composition is better for a given real-world problem.

---

# 📂 Files in This Folder

| File            | Purpose                                            |
| --------------- | -------------------------------------------------- |
| `class14.ipynb` | Notebook with explanations, examples, and practice |
| `README.md`     | Complete guide to Python inheritance               |

---

# 🔗 Navigation

* **Previous:** [Class 13 — Classes and Objects](../01-Classes-and-Objects/)
* **Next:** [Class 15 — Polymorphism](../03-Polymorphism/)
* **Main:** [Python AI Engineering Journey](../../README.md)

---

## 💡 Pro Tip

> Don't try to memorize all inheritance types. First understand the main idea: **a child class can reuse and extend a parent class.**

---

**📅 Date:** January 16, 2024
**🎯 Goal:** Full-Stack AI Engineer

*“Learn the concept, write the code, break the code, and fix it. That is how programming becomes a skill.”*