---
title: "Structuring Success: A Comprehensive Guide to Rust's Structs and Lifetimes"
description: Discover the building blocks of Rust as we explore Structs and Lifetimes in-depth. From mastering struct design to unraveling lifetimes, this post equips system developers with essential knowledge for effective Rust programming.
date: 'Sun, 11 Feb 2024 14:18:59 GMT'
categories:
  - rust
  - system dev
  - structs
author_id: 1
image: /images/rust-structs-lifetimes-banner-png.png
webp_image: /images/rust-structs-lifetimes-banner.webp
image_thumb: /images/rust-structs-lifetimes-banner-png_thumb.png
banner_alt: Image of a stone built rock structure with buildings built out of the sides and on top of the structure.
show_banner: true
comments: true
published: true
---

## Introduction to Structs

Structs are one of the most common and useful features in Rust. As we dive deeper into systems programming with Rust, understanding structs is essential. In this section, we will cover:

### What are Structs?

Structs are custom data types that enable you to name and organize related data under one roof. Here is a basic example of defining a struct:

```rust
struct BlogPost {
    title: String,
    author: String,  
    content: String,
    published: bool
}
```

This struct `BlogPost` groups together all the data needed for a blog post - the title, author, content, and publish status. 

Some key notes about structs:

- They allow you to represent complex real-world concepts in your code.
- The data inside structs is called "fields".
- Fields have a name and type.
- The whole struct data is grouped under one name (`BlogPost` here).

In other words, structs allow us to create custom reusable data types, helping write easy-to-understand code.

### Why Use Structs?

Here are some of the main reasons to use structs in Rust:

- **Organization** - Group related data together cleanly instead of separate variables
- **Readability** - Code is more understandable with descriptive struct names 
- **Reusability** - Define a struct once and instantiate it multiple times
- **Abstraction** - Hide implementation details behind a simple struct interface
- **Domain modeling** - Directly map real concepts to code using data structures

For example, we can define a struct `User` to nicely model a user concept in code. And we can instantiate new `User` objects multiple times for each new user.

### Creating and Using Structs 

Defining a struct only creates a new type. To use it, we must create an *instance*. 

Here is an example of creating a `BlogPost` instance and accessing its fields:

```rust
let post = BlogPost {
    title: String::from("My First Post"),
    author: String::from("Dave"),
    content: String::from("Hello world!"), 
    published: false  
};

println!("Post title: {}", post.title); // Prints "My First Post" 
```

## Struct Methods

We know how to declare and instantiate structs in Rust. But how do we add functionality to them? This is where struct methods come in handy. 

### Attaching Methods to Structs

In addition to data fields, we can define methods on structs to implement behavior. Here's an example:

```rust
struct BlogPost {
   // existing fields   
}

impl BlogPost {
    fn new(title: &str, author: &str) -> BlogPost {
        BlogPost {
            title: String::from(title),
            author: String::from(author),
            content: String::new(),
            published: false  
        }
    }

    fn publish(&mut self) { // needed to make self mutable for method to change struct
        self.published = true; 
    }
}
```

We use the `impl` block to add methods to the `BlogPost` struct. This should come after the struct definition.

Some notes on struct methods:

- The first method is a **constructor** named `new` to initialize a new instance
- Methods take a special first `self` argument 
- We can modify state using `&mut self` like `publish()`

Now we can create `BlogPost` instances via the constructor and call methods like `publish`:

```rust
let mut post = BlogPost::new("Post Title", "Author Name"); 
 //^ needed to make struct mutable to avoid error on publish method

post.publish(); 
println!("Post published: {}", post.pusblished); // Post published: true
```

### Associated Functions 

We can also add functions inside `impl` blocks that *don't* take a `self` argument. These are called **associated functions**:

```rust
impl BlogPost {
   fn new() {
       // ...
   }

   fn sample() -> BlogPost {
        BlogPost::new("Sample", "Claude")   
    }
} 

let new_post = BlogPost::sample();
println!("new_post title: {}", new_post.title); // new_post title: Sample

``` 

Associated functions act like static methods in other languages. We call them using double colons like `BlogPost::sample()`.

## Tuple Structs

So far we've seen traditional structs that name all their fields. But Rust also allows us to define **tuple structs** which are similar to tuples.

### Tuple Structs vs Tuples

Tuple structs may seem identical to tuples, but there are some key differences to keep in mind:

