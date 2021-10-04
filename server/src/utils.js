const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const adapter = new FileAsync('db.json');
const config = require('../db.config.json');

const db = (async () => {
  const _db = await low(adapter);
  await _db.defaults(config).write();
  return _db;
})()

async function getOhmById(id, _db) {
  _db = _db || await db;
  const ohm = _db.get('ohms')
      .find({ id })
      .value();

  if (ohm) {
    ohm.possibleNextStatusses = await getPossibleNextStatusses(ohm.status, _db);
  }

  return ohm;
}

async function updateOhmStatus(id, statusCode, comment) {
  const _db = await db;
  let ohm = await getOhmById(id, _db);

  if (ohm) {
    const statusses = await getPossibleNextStatusses(ohm.status, _db);

    if (statusses && statusses.length > 0 && statusses.findIndex(status => status.code === statusCode) !== -1) {
      if (comment) {
        ohm.comment = comment;
      }

      delete ohm.possibleNextStatusses;
      ohm.status = statusCode;
      ohm.history.push({
        state: statusCode,
        at: '123456789'
      });
      _db.write();
    }
  }

  return getOhmById(id, _db);
}

async function getPossibleNextStatusses(statusCode, _db) {
  const statusses = await getStatusses(_db);
  const currentIndex = statusses.findIndex(possibleNextStatusses => possibleNextStatusses.findIndex(status => status.code === statusCode) !== -1);

  return (currentIndex === -1 ? [] : statusses[currentIndex + 1]);
}

async function getStatusses(_db) {
	_db = _db || await db;
	const statusses = _db.get('statusses')
    .value();

	return statusses;
}

module.exports = { getOhmById, updateOhmStatus, getStatusses, getPossibleNextStatusses };