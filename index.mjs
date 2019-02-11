import memory from './memory';

const entry = ({ base, table, filter, one }) => {
  // Number and Strings will be set as "id=FILTER"
  if (typeof filter !== 'object') {
    filter = { id: filter };
  }
  const extractOne = res => {
    console.log(res);
    return one ? res[0] : res;
  };
  return new Proxy({}, {
    get: (obj, prop) => {
      if (prop === 'then') {
        return async (...args) => {
          const res = await base.driver.read({ table, filter });
          const data = one ? res[0] : res;
          return Promise.resolve(data).then(...args);
        };
      }
    },
    set: (obj, prop, value) => {
      base.driver.update({ table, filter, data: { [prop]: value } });
      return true;
    }
  });
};

function base () {}
base.driver = memory;

export default new Proxy(base, {
  get: (base, table) => {
    return new Proxy([], {
      get: (arr, key) => {
        if (key === 'then') {
          return cb => base.driver.read({ table }).then(cb);
        }
        if (key === 'catch') {
          return base.driver.read({ table });
        }
        if (key === 'find') {
          return filter => entry({ base, table, filter, one: true });
        }
        if (key === 'filter') {
          return filter => entry({ base, table, filter });
        }
        if (key === 'push') {
          return data => base.driver.create({ table, data });
        }
        if (key === 'splice') {
          return filter => {
            if (typeof filter !== 'object') {
              filter = { id: filter };
            }
            base.driver.delete({ table, filter });
          }
        }

        return entry({ base, table, filter: { id: key }, one: true });
      },
      deleteProperty: (obj, prop) => {
        return base.driver.delete({ table, filter: { id: prop } });
      }
    });
  },
  deleteProperty: (base, table) => {
    base.driver.delete({ table });
  },
  apply: (target, self, [opts = {}] = []) => {
    for (let key in opts) {
      base[key] = opts[key];
    }
  }
});
