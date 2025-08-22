const fs = require('fs');
const path = require('path');
const config = require('../config.json')

function Collection(name) {
  const dataDir = config.dataDirectory || path.join(__dirname, '..', 'data');
  const filePath = path.join(dataDir, `${name}.json`);

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf-8');
  }

  const load = () => JSON.parse(fs.readFileSync(filePath, 'utf-8') || '[]');
  const save = (data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

  return {
    insert(doc) {
      const data = load();
      const newDoc = { _id: doc._id || Date.now().toString(), ...doc };
      data.push(newDoc);
      save(data);
      return newDoc;
    },
    find(filter = {}) {
      const data = load();
      return data.filter((item) =>
        Object.entries(filter).every(([key, value]) => item[key] === value)
      );
    },
    findOne(filter = {}) {
    const data = load();
    return data.find((item) =>
    Object.entries(filter).every(([key, value]) => item[key] === value)
    );
    },

    update(filter, updateFields) {
      const data = load();
      let matched = 0;
      data.forEach((item) => {
        if (Object.entries(filter).every(([k, v]) => item[k] === v)) {
          Object.assign(item, updateFields);
          matched++;
        }
      });
      save(data);
      return { matched };
    },
    delete(filter) {
      let data = load();
      const before = data.length;
      data = data.filter((item) =>
        !Object.entries(filter).every(([k, v]) => item[k] === v)
      );
      save(data);
      return { deleted: before - data.length };
    },
    aggregate(pipeline) {
      let data = load();
      for (const stage of pipeline) {
        if (stage.$match) {
          data = data.filter((item) =>
            Object.entries(stage.$match).every(([k, v]) => item[k] === v)
          );
        }
        // You can extend $group, $sort etc.
      }
      return data;
    }
  };
}

module.exports = Collection;
