---
title: "Navigating Rust Projects: A Guide to Cargo, Crates, and Modules"
description: Explore the fundamentals of Rust project organization with our comprehensive guide on Cargo, Crates, and Modules. Learn to wield Rust's package manager, structure code efficiently, and share functionality seamlessly between projects.
date: 'Sat, 02 Mar 2024 19:09:55 GMT'
categories:
  - rust
  - system dev
  - modules
  - packaging
author_id: 1
image: /images/rust-cargo-crates-modules-banner-png.png
webp_image: /images/rust-cargo-crates-modules-banner.webp
image_thumb: /images/rust-cargo-crates-modules-banner-png_thumb.png
banner_alt: A machine that looks like a room-sized 3d printer, but this machine is for handling packages.
show_banner: true
comments: true
published: true
---

## Introduction to Cargo

Cargo is the Rust ecosystem's official package manager and build tool. For systems programmers coming to Rust, Cargo is analogous to build tools you may already be familiar with such as Make or Bazel. However, Cargo offers several key advantages:

### Simplicity of Getting Started

Getting started with a new Rust project is as simple as running:

```
cargo new my-project
```

This initializes a new project folder with the following:

- Default Rust source file (`main.rs`)
- Configuration file (`Cargo.toml`) 
- Gitignore file
- Other supporting files

With just a single command, you can start coding right away without worrying about project setup.

### Handling Dependencies

In Rust, reusable packages of code are called **crates**. As your project grows, you may want to split it into multiple crates or depend on external community crates.

Cargo automatically downloads and builds all dependencies defined in your `Cargo.toml` file. Some key advantages over manually handling dependencies:

- No need to manually hunt down copies of library source code
- Crates are cached locally so they only get downloaded once
- Updates to crates can be easily integrated via `cargo update`

### Unified Build System

Cargo provides a consistent build experience across development and production environments:

```
cargo build // Build for local testing
cargo run // Compile and run binary
cargo test // Run all tests
cargo doc // Generate documentation
cargo publish // Publish crate to share with others
```

There's no need to learn Make, CMake, Bazel, etc. The same `cargo` commands work everywhere.

### Structuring Projects with Cargo

When you create a new Rust project with `cargo new`, it generates the following directory structure:

```
my-project
|- Cargo.toml
|- src
   |- main.rs
|- .gitignore
```

This provides a common starting point for all Rust projects. Let's take a closer look at what each generated file provides:

#### Cargo.toml

This file defines metadata about your project such as its name, version, authors, and dependencies. Some key sections:

```
[package]

## Package details - required

name = "my-project" 
version = "0.1.0"

[dependencies]

## External crate dependencies - optional

rand = "0.8.5" 

[lib]

## Build this project as a library - optional

name = "my_project"
```

#### src/main.rs

The `src` folder holds your Rust source code, starting with `main.rs` by default. This file contains the `main` function that serves as the entry point when building an executable.

#### .gitignore

This ignores files Cargo uses for caching/building so they aren't committed to git by accident.

Cargo provides a streamlined project structure focused on just the essentials. You can add additional source files, organize code into modules, configure builds, and manage dependencies entirely through `Cargo.toml`. This avoids a tangled mess of configuration files.

## Crates in Rust

Previously we looked at how Cargo structures a Rust project at a high level. Now let's go deeper into **crates** - the standard compilation unit in Rust.

### What is a Crate?

A crate can be thought of as equivalent to a library or package in other languages. At a high level, a crate:

- Encapsulates related functionality and data structures
- Compiles to a static or dynamic library
- Exposes APIs for other code to use

