const { GemVersion, GemRequirement } = require('./generated');
const { compare, rcompare } = require('./comparison');

module.exports = {
  validRange,
  satisfies,
  maxSatisfying,
  minSatisfying,
  gtr: () => { throw new Error('Not implemented'); },
  ltr: () => { throw new Error('Not implemented'); },
  outside: () => { throw new Error('Not implemented'); },
};

function _createRequirement(range) {
  return GemRequirement.$create(range.split(','));
}

function validRange(range) {
  if (range === null || range === undefined) { return null; }
  if (range === '') { return GemRequirement.$default().$to_s(); }

  try {
    return _createRequirement(range).$to_s();
  } catch (err) {
    return null;
  }
}

function satisfies(version, range) {
  try {
    return _createRequirement(range)['$satisfied_by?'](
      GemVersion.$create(version));
  } catch (err) {
    return false;
  }
}

function _firstSatisfying(versions, range, compareFunction) {
  const requirement = _createRequirement(range);
  const maxSatisfying = versions
    .map(v => GemVersion.$create(v))
    .sort(compareFunction)
    .find(v => requirement['$satisfied_by?'](v))
  return maxSatisfying ? maxSatisfying.$to_s() : null;
}

function maxSatisfying(versions, range) {
  return _firstSatisfying(versions, range, rcompare);
}

function minSatisfying(versions, range) {
  return _firstSatisfying(versions, range, compare);
}
