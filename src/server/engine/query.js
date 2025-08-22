function match(doc, filter) {
  return Object.entries(filter).every(([key, condition]) => {
    const val = doc[key];

    if (typeof condition === 'object') {
      return Object.entries(condition).every(([op, cmp]) => {
        if (op === '$gt') return val > cmp;
        if (op === '$lt') return val < cmp;
        if (op === '$in') return cmp.includes(val);
        if (op === '$eq') return val === cmp;
        return false;
      });
    }

    return val === condition;
  });
}

function queryEngine(data, filter) {
  return data.filter(doc => match(doc, filter));
}

module.exports = queryEngine;
