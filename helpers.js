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
}
