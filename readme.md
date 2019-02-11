# Travel

Create and manage your Javascript data at hyperspeed:

```js
import db from 'travel';

db.users.push({ name: 'Francisco' });
db.users.push({ name: 'Sarah' });

console.log(await db.users);
// [{ name: 'Francisco' }, { name: 'Sarah' }]
```

With the same Javascript syntax, it makes [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) operations anywhere you want:

- **Memory** (default): start with just variables.
- **Rest API**: make HTTP calls when each data modification happens.
- **IndexedDB**: the Browser database so you don't even need your own back-end.
- **SQL Database**: which can be connected anywhere.
- **MongoDB Database**: which can be connected anywhere.
- **Help us**: by adding more data storage places. E.G. filesystem, CSVs, etc

Features:

- Consistent **Javascript API**. Work with any kind of store using the same API so you don't have to worry about your data sourcing. Start prototyping in memory and then switch to a REST API or IndexedDB with a single line.
- **Extends the Javascript API** so you get some extra capabilities like filtering with an object `.filter({ id: 2 })` but still has all the native methods available like `.filter(({ id }) => id === 2)`.
- **Universal JS** so you can use the same code in the front-end and on the back-end/CLI.
- **Tiny footprint** with **no dependencies**. Not only is the whole thing SIZE_HERE, but it also supports treeshaking to make it even smaller.
- Underlying **query builder** that optimizes the engines for many cases like `.filter()`, `.find()`, `.slice()`, etc.

Antifeatures:

