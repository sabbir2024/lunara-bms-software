function indexCollection(collection) {
  collection.indexes = {};

  for (const doc of collection.data) {
    for (const key in doc) {
      if (!collection.indexes[key]) {
        collection.indexes[key] = new Map();
      }

      const value = doc[key];
      if (!collection.indexes[key].has(value)) {
        collection.indexes[key].set(value, []);
      }

      collection.indexes[key].get(value).push(doc);
    }
  }
}

module.exports = { indexCollection };
