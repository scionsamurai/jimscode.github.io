---
title: Javascript Control Flow
description: Master control flow in JavaScript with this comprehensive guide. Learn all about for, while and do while loops, if else conditionals, switch statements, break, continue & more with examples.
date: 'Thu, 28 Dec 2023 02:03:12 GMT'
categories:
  - javascript
  - web dev
author_id: 1
image: /images/js-control-flow-banner-png.png
webp_image: /images/js-control-flow-banner.webp
image_thumb: /images/js-control-flow-banner-png_thumb.png
banner_alt: Picture of students working around geared machines.
show_banner: true
comments: true
published: true
---

## Introduction and Context:

Welcome to part two of our JavaScript blog series! In the last post, we covered the fundamentals of the language - variables, data types, operators etc. Now it's time to dive into control flow, one of the most important concepts in JavaScript. 

Control flow refers to the order in which statements are executed in our code. As developers, we need control over that flow to make decisions, repeat tasks, and handle errors. Without control flow, our programs would simply execute from top to bottom without any logic. 

In this post, we'll explore the main control flow statements that JavaScript provides for decision making and looping. You'll learn how to:
- Execute code conditionally with `if`, `else`, and `else if`
- Repeat tasks with `for`, `while`, and `do while` loops  
- Break control flow with `break` and `continue`
- Simplify conditional logic with `switch`
- Scope variables locally with block statements

Understanding control flow will allow you to write more complex and featured programs. Let's jump in!

## Practical Examples and Code Illustrations:

To understand control flow, let's think about a real-world example - an e-commerce site. 

When users add items to their cart, we need to **repeat** a few steps for each item. This can be done with a **loop**.

```js
// Loop through cart items
for(let i = 0; i < cart.length; i++) {
    // Display item
    displayCartItem(cart[i])  
    // Calculate totals
    updateTotals(cart[i])
}
```

When users click checkout, we need to **make decisions** on payment method, discounts etc. This requires **conditional statements**.

```js 
// Check preferred payment method
if(user.paymentMethod === "credit") {
    // Apply credit card processing
} else {
    // Other payment flow
}
```

As we can see, control flow statements like loops and conditionals are essential for user interactions. Throughout this post, we'll use examples like these to understand the concepts.

The key goals are to:
1. Introduce control flow and explain why it's important
2. Give a high-level overview of concepts covered
3. Use real-world examples to illustrate practical applications

## What is Control Flow

Control flow refers to the order in which statements, instructions, or function calls are executed in a program. It determines how the code runs from start to finish.

In JavaScript, code is executed sequentially in the order it appears unless control flow statements like loops or conditionals are used to change the standard execution flow. These control flow statements allow developers to implement non-linear, branchy flows that enhance interactivity and dynamism. 

Understanding control flow is key to mastering logic and decision making in code. It allows developers to:
- Repeat tasks by looping over blocks of code 
- Make decisions using conditional if/else statements
- Break out of standard sequential execution to skip blocks or end loops early

With the basics of control flow down, developers gain immense power over flow and logic in their JavaScript programs.

## For Loops 

The for loop allows repetitive execution of a code block, based on a loop counter. The syntax is:

```js
for (initializer; condition; update) {
    // code to run each loop 
}

``` 
- The initializer sets the starting value for the loop counter variable. 
- The condition evaluates whether to run the next iteration.
- The update increments/changes the loop counter at end of each loop.

Here is for loop to print numbers from 1 to 5:

```js
for (let i = 1; i <= 5; i++) {
    console.log(i); 
}

// Prints: 
// 1
// 2
// 3 
// 4
// 5
```

For loops are useful when number of iterations are known. Common cases are:
- Iterating over arrays/strings to access each element
- Running a code block fixed number of times
- Iterating up to a certain number range

Some things to keep in mind when using for loops:
- Avoid infinite loops by ensuring counter variable change avoids endless looping
- Use descriptive counter variable names for readability 
- Initialize variables properly before first loop
- Utilize loop scope by declaring variables inside init statement

Let's look at a real-world example of iterating over an array with a for loop next.

```js
const fruits = ['apple', 'orange', 'banana'];

for (let i = 0; i < fruits.length; i++) {
    console.log(fruits[i]); 
}

// Prints:
// apple 
// orange
// banana
```

We initialize the counter `i` to 0 to start from the first element. The condition checks that `i` is less than length of the fruits array so we don't go out of bounds. The update statement increments `i` by 1 each loop.

