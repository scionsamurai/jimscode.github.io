---
title: "Mastering Enums and Pattern Matching in Rust"
description: Unravel the complexities of Rust Enums and Pattern Matching in this in-depth exploration. Enhance your programming arsenal and gain confidence in handling diverse data structures for system-level tasks.
date: 'Sun, 11 Feb 2024 22:07:02 GMT'
categories:
  - rust
  - system dev
  - enums
author_id: 1
image: /images/rust-enums-banner-png.png
webp_image: /images/rust-enums-banner.webp
image_thumb: /images/rust-enums-banner-png_thumb.png
banner_alt: Sectioned image with different seasons in each section.
show_banner: true
comments: true
published: true
---

## Introduction to Enums in Rust

Enums are a powerful feature in Rust that allow you to define custom data types to represent a fixed set of possible values. Think of them like supercharged version of enums in other languages - they can store data and behavior associated with each variant.

In this section we'll learn:

- How to define and use basic enums in Rust 
- Different ways to associate data with enum variants
- How pattern matching makes working with enums easy
- How enums relate to other major features like structs and error handling

So let's dive in and see how enums can help you write clean, scalable Rust programs!

### Declaring Enums

Declaring an enum is easy - just use the `enum` keyword:

```rust
enum WebEvent {
    PageLoad,
    Click,
    KeyPress(char),
    Paste(String),   
}
```

Enum variants can optionally have data associated with them. For example, the `KeyPress` variant here contains a `char`.

You can also specify explicit discriminant values for each variant:

```rust
enum Number {
    Zero = 0,
    One = 1,
    Two = 2
}
```

But usually allowing Rust to assign default values is fine.

### Creating Enum Instances

Once an enum is declared, we can create instances by specifying the variant we want:

```rust
let page_load = WebEvent::PageLoad;

let key_press = WebEvent::KeyPress('x'); 
```

If a variant has associated data, we provide that data when creating an instance:

```rust 
let paste_event = WebEvent::Paste("Some text".to_string());
```

Enum instances are statically typed - the compiler knows this is a `WebEvent`:

```rust
fn log(event: WebEvent) {
    // ...
}
```

So enums allow you to define custom data types and safely use them in your code.

## Implementing Methods on Enums

In addition to storing data, we can also implement methods directly on enums to encapsulate behavior for each variant.

For example:

```rust
enum WebEvent {
    Click,
    KeyPress(char),  
    Paste(String),
}

impl WebEvent {
    fn log(&self) {
        match self {
            Self::Click => println!("Clicked"),   
            Self::KeyPress(c) => println!("Key {} pressed", c),
            Self::Paste(text) => println!("Pasted: {}", text),  
        }
    }
}

let event = WebEvent::KeyPress('x');
event.log(); // Prints "Key x pressed"
```

Now we can add reusable logic that applies to all instances of an enum.

### Putting Methods to Use

Some ways we might leverage enum methods:

- Common formatting/output logic
- Validation checking 
- Helper calculations/transformations
- Integration with external services  

Methods help encapsulate behavior related to enums in one tidy place!

## Associated Data

We've seen basic associated data with enums like this:

```rust
enum WebEvent {
    KeyPress(char),
    Paste(String),
}
```

But we can also use more complex types like structs and tuples:

```rust 
struct PasteData {
    text: String,
    source_app: String,
}

enum WebEvent {
    Paste(PasteData),  
}

let event = WebEvent::Paste(PasteData {
    text: "example text".to_string(),
    source_app: "Notes".to_string(),  
});
```

This allows us to bundle related data with enum variants.

## Tuple and Struct Enums

We can also use tuples and structs directly as enum variants:

```rust
enum Color {
    Rgb(u8, u8, u8),
    Hsv(u8, u8, u8) 
}

enum Shape {
    Circle { radius: f64 },
    Rect { width: f64, height: f64 }  
}
```

Tuples are great for simple related values, and structs allow us to name the associated values.

This helps eliminate duplication - we don't need a separate `Circle` struct anymore, for example.

## Introduction to Pattern Matching

Pattern matching allows us to inspect an enum instance and take different actions depending on which variant it is. Here's an example:

```rust
fn inspect(event: WebEvent) {
    match event {
        WebEvent::PageLoad => println!("Page loaded"),
        WebEvent::Paste(text) => println!("Pasted: {}", text), 
        _ => ()
    }
}
```

The `match` expression checks the `event` value against the different patterns we specify - almost like a switch statement in other languages.

This allows us to handle each enum variant differently in a concise, exhaustive way.

## Matching Enum Variants 

Let's look closer at matching variants:

```rust
enum WebEvent {
    Click,
    KeyPress(char),
}

fn inspect(event: WebEvent) {
    match event {
        WebEvent::Click => {
            // Handle click
        },
        WebEvent::KeyPress(c) => {  
            // Handle key press of character c
        },
    }  
}
```

We can directly match against each variant, and any associated data is extracted for us to use!

This avoids messy conditional logic, and the compiler ensures every variant is handled.

