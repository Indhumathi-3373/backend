const activeSessions = new Set();

function add(sessionId) {
  if (sessionId) activeSessions.add(sessionId);
}

function remove(sessionId) {
  if (sessionId) activeSessions.delete(sessionId);
}

function count() {
  return activeSessions.size;
}

module.exports = {
  add,
  remove,
  count
};
