module.exports = {
  isEmpty: function(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false
      }
    }
    return true
  },
  findIndexById: function(array, id) {
    for (const [index, entry] of array.entries()) {
      if (entry._id == id) {
        return index
      }
    }
    return -1
  },
  normalizeArray: function(array) {
    let normalized = []
    for (const entry of array) {
      if (entry.issue_title) {
        normalized.push(entry)
      }
    }
    return normalized
  },
}
