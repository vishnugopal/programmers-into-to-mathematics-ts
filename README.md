# programmers-intro-ts

A TypeScript implementation of secret sharing algorithms with comprehensive mathematical foundations. This project demonstrates how secrets can be split into multiple shares where only a threshold number of shares is needed to reconstruct the original secret.

## Overview

This project implements a custom secret sharing scheme that:

- **Encodes** text secrets (up to 6 characters) into polynomial coefficients
- **Generates** cryptographic shares as polynomial evaluation points
- **Reconstructs** the original secret using Lagrange polynomial interpolation
- **Provides** a complete mathematical library for polynomial arithmetic with rational numbers

## Installation

Install Bun: https://bun.com/docs/installation

```bash
bun install
```

## Usage

### Running Tests

```bash
bun test
```

### Basic Example

```typescript
import { encode, decode } from './src/secret-share';

// Encode a secret into shares
const secret = "Hello!";
const shares = encode(secret);
console.log("Generated shares:", shares);

// Decode the secret from shares
const reconstructed = decode(shares);
console.log("Reconstructed secret:", reconstructed); // "Hello!"
```

## How It Works

### 1. Secret Encoding

The system converts each character of the secret to its ASCII value and uses these as coefficients in a polynomial:

- For secret "Hi": ASCII values [72, 105] become polynomial coefficients
- Creates polynomial: `105x + 72`
- Evaluates polynomial at random points to generate shares

### 2. Share Generation

Each share is a point `(x, y)` where:
- `x` is a random rational number
- `y` is the polynomial evaluated at `x`

### 3. Secret Reconstruction

Uses Lagrange interpolation to reconstruct the original polynomial from the shares, then extracts the coefficients to recover the ASCII values and convert back to characters.

## Project Structure

```
src/
├── secret-share.ts          # Main secret sharing implementation
├── interpolate.ts           # Lagrange polynomial interpolation
└── lib/
    ├── polynomial.ts        # Polynomial arithmetic operations
    ├── rational.ts          # BigRational number utilities
    └── point.ts            # Point representation for coordinates

test/
├── secret-share.test.ts     # Secret sharing round-trip tests
├── interpolate.test.ts      # Polynomial interpolation tests
└── lib/                    # Library component tests
```

## Mathematical Foundation

### Polynomial Operations

The project includes a complete polynomial arithmetic library supporting:

- **Addition and multiplication** of polynomials
- **Evaluation** using both standard and Horner's method
- **Rational coefficient** handling for precise calculations
- **Human-readable formatting** for debugging

Example:
```typescript
import { newPolynomialFromPairs, print, evaluate } from './src/lib/polynomial';
import { toRational } from './src/lib/rational';

// Create polynomial: 3x² + 2x + 1
const poly = newPolynomialFromPairs([[1, 0], [2, 1], [3, 2]]);
console.log(print(poly)); // "3x^2 + 2x + 1"

// Evaluate at x = 2
const result = evaluate(poly, toRational(2));
console.log(result); // 17
```

### Lagrange Interpolation

The interpolation algorithm reconstructs a polynomial that passes through all given points:

```typescript
import { interpolate } from './src/interpolate';
import { toRational } from './src/lib/rational';

const points = [
  { x: toRational(1), y: toRational(3) },
  { x: toRational(4), y: toRational(9) }
];

const polynomial = interpolate(points);
// Results in: 2x + 1
```

## Technical Features

- **TypeScript**: Fully typed with strict compiler settings
- **BigRational arithmetic**: Handles precise fractional calculations using `big-rational-ts`
- **Bun runtime**: Modern JavaScript runtime for execution and testing
- **ESNext modules**: Uses modern JavaScript features
- **Comprehensive testing**: Unit tests for all mathematical operations

## Limitations

- **Secret length**: Limited to 6 characters to prevent coefficient overflow
- **Character encoding**: Uses ASCII values, suitable for basic text
- **Educational focus**: Designed for learning rather than production cryptography

## Testing

The project includes comprehensive tests covering:

- **Round-trip encoding/decoding** of secrets
- **Polynomial arithmetic** operations
- **Interpolation accuracy** with various point configurations
- **Edge cases** and error conditions

Run specific test suites:

```bash
# All tests
bun test

# Specific test file
bun test test/secret-share.test.ts
```

## Mathematical Background

This implementation demonstrates key concepts in:

- **Polynomial interpolation** and evaluation
- **Rational number arithmetic** for precise calculations
- **Secret sharing schemes** and threshold cryptography
- **Finite field mathematics** (conceptually)

The project serves as an educational tool for understanding how mathematical concepts translate into practical cryptographic applications.

## Dependencies

- `big-rational-ts`: For precise rational number arithmetic
- `@types/bun`: TypeScript definitions for Bun runtime
- `typescript`: TypeScript compiler

## License

MIT License
