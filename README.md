# ESLint Plugin UseMemo Recommendations

Detect potentially heavy operations in React components and recommend using useMemo. Inspired by article [https://edvins.io/usememo-overdose](https://edvins.io/usememo-overdose)

## Rule Details

This rule looks for certain patterns in React component code that might indicate computationally heavy operations, such as:

- Nested loops
- Recursive function calls
- Chains of array operations like mapping, filtering, and sorting on potentially large arrays
- Potentially expensive mathematical calculations (e.g., exponentiation, trigonometric functions, logarithms)

When the rule detects one of these patterns, it suggests wrapping the code in useMemo to potentially improve performance.

Examples of **incorrect code** for this rule:

```jsx
const Component = () => {
  const array = [
    /* large array */
  ]
  const mapped = array.map(/* ... */).filter(/* ... */).sort(/* ... */)

  return <div>{mapped}</div>
}
```

```jsx
const Component = () => {
  const factorial = n => {
    if (n <= 1) return 1
    return n * factorial(n - 1)
  }

  return <div>{factorial(10)}</div>
}
```

Examples of **correct code** for this rule:

```jsx
const Component = () => {
  const array = [
    /* large array */
  ]
  const mapped = useMemo(
    () => array.map(/* ... */).filter(/* ... */).sort(/* ... */),
    []
  )

  return <div>{mapped}</div>
}
```

```jsx
const Component = () => {
  const result = useMemo(() => {
    const factorial = n => {
      if (n <= 1) return 1
      return n * factorial(n - 1)
    }
    return factorial(10)
  }, [])

  return <div>{result}</div>
}
```

## Installation

1. Install `eslint`

```sh
npm install --save-dev eslint
```

2. Install plugin

```sh
npm install --save-dev eslint-plugin-usememo-recommendations
```

3. Add plugin to your config

```json
{
  "plugins": ["usememo-recommendations"],
  "rules": {
    "usememo-recommendations/detect-heavy-operations": "warn"
  }
}
```
