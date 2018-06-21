const travel = require('./index.js');

const data = travel(`
  users.*.friends.* => users,
  books.*.buyers.* => users,
  books.*.author => users
`)({
  users: {
    0: { id: 0, name: 'John', friends: [3, 1] },
    1: { id: 1, name: 'Mery', friends: [2, 3] },
    2: { id: 2, name: 'Bill', friends: [3, 0] },
    3: { id: 3, name: 'Sara', friends: [0, 1] },
    // ...
  },
  books: {
    0: { id: 0, title: 'Picnic', author: 2, buyers: [1, 3] },
    1: { id: 1, title: 'jQuery', author: 1, buyers: [0, 2] },
    2: { id: 2, title: 'React',  author: 3, buyers: [0, 3] },
    // ...
  }
})
// , {
//   // Define the data relationships:
//   //'users.*.friends.*:data.users'
//   //'books.*.buyers.*:data.users'
//   //'books.*.author:data.users'
//   'users.*.friends.*': (data, id) => data.users.find(u => u.id === id),
//   'books.*.buyers.*': (data, id) => data.users.find(u => u.id === id),
//   'books.*.author': (data, id) => data.users.find(u => u.id === id),
// });

describe('relationships', () => {
  it('works when empty', () => {
    expect(JSON.stringify(travel()())).toBe('{}');
  });

  it('works with simple recursive friends', () => {
    expect(data.users[0].name).toBe('John');
    expect(data.users[0].friends[0].name).toBe('Sara');
    expect(data.users[0].friends[0].friends[0].name).toBe('John');
    expect(data.users[0].friends[0].friends[0].friends[0].name).toBe('Sara');
    expect(data.users[0].friends[0].friends[0].friends[0].friends[0].name).toBe('John');
  });

  it('performs deep queries', () => {
    expect(data.books[0].author.friends[0].name).toBe('Sara');
    expect(data.books[0].buyers[0].name).toBe('Mery');
    expect(data.books[0].buyers.map(a => a.name).sort()).toEqual(['Mery', 'Sara']);
  });

  it('updates the original reference', () => {
    expect(data.users[3].name).toBe('Sara');
    data.users[0].friends[0].name = 'Sarah';
    expect(data.users[3].name).toBe('Sarah');
  });
});