- **No big-data scale**. This is to make your prototype, convert it into a MVP and launch it to production to grow your userbase. However, it does not have advanced features like JOINs, GraphQL-queries, etc. so it's difficult to optimize for performance. See [the migration guide](#arrived-home) if you want to get rid of `travel`. I strongly believe you should aim to launch quick and iterate hard, and only when things look like they are growing to start optimizing.
- There are some **small differences in the drivers** that you have to be aware of *to optimize* them. Not needed in the beginning, but it might as well allow you to grow another 10x if you squeeze it. See [each driver docs](#drivers) for the specifics.

For instance, to change the engine of the example in the beginning to a REST API:

```js
import { api } from 'travel';
const db = new api({ url: 'https://api.example.com/' });

// Make two POST requests to /users
db.users.push({ name: 'Francisco' });
db.users.push({ name: 'Sarah' });

// Make a GET request to /users
console.log(await db.users);
// [{ name: 'Francisco' }, { name: 'Sarah' }]
```



## Getting started

First install it with npm:

```bash
npm install travel
```

Then you can import it and use it:

```js
import db from 'travel';

// You need this `async` context to be able to run any `await` call
(async () => {

  // CREATE
  db.users.push({ name: 'Francisco' });
  db.users.push({ name: 'Sarah' });

  // READ
  console.log(await db.users);
  // [{ name: 'Francisco' }, { name: 'Sarah' }]

  // UPDATE; .find() => one, .filter() => many
  db.users.filter({ name: 'Francisco' }).name = 'Paco';
  console.log(await db.users);
  // [{ name: 'Paco' }, { name: 'Sarah' }]

  // DELETE
  db.users.splice({ name: 'Paco' });
  console.log(await db.users);
  // [{ name: 'Sarah' }]
})();
```




## Documentation

The library behaves like a Javascript object, where each key should be treated as an array:

```js
import db from 'travel';

(async () => {
  // The different "tables"
  console.log(await db.users); // [];
  console.log(await db.books); // [];
  console.log(await db.games); // [];
})();
```

> For the database technology (SQL, MongoDB) the tables should already be created wherever the database is going to be hosted, but no need to initialize them as empty arrays in Javascript.



### Create

To add a single new record, you can use `.push()` as usual for arrays:

```js
import db from 'travel';

(async () => {
  console.table(await db.users);
  // []

  // Add the first record
  db.users.push({ name: 'Francisco' });
  console.table(await db.users);
  // [{ name: 'Francisco' }]

  db.users.push({ name: 'Sarah' });
  console.table(await db.users);
  // [{ name: 'Francisco' }, { name: 'Sarah' }]
})();
```

You can also add multiple records at once with `push()`:

```js
import db from 'travel';

(async () => {
  console.table(await db.users);
  // []

  db.users.push({ name: 'Francisco' }, { name: 'Sarah' });
  console.table(await db.users);
  // [{ name: 'Francisco' }, { name: 'Sarah' }]

  const newUsers = [{ name: 'John' }, { name: 'Maria' }];
  db.users.push(...newUsers);   // DO NOT DO .push(newUsers), you need the "..."
  console.table(await db.users);
  // [{ name:'Francisco' }, { name:'Sarah' }, { name:'John' }, { name:'Maria' }]
})();
```

You can also initialize the data, which will *delete* and *add* records by **overwriting** the whole table as expected from the Javascript syntax:

```js
import db from 'travel';

// This will remove the previous records and set the new user records
db.users = [
  { id: 0, name: 'Francisco', time: new Date('1990-01-01').toISOString() },
  { id: 1, name:     'Sarah', time: new Date('1990-01-02').toISOString() },
  { id: 2, name:      'John', time: new Date('1990-01-03').toISOString() },
  { id: 3, name:     'Maria', time: new Date('1990-01-04').toISOString() },
];
```



### Read

These are the only ones that need the keyword `await`, but there are *many* read operations. Let's start with a simple one, getting everything as a plain array of objects:

```js
console.log(await db.users);
// [{ id: 0, name: 'Francisco', time: '1990-01-01T00:00:00Z' }, ...]
```

To avoid overly repeating ourselves, this is the *init* code that we'll use in all the examples:

```js
import db from 'travel';
db.users = [
  { id: 0, name: 'Francisco', email: 'francisco@gmail.com', time: new Date('1990-01-01') },
  { id: 1, name:     'Sarah', email:     'sarah@gmail.com', time: new Date('1990-01-02') },
  { id: 2, name:      'John', email:    'john@hotmail.com', time: new Date('1990-01-01') },
  { id: 3, name:      'Jane', email:    'jane@hotmail.com', time: new Date('1990-01-02') },
];

// All *await* operations need to be within an async context
(async () => {

  // READ OPERATIONS HERE

})();
```

Let's find all of the users with their birthday on January 1st 1990:

```js
const younger = await db.users.filter({ time: new Date('1990-01-01') });
console.log(younger);
// [{ id: 0, email: 'Francisco', ... }, { id: 2, email: 'John', ... }]
```

We can also match by their email provider with a bit of Regexp:

```js
const gmail = await db.users.filter({ email: /@gmail\.com$/ });
console.log(gmail);
// [{ id: 0, email: 'francisco@gmail.com', ... }, { id: 1, email: 'sarah@gmail.com', ... }]
```

Or we can apply a manual filter and just loop over each of them:

```js
const earlyAdopters = await db.users.filter(({ id }) => id <= 1);
console.log(earlyAdopters);
// [{ id: 0, name: 'Francisco', ... }, { id: 1, name: 'Sarah', ... }]
```

You can do all of these operations, but for a single user, if you use `.find()` instead of `filter()` as usual with Javascript. Let's find the one with the id `1`:

```js
// Note: we are extending the capabilities of `filter` only for this library
const me = await db.users.filter({ id: 1 });
console.log(me);
// { id: 0, name: 'Francisco', email: 'francisco@gmail.com', time: '1990-01-01T00:00:00Z' }
```

That's awesome! But what if you want to limit your query to N users? In Javascript you can use `.slice()`, so let's just use it:

```js
// Get the first 10 users
const firstPage = await db.users.slice(0, 10);
console.log(firstPage);
// [{ id: 0, ... }, { id: 1, ... }, ..., { id: 9, ... }]
```




## Drivers

First let's see some examples of using the different drivers:

```js
import db, { memory, indexeddb, sql, mongo, api } from 'travel';

// Start prototyping with a global data store
db.users.push({ name: 'Francisco' });
// Creates an array and pushes the item there

// Connect to the browser database storage for quick access on the front-end
const db = indexed('dbname');
db.users.push({ name: 'Francisco' });
// const store = event.target.result.createObjectStore("users");
// store.add({ name: 'Francisco' });

// Connect to a remote database that you have defined previously
const db = sql('sql-url.com');
db.users.push({ name: 'Francisco' });
// "INSERT users (name) VALUES (?)" ["Francisco"] (prepared statements)

// Use a MongoDB instance from any host
const db = mongo('mongo-url.com');
db.users.push({ name: 'Francisco' });
// db.users.insertOne({ name: 'Francisco' })

// Make REST API calls to the back-end
const db = api('api-url.com');
db.users.push({ name: 'Francisco' });
// POST api-url.com/users/ { "name": "Francisco" } (application/json)
```


**TEST**. Which one is a better API?

```js
// Plain object configuration
import db from 'travel';
db({ driver: 'memory', ...OPTIONS });
db({ driver: 'api', ...OPTIONS });
// -large codebase since it has all engines
// -difficult to write a new driver
// -non-scalable for other drivers
// -makes changing engine difficult since you also have to change the options
// -single global source

// Drivers that are initialized with their options
import db, { memory, api } from 'travel';
db(memory(OPTIONS));
db(api(OPTIONS));
// -too verbose
// -cannot do multiple instances
// -confusing since it's a pattern not well used
// -single global source

// Individual instances
import db, { memory, api } from 'travel';
const db = memory(OPTIONS);
const db = api(OPTIONS);
// -difficult to write a new driver
// -unique instances, bringing a big concurrent mess
// -change the API to change the engine; consider removing the `db`

// Import a file
import db from 'travel/memory';
import db from 'travel/api';
db(OPTIONS);
// -cannot do multiple instances
// -confusing without initializing since it's the same name
// -changing engines a bit more difficult
```


















## OLD DOCUMENTATION/PROJECT

Data navigation and exploration tool with Javascript:

> Note: refactoring needed! This example is the next step for the code, but not yet working

```js
const data = travel({
  // Load the data from a dataset of plain entities
  users: [
    { id: 0, friends: [3, 1], name: 'John' },
    { id: 1, friends: [2, 3], name: 'Mary' },
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