<script>
  import Table from '$lib/components/Table.svelte'
  let headers = ['Feature', 'Tuple Struct', 'Tuple'];
  
  let rows = [
    ['Definition', 'Uses the struct keyword with fields defined within curly braces `{...}`.', 'Uses parentheses `()` to define.'],
    ['Naming', 'Each field has a name.', 'Elements don\'t have individual names.'],
    ['Typing', 'Each field can have a different type.', 'All elements must have the same type or each needs explicit type annotation.'],
    ['Use Cases', 'Lightweight structures, multiple return values', 'Temporary data storage, function arguments']
  ];
</script>
<Table {headers} {rows} highlight_first_row={true} />

The main takeaway is that tuple structs create reusable custom types, while regular tuples simply group together values.

For example, a function returning `(bool, i32)` cannot name or type alias the return type. But by using a tuple struct like: 

```rust
struct FuncResult(bool, i32);

fn my_func() -> FuncResult {
    // ... 
}
```

We can type alias the return into a neater custom type. Use regular tuples for temporary storage and tuple structs when you need a named, typed structure.

### Tuple Struct Syntax

A tuple struct looks like this:

```rust
struct Color(i32, i32, i32);

let red = Color(255, 0, 0);
```

Instead of field names, it just has the types listed within the parentheses. We create instances like tuples too, without field names.

This offers lighter syntax when we know our struct will only have a small fixed set of fields.

### Use Cases for Tuple Structs

Tuple structs come in handy for a few scenarios:

- **Points** - A point in an n-dimensional space can be represented using a tuple struct:

```rust  
struct Point(f32, f32, f32);

let origin = Point(0.0, 0.0, 0.0);
```
- **Colors** - As we saw earlier, RGB or other color models can be created using tuple structs.
- **Return multiple values** - Functions in Rust can only return one value. But by returning a tuple struct, we can logically return multiple values.

Overall, tuple structs trade field names for lighter syntax in cases where the meaning is still clear. They can be used for colors, points, key-value pairs and more. And they enable returning multiple values from functions.

## What is an enum in Rust?

Enums or enumerations in Rust allow you to define a type that can take on one of several possible values. Each value that an enum can take on is called a variant.

For example, we can define a simple enum to represent web application permissions:

```rust
enum Permission {
    Read,
    Write,
    Admin
}
```

This Permission enum has three variants - Read, Write and Admin.

Now we can create variables of type `Permission`:

```rust
let permission = Permission::Read;
```

And we can use match statements to take different actions depending on the variant:

```rust
fn check_permission(permission: Permission) {
    match permission {
        Permission::Read => println!("Can read!"),  
        Permission::Write => println!("Can write!"),
        Permission::Admin => println!("Full access")
    }
}
```

Some key characteristics of enums:

- Enum variants can store data like structs
- When compiled, enums occupy only as much space as the largest variant 
- Enums clarify code and make invalid states impossible
- Pattern matching on enums is exhaustive and enforced

Enums allow modeling distinct, meaningful cases in Rust code while enabling type safety through the compiler. They are essential in systems programming.

## Enums and Structs

Enums and structs are powerful data types on their own. But Rust also allows us to combine them together to create more tailored, flexible data modeling.

### Mixing Enums and Structs

Consider we have a struct representing a user:

```rust
struct User {
    id: i32,
    name: String,
    email: String
}
```

And we want to model different types of users like admins, managers etc. We can achieve this using an enum connected to appropriate structs:

```rust  
enum UserType {
    Admin(User),
    Manager(User),
    Guest(User)
}
```

Now we can instantiate `UserType` variants that contain specialized `User` data:

```rust
let admin = UserType::Admin(User {
    id: 1,
    name: String::from("John"),
    email: String::from("john@company.com")
}); 
```

So `UserType` wraps a `User` adding more context. We can access inner user data using struct destructuring:

```rust
match user_type {
   UserType::Admin(user) => {
      println!("Admin user: {}", user.name)
   },
   // ...
}
```

### Benefits of Connecting Enums and Structs

Some benefits of this pattern include:

- Reuse existing structs (DRY) 
- Add context/meaning through enums
- Cleaner domain modeling in code
- Share common struct methods across enum variants
- Type safety with specialized enum variants

So in systems programming, combining enums and structs allows us to build complex, contextual data models.

## Lifetimes in Rust

Lifetimes play a major role in Rust's ownership and borrowing system. When writing unsafe code or non-trivial data structures, understanding lifetimes is essential to ensuring memory safety.

### What is a Lifetime?

A lifetime denotes the scope for which a reference is valid. For example:

