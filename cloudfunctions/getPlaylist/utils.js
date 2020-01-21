// 数组去重
// list: Array 需要去重的数组
// key: String 数组每项的唯一识别id
const listUniq = (list, key) => {
  var obj = {};

  const resultList = list.reduce((item, next) => {
    obj[next[key]] ? "" : (obj[next[key]] = true && item.push(next));
    return item;
  }, []);

  return {
    resultList,
    keys: Object.keys(obj),
  }
}

const log = {
  info: message => {
    console.log(`[INFO] ${message}`)
  },
  error: message => {
    console.error(`[ERROR] ${message}`)
  },
}

module.exports = {
  log,
  listUniq
}