Matching enums is essential for modeling complex systems efficiently and safely in Rust.

### Using Non-Exhaustive Patterns

When matching enum variants, we can also use a catch-all `_` pattern to handle multiple variants at once:

```rust 
fn inspect(event: WebEvent) {
    match event {
        WebEvent::KeyPress(c) => {
            println!("Pressed {}", c)
        }
        _ => {
          println!("Some other event")  
        }
    }
}
```

This `_` pattern will match any `WebEvent` that isn't a `KeyPress`.

We can specify multiple non-exhaustive patterns:


```rust
match event {
    WebEvent::Paste(_) | WebEvent::Click => {
        // Handle pastes and clicks
    }
    _ => { /* Other events */ } 
}
```

It's best practice to have a catch-all pattern so that any new variants added later don't break functionality.

The compiler will warn us about truly non-exhaustive matches without a `_` fallback.

While handling variants individually is ideal, non-exhaustive patterns are useful for simplifying logic across multiple variants when needed.

## Destructuring Enum Variants

Pattern matching allows us to destructure enums to extract their internal data:

```rust
enum Shape {
    Rectangle { width: u32, height: u32 },
    Circle(u32),
}

fn inspect(shape: Shape) {
    match shape {
        Shape::Rectangle { width, height } => {
            println!("A rectangle with dimensions {} x {}", width, height);
        },
        Shape::Circle(radius) => {
            println!("A circle with radius {}", radius);
        }
    }
} 
```

Instead of using the whole `Rectangle` variant, we match on just the `width` and `height` fields. This avoids repetitive code.

Destructuring works similarly for tuple variants:

```rust
fn rgb_to_hex(color: (u8, u8, u8)) {
    match color {
        (r, g, b) => {
            println!("{}{}{}", r, g, b); // convert to hex
        }
    }
}
```

## Matching Complex Enums

We can match enums with complex associated data too:

```rust
enum Event {
    MouseClick { x: i64, y: i64 },
    KeyPress(char),  
}

fn inspect(event: Event) {
    match event {
        Event::MouseClick { x, y } => {
            println!("Clicked at x:{}, y:{}", x, y);
        }, 
        Event::KeyPress(c) => {
            println!("Key pressed: {}", c);
        }
    }
}
```

This flexibility helps model intricate domains cleanly.

So destructuring and nested matching makes working with elaborate enums concise and easy!

## Using Pattern Matching in Conditional Statements

In addition to `match` expressions, we can also use pattern matching within `if let` and `while let` conditional statements.

For example:

```rust
enum Shape {
    Circle(u32),
    Rectangle(u32, u32)  
}

fn print_shape(shape: Shape) {
    if let Shape::Circle(radius) = shape {
        println!("Circle with radius {}", radius);
    } else if let Shape::Rectangle(width, height) = shape {
        println!("Rectangle with dimensions {} x {}", width, height); 
    }
}
```

The `if let` checks if `shape` matches the `Circle` variant, extracting the radius. A similar approach works for `while let`.

This can be cleaner than cascaded `match` statements when we only need to check one variant at a time.

## Looping with Pattern Matching

We can also use pattern matching variants directly in loops:

```rust
let shapes = vec![Shape::Circle(3), Shape::Rectangle(4, 5)];

for shape in shapes {
    match shape {
        Shape::Circle(radius) => println!("Radius {}", radius),
        Shape::Rectangle(width, height) => {
            println!("{} x {}", width, height);
        } 
    }
}
```

So pattern matching is useful well beyond `match` expressions!

Leveraging it in conditionals and loops helps simplify control flow when working with enums.

### Looping While an Option Has a Value

We can also use `while let` to loop over an option enum as long as it has a value:

```rust
let mut events = Some(vec![WebEvent::Click]); 

// Loop while events has some value
while let Some(e) = events {
    match e.pop() {
        Some(event) => {
            event.log(); // Log event
        }
        None => {
            events = None; // No more events
        }
    }
}
```

This constructs a loop that:

1. Checks if `events` matches `Some(e)`, binding the vector to `e`
2. Pops off an event from the vector 
3. Logs the event if there was one
4. Sets `events` to `None` when empty to exit

We could expand this to fetch new batches of events to keep the loop going.

The `Option` enum allows this style of looping over a value that may or may not be present.

So while let bindings are very useful for processing option enums!

## Creating Complex Data Structures

We can combine enums and structs to create more intricate data models.

For example, we can represent web events happening within pages and sessions:

```rust
struct WebSession {
    id: String,
    events: Vec<WebEvent>,
}

struct WebPage {
    url: String,
    sessions: Vec<WebSession>,
}

enum WebEvent {
    Click, 
    KeyPress(char),
    Paste(String),
}
```

Now we can express relationships like "a key press event happened during session 123 on the homepage":

```rust
let home_page = WebPage {
    url: "/".to_string(),
    sessions: vec![
        WebSession { 
            id: "123".to_string(),
            events: vec![
                WebEvent::KeyPress('x')  
            ]
        }
    ]
} 
```

