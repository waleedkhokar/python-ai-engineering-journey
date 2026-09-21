name : any = "pakistan"
Number : int = '7'
print(name)
print(type(name))
print(id(name)) #physical address
print([i for i in dir(name) if "__" not in i]) #methods and attributes
print