**In Rust, crates are the primary way code is shared between different projects.** Publishing a crate to [crates.io](https://crates.io) makes it available to other Rust developers.

### Anatomy of a Crate

Under the hood a crate is a **tree of modules** that produces one or more library or executable artifacts when compiled by Cargo. 

For example, this crate:

```
my-crate
|- src
   |- lib.rs
   |- tools.rs
|- tests
   |- integration.rs 
|- benches
   |- performance.rs
```

Could produce:

- A library `libmy_crate.rlib` 
- An executable binary `my-tool`
- Test and benchmark executables

The key takeaway is that **a crate allows keeping related functionality together** while exposing desired APIs to consumers.

## Modules in Rust 

In the previous section we saw how crates manage code at a high level. Now let's talk about **modules** - the way code is organized within a crate.

### Organizing Code with Modules

**Modules allow logically grouping related functionality**, similar to namespaces in other languages. Some examples:

```rust 
mod math {
// Math related functions
}

mod io {
// File and network I/O code 
}

mod mocks {
// Testing and mocking functionality
}
```

**Modules create boundaries that control organization, scope, and privacy.** By default, items defined in a module are private to that module. Public APIs are exposed through `pub use`.

**While crates manage code sharing between projects, modules manage code sharing within a project.** Segmenting code into modules with clear interfaces is crucial for maintaining large codebases in Rust.

### Paths for Accessing Modules

We refer to modules using paths - similar to filesystem paths:

```rust
// Absolute path 
crate::math::round(1.2345)

// Relative path
io::read_file("data.txt")  
```

The crate root is the top level module of your library or binary. **Paths allow unambiguously accessing nested modules.**

Proper use of modules and paths forms the basis of encapsulating and reusing code in idiomatic Rust.

## Package, Crate, and Module Relationships

Now that we've covered cargo, crates, and modules individually, let's talk about how they all fit together.

### Package Relationships 

A Rust **package** contains one or more crates inside the `src` folder:

```
my-package
|- Cargo.toml
|- src
   |- main-crate
      |- Cargo.toml
      |- src
   |- utils-crate
      |- Cargo.toml
      |- src
```

The top-level `Cargo.toml` defines the package. Each crate folder also has its own `Cargo.toml`. 

**A key job of packages is to define relationships between multiple crates being developed together.** This includes managing dependencies and build instructions.

### Crates as Trees of Modules

Zooming into an individual crate, we can visualize it as a **tree of modules**:

```
my-crate
|- src
   |- main.rs (crate root module)  
   |- parsers.rs (parsers module)
      |- json.rs (nested module)
   |- models.rs (models module)
```

The `main.rs` file typically contains the crate root module and pulls in all other modules. **Modules allow logically segmenting code within the crate.**

### Tying it Together 

The key takeaways when considering all three components:

- **Packages:** High-level collection of related crates and configuration  
- **Crates:** Unit of compilation and sharing between projects
- **Modules:** Organization of code within a crate

Rust's powerful module system sets it apart from other languages in managing complexity through explicit boundaries as projects scale.

## Code Sharing Between Projects

A major advantage of Rust's crate system is the ability to easily share and reuse code between different projects.

### Leveraging Crates for Reuse

As mentioned previously, published crates on https://crates.io are available for any Rust project to use. Some ways to leverage existing crates:

**1. Finding functionality in crates**

The site provides search and discovery tools to find crates providing needed functionality - no need to reinvent the wheel!

**2. Specifying crates as dependencies** 

In your project's `Cargo.toml` file:

```
[dependencies]
serde = { version = "1.0", features = ["derive"] }
```

Cargo will automatically download and compile the crate.

**3. Using crates in code**

```rust
use serde::{Serialize, Deserialize}; 

#[derive(Serialize, Deserialize)]
struct MyData {...}
```

Then build on top of crate functionality in your code!

### Creating Reusable Crates

On the flip side, developers can create crates to extract and generalize reusable code from their projects:

1. **Define API boundaries** - Use modules to specify a public API.
2. **Configure packaging** - Set up compilation and artifacts in `Cargo.toml`.
3. **Publish to crates.io** - Make your crate available to others!

Publishing quality crates is a great way to contribute to the Rust ecosystem.

Overall crates enable a thriving, collaborative culture of code sharing and reuse between Rust projects.

## Practical Tips for Effective Project Organization

Now that we've covered the mechanics of how Cargo, crates, and modules work, let's discuss some best practices for organizing code effectively.

### Structuring Projects

When structuring your Rust projects, keep these guidelines in mind:

- Split logically distinct functionality into separate crates
- Further break down code by feature using modules/sub-modules  
- Favor small modules focused on specific tasks  
- Minimize dependencies between modules 
- Expose clean public APIs for consuming code

Well-factored modules create clear boundaries and encapsulation. This pays dividends as the codebase evolves.

At the same time, be careful about taking modularity too far. Evaluating tradeoffs around cohesion and complexity is important.

### Evolution Over Time

Focus on getting the high-level crate and module structure right initially, while keeping flexibility to tweak modules over time.

Resist overengineering folder hierarchies up front. Allow structure to emerge iteratively as understanding deepens.

The key is finding the right balance between planning and emerging design for your project's context.

Now let's shift gears and cover some commonly used cargo commands.            

## Cargo Commands for Project Management

Cargo provides a wide range of commands for building, testing, and managing Rust projects. Here are some of the most common and useful ones to know.

### Compiling and Running

```
cargo build   # Compile the current package 
cargo run     # Compile and run binary
cargo check   # Check code without compiling
cargo clean   # Clean up built artifacts
```

Use these frequently during development to compile and test code increments.

### Testing

```
cargo test           # Run all tests
cargo test --doc     # Test documentation samples
cargo test <name>    # Run a specific test
```

Testing key functionality in a loop is crucial during active development.

### Package Management 

```
cargo init           # Create a new package 
cargo new <name>     # Create project from template
cargo update         # Update dependencies
cargo publish        # Publish a package publicly 
```

Managing the lifecycle of packages, updates, and publishing.

### Additional Commands

There are many more specialized cargo commands - these are just some everyday examples. The `cargo` docs cover all available options. Learn these over time as needed rather than upfront.

## Recap and Next Steps

Let's recap what we learned about Cargo, Crates, and Modules:

### Key Takeaways

- **Cargo** - Rust's official package manager and build tool. It handles tasks like building, testing, dependency management, and publishing packages.
- **Crates** - The compilation unit in Rust. Crates allow encapsulating and sharing related functionality.
- **Modules** - Modules organize code within a crate by splitting functionality into logical groups.
- **Packages** - Top-level containers that hold one or more crates as source. Useful for managing groups of crates together.

Understanding the relationship between these concepts is key to structuring Rust projects successfully.

### What's Next  

With this foundation on project organization, some suggested next steps:

- Review the online Cargo guide and API docs
- Experiment with configuring projects through Cargo.toml
- Practice factoring projects into modules, structuring apps as workspaces
- Read guides on Rust API design patterns 

There is always more to learn when it comes to architecting Rust codebases. But don't get blocked on over-engineering structure prematurely - start coding and refactor along the way!