```rust
{
    let x = 10;
    let ref = &x; // `ref` has the lifetime of `x`
} 
// `x` goes out of scope here so `ref` cannot be used
```

By having lifetimes attached to references, Rust ensures they never outlive the data they refer to.

### Example: Lifetimes in Practice

To see how lifetimes prevent dangling references, let's walk through this example:

```rust
let r; 

{
let x = 5;

r = &x; // r is a reference to x
} // x goes out of scope here and is deallocated

println!("{}", r);
```

This code tries to create a reference `r` to `x` and use it after `x` has been deallocated. When we try to compile it:

```
error[E0597]: "x" does not live long enough
  --> src/main.rs:7:5
   |
6  |         r = &x;  
   |              - borrow occurs here
7  |     } // "x" dropped here while still borrowed
8  | 
9  |     println!("{}", r);
   |                    ^ borrowed value does not live long enough
```

The compiler shows accurately that `r` is borrowing some data that does not live long enough. So it disallows this code.

The lifetime of `x` ends after the inner scope it was created in. But `r` tries to access it outside that scope. By having lifetime logic built-in, Rust saves us from subtle bugs.

### Preventing Dangling References

The main purpose of lifetimes is preventing **dangling references**. This happens when you have a reference to some data, but that data has been deallocated. The reference effectively points to nothing and using it would be unsafe.

For example, consider a struct holding references:

```rust
struct Foo {
    data: &i32
}

let x = 10;
let foo = Foo { data: &x }; // borrow `x` 

drop(x); // deallocate `x`
println!("{}", foo.data); // danger!
```

Lifetimes avoid this by tying struct members to the lifetime of their owners.

Overall, lifetime syntax adds complexity but provides essential memory safety. Ignoring lifetimes can cause hard to trace bugs and crashes.

### Lifetime Annotations 

Rust is able to infer lifetimes in many cases. But for certain structures containing references, we need to provide lifetime annotations to compile:

```rust
struct Foo { // Won't compile!
    data: &i32
}

fn make_foo(x: &i32) -> Foo {
    Foo { data: x }  
} 
```

This errors:

```
error[E0106]: missing lifetime specifier 
 --> src/main.rs:2:15
  |   
2 |     data: &i32
  |               ^ expected lifetime parameter
```

The compiler can't tell how long `Foo` should live just from this code. We need to add an annotation that `Foo` instances live only as long as what they reference:

```rust 
struct Foo<'a> {
    data: &'a i32
}

fn make_foo(x: &i32) -> Foo {
    Foo { data: x }
}  
```

Now it compiles correctly. Lifetimes are usually inferred but required in struct and enum definitions if they hold references. These annotations clarify for Rust the relationships between the struct, its owner, and the references it holds.

### Lifetimes in Structs

Structs holding references also need lifetime annotations to ensure memory safety. For example:

```rust
struct CustomString<'a> {
    text: &'a str, 
}

fn main() {
    let variable1 = String::from("This is a string"); 

    let x = CustomString {
        text: variable1.as_str()
    };
}
```

This models a string struct holding a reference to some text. Now, `x` cannot outlive `variable1` due to Rust's lifetime rules. 

When `variable1` goes out of scope at the end of `main()`, the reference inside `x` would be invalidated. So the compiler ensures `x` also goes out of scope with `variable1`.

If we tried to return `x` from `main`, we would get an error that `'variable1` does not live long enough. The annotation in the struct definition ties the struct's lifetime to its inner reference.

Lifetimes apply transitively from structs to their fields to ensure no reference outlives what it points to. This protects memory safety.

## Recap and Next Steps

We've covered fundamental concepts around structs and lifetimes in Rust that empower building complex data structures safely. Let's recap the key takeaways:

### Custom Data Modeling is Key  

- Structs allow custom data types for concise, self-documenting code
- Enums handle variants elegantly with exhaustive checking 
- Generics enable reusing structures across types
- Annotations make relationships clear to compiler

Rust really shines in flexibly modeling concepts in code.

### Memory Safety Without Garbage Collection

- Ownership and borrowing enable access control  
- Lifetimes eliminate dangling reference bugs
- Struct design affects encapsulation

So Rust flips tradeoffs in systems programming - no GC overhead but memory is still safe!

### Just the Beginning...

We covered a lot of ground, but so much more exists:

- Advanced enum techniques 
- Generic struct constraints
- Optimizing performance with struct layouts
- Concurrency patterns like message passing architectures
- Graph data structures with references

I aimed to provide a solid starting point to exploring these topics more. Systems programming with Rust is an exciting journey!
