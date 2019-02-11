// MYSQL
const api = {};

const query = obj => {
  if (!obj) return '';
  const entries = Object.entries(obj);
  if (!entries.length) return '';
  const pairs = entries.map(([key, value]) => `${key}=${encodeURIComponent(value)}`);
  return `?${pairs.join('&')}`;
};

api.fetch = async (url, { method = "GET", body = '' } = {}) => {
  console.log(method, url, body);
  // BUNDLE THE NEW QUERY INTO THE QUEUE AND RETURN THE RESOLVED VALUE.
  // THE QUEUE SYSTEM WILL BE SEQUENTIAL TO AVOID READ BEFORE WRITE
  // CONSIDER PUTTING THE QUEUE SYSTEM ONE LEVEL UP IN THE ROOT!
  // return ACTUAL_QUERY(str, values);
  return [];
};

api.create = async ({ table, data }) => {
  api.fetch(`/${table}/`, { method: 'POST', body: data });
  return;
};

api.read = async ({ table, filter }) => {
  return api.fetch(`/${table}/${query(filter)}`);
};

// Update *a single field* of the object. Since the Javascript Proxy trap goes
//   one field at a time (even with Object.assign(obj, many)) then there's no need
//   to handle multiple props at once and `data` will only have one key: value
// Since it's a partial update, we'll use PATCH
api.update = async ({ table, filter, data }) => {
  api.fetch(`/${table}/${query(filter)}`, { method: 'PATCH', body: data });
  return;
};

api.delete = async ({ table, filter }) => {
  api.fetch(`/${table}/${query(filter)}`, { method: 'DELETE' });
  return;
};

export default api;
