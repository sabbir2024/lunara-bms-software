function aggregate(data, pipeline) {
  let result = data;

  for (const stage of pipeline) {
    if (stage.$match) {
      const queryEngine = require('./query');
      result = queryEngine(result, stage.$match);
    }

    if (stage.$group) {
      const { _id, ...accumulators } = stage.$group;
      const groups = {};

      for (const doc of result) {
        const groupKey = doc[_id];
        if (!groups[groupKey]) groups[groupKey] = [];

        groups[groupKey].push(doc);
      }

      result = Object.entries(groups).map(([key, docs]) => {
        const grouped = { _id: key };

        for (const [field, operation] of Object.entries(accumulators)) {
          const op = Object.keys(operation)[0];
          const path = operation[op].replace('$', '');

          if (op === '$sum') {
            grouped[field] = docs.reduce((acc, d) => acc + (d[path] || 0), 0);
          }
        }

        return grouped;
      });
    }
  }

  return result;
}

module.exports = aggregate;
