// MYSQL
const sql = function (str, values) {

  // This should really wrap it into a whole DB
  // For `const db = new SQL({ options })`
  // if (this instanceof sql) {
  //   this.options = str;
  //   this.create = sql.create;
  //   this.read = sql.read;
  //   this.update = sql.update;
  //   this.delete = sql.delete;
  //   return this;
  // }

  values = values && values.length ? values : undefined;
  console.log(str.trim(), values ? JSON.stringify(values) : '');
  // BUNDLE THE NEW QUERY INTO THE QUEUE AND RETURN THE RESOLVED VALUE.
  // THE QUEUE SYSTEM WILL BE SEQUENTIAL TO AVOID READ BEFORE WRITE
  // CONSIDER PUTTING THE QUEUE SYSTEM ONE LEVEL UP IN THE ROOT!
  // return ACTUAL_QUERY(str.trim(), values);
  return [];
};

sql.create = async ({ table, data }) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  await sql(`INSERT ${table} (${keys}) VALUES (${keys.map(k => '?')})`, values);
  return;
};

sql.read = async ({ table, filter }) => {
  filter = filter || {};
  const keys = Object.keys(filter).map(k => k + '=?').join(' AND ');
  const values = Object.values(filter);
  const where = keys.length ? `WHERE ${keys}` : '';
  return await sql(`SELECT * FROM ${table} ${where}`, values);
};

// Update *a single field* of the object. Since the Javascript Proxy trap goes
//   one field at a time (even with Object.assign(obj, many)) then there's no need
//   to handle multiple props at once and `data` will only have one key: value
sql.update = async ({ table, filter, data }) => {
  filter = filter || {};
  const [key, value] = Object.entries(data)[0];
  const keys = Object.keys(filter).map(k => k + '=?').join(' AND ');
  const values = Object.values(filter);
  const where = keys.length ? `WHERE ${keys}` : '';
  await sql(`UPDATE ${table} SET ${key}=? ${where}`, [value, ...values]);
  return;
};

sql.delete = async ({ table, filter }) => {
  filter = filter || {};
  const keys = Object.keys(filter).map(k => k + '=?').join(' AND ');
  const values = Object.values(filter);
  const where = keys.length ? `WHERE ${keys}` : '';
  await sql(`DELETE FROM ${table} ${where}`, values);
  return;
};

export default sql;
