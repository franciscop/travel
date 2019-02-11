// To run this example, execute:
// $ npm run demo
// $ npm run demo -- driver=api
// $ npm run demo -- driver=sql
// $ npm run demo -- driver=memory   # note: default
import db from './index.mjs';

import memory from './memory';
import mongo from './mongo';
import sql from './sql';
import api from './api';

// Pick up the correct driver from the CLI
const drivers = { memory, mongo, sql, api };
const driverPick = process.argv.find(str => /driver\=/.test(str));
const driverName = driverPick ? driverPick.split('=').pop() : 'memory';
const driver = drivers[driverName];

db({ driver });

const log = data => data && Object.keys(data).length && console.table(data);
// const log = () => {};

(async () => {
  console.log('\nconst users = await db.users;');
  log(await db.users);  // []

  console.log(`\n\n\n# CREATE`);
  console.log(`\ndb.users.push({ id: 1, name: 'Francisco', tos: true });`);
  db.users.push({ id: 1, name: 'Francisco', tos: true });
  log(await db.users);

  console.log(`\ndb.users.push({ id: 2, name: 'Sarah', tos: true });`);
  db.users.push({ id: 2, name: 'Sarah', tos: true });
  log(await db.users);

  console.log(`\ndb.users.push({ id: 3, name: 'John', tos: false });`);
  db.users.push({ id: 3, name: 'John', tos: false });
  log(await db.users);



  console.log(`\n\n\n# READ`);
  console.log(`\nconst users = await db.users`);
  // Note: not able to read it yet
  log(await db.users);

  console.log(`\nconst first = await db.users.find(1);`);
  // Note: not able to read it yet
  log(await db.users.find(1));

  console.log(`\nconst accept = await db.users.filter({ tos: true });`);
  // Note: not able to read it yet
  log(await db.users.filter({ tos: true }));


  console.log(`\n\n\n# UPDATE`);
  console.log(`\ndb.users.find(1).name = 'Paco';`);
  db.users.find(1).name = 'Paco';
  log(await db.users);

  console.log(`\ndb.users.find({ id: 1 }).name = 'パコ';`);
  db.users.find({ id: 1 }).name = 'パコ';
  log(await db.users);

  console.log(`\ndb.users.filter({ name: 'パコ' }).name = 'Francisco';`);
  // Cannot use *named* prepared statements, or this won't work:
  db.users.filter({ name: 'パコ' }).name = 'Francisco';
  log(await db.users);


  console.log(`\n\n\n# DELETE`);
  // Clear the whole table
  //delete db.users;
  //log(await db.users);
  console.log(`\ndb.users.splice(1);`);
  db.users.splice(1);
  log(await db.users);

  console.log(`\ndb.users.splice({ id: 2 });`);
  db.users.splice({ id: 2 });
  log(await db.users);
})();