Inside the loop, we output the element at current index using `fruits[i]`. This allows us to access each element of the array in order.

The array length also did not need to be hardcoded - we used the `.length` property to dynamically adapt to size.

### Some common cases where this approach is used:

**Iterating over array of objects**
We can loop through an array of objects and access properties on each object.

**Manipulating each element** 
We can update or transform each element as we loop over arrays.

**Searching**
We can look for an element that meets a certain criteria as we iterate.

For loops allow iterating over arrays in a simple and effective way. The counter variable tracks current element, condition handles end point and update increments the counter.

## While Loops

The while loop executes a block of code repeatedly as long as a condition remains true. 

Its syntax is:

```js
while (condition) {
    // code to run each loop
} 
```
The loop first checks the condition. If true, it runs the code inside and rechecks condition. This repeats until condition becomes false.  

For example:

```js 
let count = 0;

while (count < 5) {
    console.log(count);
    count++;
}

// Prints:  
// 0 
// 1
// 2
// 3 
// 4
```
This will print the numbers 0 through 4. The condition checks that count is still less than 5. The update statement increments count each loop.

Some differences from for loops:
- No separate initializer or update statements 
- Condition check happens before loop rather than end
- Care must be taken to avoid infinite loops

While loops are useful when number of iterations are unknown or based on a dynamic stop condition. 

For example, keep processing user input until a sentinel value is entered:

```js
let input;

while (input !== "quit") {  
    input = getInput(); // Function to get user input
    // rest of code...
}
```

## Do While Loops 

The do while loop runs code block once before checking condition. Its syntax:

```js
do {
    // code to run
} while (condition);
```

For example:

```js
let i = 5;
do {
    console.log(i);
    i--; 
} while (i > 0);

// Prints:
// 5
// 4
// 3
// 2
// 1
```
Even though condition is false on first check, the code runs once before evaluating.

The do while loop is useful when code must run at least once such as menu prompts. The condition is then checked for additional loops.


Here is a comparison table of the do...while, while, and for loops in JavaScript:
<script>
  import Group from '$lib/components/TabGroup/Group.svelte'
  import Tab from '$lib/components/TabGroup/Tab.svelte'
  import Table from '$lib/components/Table.svelte'
  let group_name = 'tab-group-' + Math.random().toString(36).substr(2, 9)

  let rows = [
    ['How condition is checked', 'After the first iteration', 'Before the first iteration', 'Before the first iteration'],
    ['Guaranteed runs', 'At least once', 'Could run 0 times', 'Could run 0 times'],
    ['Readability', 'Moderate', 'Good', 'Good'],
    ['Good for', 'Situations where you want the code to run at least once like menus', 'Unknown number of iterations based on condition', 'Known number of iterations'],
    ['Example', '`do { \\ run code } while (condition)`', '`while (condition) { \\ run code }`', '`for (init; condition; update) { \\ run code}`']
  ]
  let headers = ['Feature', 'do...while', 'while', 'for'];
</script>

<Table {headers} {rows} highlight_first_row={true} />

## If Statements

If statements allow conditional logic in code using the `if` keyword. Their syntax is:

```js
if (condition) {
    // code to run if condition is true
}
```
The condition inside parentheses must evaluate to true or false. If true, the code inside curly braces executes.

For example:

```js
let temp = 25;

if (temp > 30) {
    console.log("It's hot outside!"); 
}
```
Since 25 is not greater than 30, the code inside the if statement does not run.

Some notes on if statements:
- Use comparison operators like `>`, `===`, `<` to compare values 
- Conditions can use variables, arithmetic operations, function calls
- Avoid common errors like assignment `=` instead of equality `==`
- Code must be inside curly braces even if single statement

If statements allow sectioning off code to run selectively based on conditions. This builds the logic and flow controls.

## Else & Else If 

The `else` statement runs a code block if the initial `if` condition is false.

Its syntax appends to the if:

```js
if (condition1) {
    // run if condition1 is true
} else {
    // run if condition1 is false  
}
```

We can also chain `else if` blocks to handle multiple conditions:

```js 
if (condition1) {
    // run if condition1 is true
} else if (condition2) {
    // run if condition1 false AND condition2 true 
} else { 
    // run if BOTH conditions are false
}

``` 

Some points on else and else if:
- Only the first matching block runs, subsequent ones are skipped 
- Can have multiple else if blocks for different checks
- Helps handle all scenarios instead of just if true case

So else and else if allow handling more advanced program flows and contingencies when the primary check fails.

## Logical Operators

