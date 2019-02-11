// In-memory database, AKA object of arrays
const db = {};

const memory = {};

memory.create = ({ table, data }) => {
  db[table] = db[table] || [];
  db[table].push(data);
};

memory.read = async ({ table, filter }) => {
  db[table] = db[table] || [];
  return db[table].filter(obj => {
    for (let key in filter) {
      if (obj[key] !== filter[key]) return false;
    }
    return true;
  });
};

memory.update = ({ table, filter, data }) => {
  db[table] = db[table] || [];
  db[table].forEach(obj => {
    for (let key in filter) {
      if (obj[key] !== filter[key]) return;
    }
    for (let key in data) {
      obj[key] = data[key];
    }
  })
}

memory.delete = ({ table, filter }) => {
  db[table] = db[table] || [];
  db[table] = db[table].filter(obj => {
    for (let key in filter) {
      if (obj[key] !== filter[key]) return true;
    }
    return false;
  })
};

export default memory;
