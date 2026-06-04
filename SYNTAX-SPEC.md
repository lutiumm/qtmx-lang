QTMX Language Specification v2.0
## Advanced-Purpose Programming Language

---

## BASIC STRUCTURE

Every QTMX program has this structure:
beQ-
[INPUT BLOCK]
[LOGIC BLOCK]
[OUTPUT BLOCK]
[VALIDATION BLOCK]
qq-
---

## 1. START & END
```qtmx
beQ-
  // Code here
qq-

## 2. INPUT BLOCK (bbq + ingo)
beQ-
  bbq
    ingo username: string
    ingo age: number
  bbq
qq-

## 3. LOGIC BLOCK (aaq)
aaq
  set x = 10
  set message = "Hello"
aaq

## 4. CONDITIONS (f / exel / el)
f x > 5
  set status = "big"
exel x > 0
  set status = "small"
el
  set status = "zero"

## 5. LOOPS (lop)
lop i -> 0..10
  set count = i

lop item -> array
  set current = item

## 6. FUNCTIONS (func / call)
func add(a, b)
  set result = a + b

call add(5, 3)

## 7. VARIABLES (set)
set name = "John"
set age = 25
set active = true
set numbers = [1, 2, 3]

## 8. OUTPUT BLOCK (outgo)
outgo response: object
  name: username
  age: userAge
outgo

## 9. VALIDATION BLOCK (tcq)
tcq
  username.length > 0
  age > 0
tcq

## 10. OPERATORS
Comparison: === =! < > <=>
Logical: $ (AND), // (OR), | (NOT)
Arithmetic: + - * / %

## 11. KEYWORDS
beQ-  qq-  qq+  qq#   Program delimiters
bbq   aaq  outgo tcq  Blocks
ingo  set  func  call Variables & functions
f     exel el    lop   Control flow
true  false null       Literals

## COMPLETE EXAMPLE
beQ-
  bbq
    ingo username: string
    ingo age: number
  bbq
  
  aaq
    set status = "pending"
    
    f age >= 18
      set status = "approved"
    el
      set status = "rejected"
    
    lop i -> 0..5
      set count = i
  aaq
  
  outgo result: object
    user: username
    status: status
  outgo
  
  tcq
    username.length > 0
    age > 0
  tcq

qq-
 
            ## this is qtmx ##