Logical operators allow combining multiple boolean expressions and conditions. The main logical operators in JavaScript are:
- AND `&&`
- OR `||` 
- NOT `!`

### The AND `&&` Operator 

The AND operator `&&` returns true if both operands are true:

```js
if (x > 5 && y < 10) {
    // run if both conditions are true
}
```
- Returns true if **both** `x > 5` **and** `y < 10`
- Short circuits at first false condition  

This allows enforcing multiple conditions easily.

### The OR `||` Operator

The OR operator `||` returns true if either one of the operands is true: 

```js
if (x > 5 || y < 10) {
    // run if x > 5 is true OR y < 10 is true
} 
```
- Returns true if **either** `x > 5` **or** `y < 10`
- Short circuits at first true condition

This allows checking multiple paths to be true.

## Logical NOT `!` Operator

The NOT operator (!) flips or negates a boolean value from true to false and vice versa:

```js
let isRaining = true;
let isSunny = !isRaining; // Sets isSunny = false
```

Some uses cases of the NOT operator:
- Inverting conditional checks
- Coercing truthy/falsy values 
- Double negatives for readability

Logical operators like AND, OR and NOT allow creating complex conditional checks and boolean logic flows.

## Break & Continue Statements

Break and continue statements allow additional control within loops.

### Break

The break statement exits and terminates the current loop:

```js 
for (let i = 1; i <= 5; i++) {
    if (i === 3) { 
        break;
    }
    console.log(i);
}

// Prints: 
// 1 
// 2
```

At `i = 3` the break runs which terminates the loop. Any further iterations do not run.

### Continue 

The continue statement skips the current iteration and continues loop execution:

```js
for (let i = 1; i <= 5; i++) {
    if (i === 3) {
        continue; 
    }
    console.log(i);  
}

// Prints:
// 1
// 2 
// 4 
// 5

``` 

Here at `i = 3`, continue skips just that iteration and resumes from next one.

Break and continue add further control options inside loops.

## Switch Statements 

Switch statements execute code based on matching cases:

```js
switch(expression) {
case value1: 
    // run if expression === value1
    break;

case value2:
    // run if expression === value2
    break;

default:
    // run if no cases match 
}
```
- The expression is evaluated once only
- Cases are evaluated for matches using strict equality
- Break exits the switch after match found
- Default runs if nothing else matches

Some examples of switch statements:

```js
// Run code based on browser
switch (browser) {
    case 'edge': 
        showMessage("You've got edge!");
        break;
    case 'chrome':
    case 'firefox':
        showMessage("Okay we support these browsers too");
        break;
    default:
        showMessage("We hope this browser is decently modern");
}

// Calculate tip based on quality 
let tip;
switch(quality) {
    case 'bad': 
        tip = 0;
        break;
    case 'okay':
        tip = 15;
        break;
    case 'good':
    case 'great':
        tip = 20;
        break;
    default:
        tip = 18;  
}
```
Switch offers an alternative conditional check to chains of if/else statements in some cases.

## Block Scope

Block scope refers to variables declared inside a code block (denoted by `{}` curly braces). For example:

```js
// Global scope 

if (condition) {
    // Block scope
    let x = 5;
} 

// x not accessible here (out of block scope) 

``` 

Variables declared with `let` and `const` have block scope - they only exist within the nearest set of curly braces.

Some key points:
- Variables with block scope cannot be accessed externally
- Helps avoid unintended modifications and naming collisions  
- Functions also create a new block scope for variables
- Variables move out of scope once block ends

Block scopes promote: 
**Readability** - Clear where variables accessible  
**Security** - Variables live only as long as needed
**Reliability** - No unintended changes across code

Properly leveraging block scope is an important aspect of cleaner JavaScript code.

## Troubleshooting and Common Errors

Some common errors and troubleshooting tips for control flow:
**Infinite Loops**
- Forgotten iterator in for/while loops
- Accidental always true condition 
> Carefully check terminating conditions

**Unexpected Code Execution** 
- Using = instead of == in condition check
- Misunderstanding && vs || precedence  
> Use linter and check carefully

**Undeclared Variables**
- Misspelled variables
- Using variables before declared
> Enable strict mode and linter checks

**Logical Errors**  
- Flawed conditions that give unintended flow
- Erroneous if/else tiers 
> Add log traces and test edge cases

Also some best practices that help:
- Format code properly for readability 
- Validate early returns from functions if invalid
- Destructure variables at start for easy access
- Try/catch blocks around control flow logic