This composition allows us to model complex systems and hierarchies!

## Incorporating Behavior Through Traits

To add polymorphic behavior to such structures, we can utilize Rust's trait system.

For example, we can define a trait to encapsulate logic for logging events:

```rust
trait Log {
    fn log(&self);
}

impl Log for WebEvent {
    fn log(&self) {
        match self {
            WebEvent::Click => println!("Clicked"),
            WebEvent::KeyPress(c) => println!("Key {} pressed", c),
            WebEvent::Paste(text) => println!("Pasted text: {}", text),
        }
    }
}

impl Log for WebSession {
    fn log(&self) {
        println!("Session {}:", self.id);
        for event in &self.events {
            event.log();
        }
    } 
}
```

Now `WebEvent` and `WebSession` both implement the `Log` behavior, keeping logging code reused and maintained in one place.

We can log an entire structure:

```rust
let session = WebSession {
    // ...
};

session.log(); // Logs session and events
```

This demonstrates how enums provide the building blocks to grow reusable, modular code in Rust!

## Error Handling with Default Enums

### Creating and Using Some and None Option Enums

Rust's `Option` enum allows us to represent optional values that may or may not exist. The variants are:

- `Some(T)`: Wraps a value of type `T` (the option holds something)
- `None`: No value is present (the option is empty)

Let's look at some examples:

```rust
// User ID from a database lookup
let user_id: Option<i32> = Some(5); 

// Results from a search query
let search_results: Option<Vec<String>> = Some(vec![]);

// Empty string parsed
let parsed_string: Option<String> = None;
```

We can use `if let` to easily check if an Option contains data:

```rust 
if let Some(id) = user_id {
println!("User ID: {}", id);
}

// Error - requires handling None case
if let None = parsed_string {
    // Handle missing value
}
```

And `match` to handle both `Some` and `None`:

```rust
match search_results {
    Some(results) => { /* Show results */ },
    None => { /* No results */ },
}
```

So `Option` allows type-safenullable values - the compiler ensures we handle both defined and undefined states properly. This prevents bugs!

### Result and Option Enums

Rust's standard library provides two helpful enums for error handling - `Result` and `Option`:

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}

enum Option<T> {
    Some(T),
    None,  
}

``` 

These express two common scenarios - an operation that may succeed (`Ok`) or fail (`Err`), and a value that may be present (`Some`) or missing (`None`).

For example, we could use them in our web event code:

```rust
fn parse_paste(text: &str) -> Result<WebEvent, ParseError> {
    // Try to parse...
    if valid {
        Ok(WebEvent::Paste(text.to_string()))
    } else {
        Err(ParseError)  
    }
}

let events: Option<Vec<WebEvent>> = Some(vec![]);
```

Pattern matching on `Result` and `Option` allows clean handling of errors and missing values.

Overall they are a great demonstration of using enums for domain modeling and error handling in Rust!

### Custom Error Enums

We can also create custom error enums for our domains:

```rust
enum ParseEventError {
    InvalidJson,
    MissingFields,
}

enum EventSourceError {
    IoError(io::Error),
    RequestTimeout,
}
```

These can be used with `Result` to return structured errors:

```rust
fn parse_event(json: &str) -> Result<WebEvent, ParseEventError> {
    if missing_fields {
        Err(ParseEventError::MissingFields)
    } else {
        // parse ok
        Ok(event)
    }
}

fn fetch_events() -> Result<Vec<WebEvent>, EventSourceError> {
    match resp {
        Ok(resp) => {
            // parse events
        }, 
        Err(e) => Err(EventSourceError::IoError(e))
    }
}
```

Custom errors provide more context and structure than simple strings. And enums allow matching to handle errors differently:

```rust
match fetch_events() {
    Ok(events) => { /* use events */ },
    Err(EventSourceError::IoError(e)) => { /* retry */ },
    Err(EventSourceError::RequestTimeout) => { /* increase timeout */ },  
}
```

So error enums are immensely useful in Rust programs!

## Summary of Enums and Pattern Matching

Let's recap what we learned about enums:

- Enums allow you to define custom data types to elegantly model domains
- Variants can store associated data like strings, structs, etc
- Pattern matching is an idiomatic way to handle enums
- Enums combine great with other features like structs and error handling 

Overall, Rust's enums are far more advanced than other languages. When combined with features like pattern matching they become an indispensable tool for clean system modeling and safe control flow.

Some key benefits in system programming are:

- Representing systemic states, errors, and resource types
- Enforcing validity of values at compile time
- Encouraging exhaustive handling of edge cases  

## Exercises and Next Steps

To become proficient with enums, I recommend:

- Replacing duplicate structs with enum variants
- Modeling custom errors and results with enums
- Practicing pattern matching expressions and destructuring 
- Reading user stories about enums on Rust community sites

Next we'll explore Rust's powerful trait system for polymorphism and abstraction. Traits allow us to extend the behavior of enums and structs in versatile ways.

But for now feel free to ask any follow up questions about enums below!
