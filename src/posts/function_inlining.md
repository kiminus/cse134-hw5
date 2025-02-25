---
title: compiler optimization - function inlining
---
### Function Inlining
> function inlining is a compiler optimization technique that replaces a function call with the function body.
> it moves the function body to the call site.

### Example
```c
int add(int a, int b) {
    return a + b;
}
```
```c
int main() {
    int x = 1;
    int y = 2;
    int z = add(x, y);
    return z;
}
```
after inlining:
```c
int main() {
    int x = 1;
    int y = 2;
    int z = x + y;
    return z;
}
```