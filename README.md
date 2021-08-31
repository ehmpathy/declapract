declapract
==============

Scalable software best practices. Declare, plan, and apply software practices across code bases.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/declapract.svg)](https://npmjs.org/package/declapract)
[![Codecov](https://codecov.io/gh/uladkasach/declapract/branch/master/graph/badge.svg)](https://codecov.io/gh/uladkasach/declapract)
[![Downloads/week](https://img.shields.io/npm/dw/declapract.svg)](https://npmjs.org/package/declapract)
[![License](https://img.shields.io/npm/l/declapract.svg)](https://github.com/uladkasach/declapract/blob/master/package.json)

# Table of Contents
<!-- toc -->
- [Goals](#goals)
- [Installation](#installation)
- [Usage](#usage)
- [Commands](#commands)
  - [`declapract help [COMMAND]`](#declapract-help-command)
- [Contribution](#contribution)
<!-- tocstop -->

# Purpose

Scaling software best practices across an organization is difficult - but when done right, is a super power.

`declapract` provides a declarative, scalable, and maintainable way to define, enforce, and evolve software best practices to unlock:
- **systematic knowledge synthesis**
  - practices are declaratively defined with code and explained with readmes
  - so that
    - future travelers can read exactly why a practice was deemed "best" or "bad"
    - future travelers can collaborate on, debate, improve, and manage software practices like code (e.g., with pull requests, issues, etc)
- **automatic knowledge transfer**
  - developers in your org are alerted any time they don't follow a best practice - or use a bad practice!
  - so that
    - knowledge is not siloed to people that have learned through tribal knowledge already what practices are best or bad
    - knowledge can be transferred automatically as part of the automated software development lifecycle (e.g., as part of your cicd-pipeline, exposed in pull-requests)
- **effortless code base monitoring**
  - determine for any code base whether and which software practices it is not adhering to with one command
  - so that
    - you can automatically block code changes that introduce bad practices / don't follow best practices
    - you can easily get check each code base in your organization to get an overview of technical debt
- **scalable technical debt elimination**
  - automatically fix code bases, upgrading them to your best practices and removing bad practices
  - so that
    - you can scale keeping your code bases up to date
    - your developers can get back to adding business value instead of upgrading old project

Software practices are an infrastructure of their own. Its time we manage them like it.

# Usage

There are a few cases for using `declapract`. We'll go over each.

## Case 1: Create a new code base from declared best practices

Similar to `git clone`, but leveraging explicitly declared best practices to create an entirely new project instead.

Example:
```sh
npx declapract clone --declarations=ssh:github.com/path/to-declarations-repo --use-case=your-use-case
```

## Case 2: Add best practice management to a code base

Sets up a code base to follow a set of [declared best practices](#declare-best-practices).

install
```sh
npm install --save-dev declapract
```

configure
```sh
touch ./declapract.use.yml;
echo "
declarations: git@github.com:path/to-declarations.git
useCase: your-use-case
variables:
  variableName: 'variableValue' # the variables required by the  practices
  ...
" >> ./declapract.use.yml;
```

## Case 3: Declare best practices

create a new repository, based on best practices for declaring best practices
```sh
npx declapract --declarations=ssh:github.com/uladkasach/best-practices-declarations --use-case=declarations
```

## practices

### exact

### contains

### exists

### custom

### readme

### tests

## use cases

### basic
### extends
### examples

# Commands (todo, move these descriptions into the oclif def)

### `declapract validate`

Validate that your declared practices don't have any syntax errors and do what you expect.

See [declaring-best-practices](#declaring-best-practices) for docs on how to declare best practices.

### `declapract plan [--practice=name]`

Check a code base / software repository against a declared use-case and report whether there are any actions that need to be taken to make it adhere to the declared practices of that use-case.

### `declapract apply [--practice=name]`


# Commands
<!-- commands -->
* [`declapract help [COMMAND]`](#declapract-help-command)

## `declapract help [COMMAND]`

display help for declapract

```
USAGE
  $ declapract help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.0/src/commands/help.ts)_
<!-- commandsstop -->


# Contribution

Team work makes the dream work! Please create a ticket for any features you think are missing and, if willing and able, draft a PR for the feature :)
