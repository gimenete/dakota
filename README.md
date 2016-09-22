# dakota package

Atom package that transforms pieces of JavaScript code

![dakota](https://raw.githubusercontent.com/gimenete/dakota/master/assets/dakota.gif)

Put the cursor inside a template string, a string literal or an arrow function and press `shift-alt-d`

## Supported transforms

- An arrow function without a block statement is transformed into an arrow function with block statement and a return statement
- An arrow function with one statement being a return statement is transformed into an arrow function without braces and return
- A template string is transformed into a regular literal string
- A regular literal string is transformed into a template string

## TODO

- Make the code style configurable (semi colons, quotes, etc.)
- Add more transforms (ES6/ES6 imports and exports for example)
