# Travel

Data navigation and exploration tool with Javascript:

> Note: refactoring needed! This example is the next step for the code, but not yet working

```js
const data = travel({
  // Load the data from a dataset of plain entities
  users: [
    { id: 0, friends: [3, 1], name: 'John' },
    { id: 1, friends: [2, 3], name: 'Mery' },
    { id: 2, friends: [3, 0], name: 'Bill' },
    { id: 3, friends: [0, 1], name: 'Sarah' },
    // ...
  ],
  books: [
    { id: 0, title: 'Picnic', author: 2, buyers: [1, 3] },
    { id: 1, title: 'jQuery', author: 1, buyers: [0, 2] },
    { id: 2, title: 'React',  author: 3, buyers: [0, 3] },
    // ...
  ]
}, {
  // Define the data relationships:
  'users.*.friends.*': (data, id) => data.users.find(u => u.id === id),
  'books.*.buyers.*': (data, id) => data.users.find(u => u.id === id),
  'books.*.author': (data, id) => data.users.find(u => u.id === id),
});
```

Then read the data with as much nesting as desired:

```js
console.log(data.users[0].name);
console.log(data.users[0].friends[0].name);
console.log(data.users[0].friends[0].friends[0].name);
console.log(data.users[0].friends[0].friends[0].friends[0].name);
console.log(data.users[0].friends[0].friends[0].friends[0].friends[0].name);
```

Or perform complex queries with simple dot and array notation:

```js
log("Author's best friend:", data.books[0].author.friends[0].name);
log("Book's First client:", data.books[0].buyers[0].name);
log("Clients alphabetically:", data.books[0].buyers.map(a => a.name).sort());
```


Demo:

https://jsfiddle.net/franciscop/gdbcfv9y/8/
