declapract
==============

A tool to declaratively define best practices, maintainable evolve them, and scalably enforce them.

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

# Goals

The purpose of `declapract` is to provide a declarative way to define best practices, a maintainable way to evolve them, and a scalable way to use them.

Features:
- `declare`: define your software best practices declaratively, collaboratively, and informatively.
  - declarative: you specify _what_ they are, not _how_ to check
  - collaborative: anyone can easily propose new ideas, get feedback, and update practices for continuos refinement of best practices
  - informatively: everyone can reference _why_ best practices were chosen, naturally creating a knowledge base and learning resource
- `check`: scalably monitor and enforce best practices across all code bases
  - scalable: no extra work required per additional code base
  - monitor: see which code bases fail to adhere to which practices
  - enforce: fail builds for decreasing adherence to best practices
- `fix`: automatically fix or easily upgrade code bases that fall out of date
  - fix: when practices have an automatic fix that can be applied, your engineers can run `declapract fix --practice:${practiceName}`
  - upgrade: when there's no automatic fix, your engineers can easily see why their project is failing and what to do to resolve it
- `clone`: stand-up new projects using the best practices in a snap
  - by declaring a demonstration of a project with declapract, your engineers can run `declapract clone ${useCaseName}` for a shiny new repository with all of your best practices built in.

# Usage

## Declare

## Check

## Fix

## Clone

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
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.0/src/commands/help.ts)_
<!-- commandsstop -->


# Contribution

Team work makes the dream work! Please create a ticket for any features you think are missing and, if willing and able, draft a PR for the feature :)
