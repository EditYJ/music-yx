// 转换大数字到简写
export const getCount = count => {
  if (count < 0) return
  if (count < 10000) {
    return count
  } else if (Math.floor(count / 10000) < 10000) {
    return Math.floor(count / 1000) / 10 + '万'
  } else {
    return Math.floor(count / 10000000) / 10 + '亿'
  }
}

// 数组去重
// list: Array 需要去重的数组
// key: String 数组每项的唯一识别id
export const listUniq = (list, key) => {
  var obj = {};

  return list.reduce((item, next) => {
    obj[next[key]] ? "" : (obj[next[key]] = true && item.push(next));
    return item;
  }, []);
}

// 根据秒数输出分钟和秒
export const transformSec = (seconds) => {
  return {
    min: Math.floor(seconds / 60),
    sec: Math.floor(seconds % 60)
  }
}

// 补零操作
// 2 ==> "02"
// 21 ==> "21"
export const addZero = (number) => {
  return number < 10 ? `0${number}` : `${number}`
}

export const fmtTime = (date) => {
  let fmt = "yyyy-MM-dd hh:mm:ss"

  const regMap = {
    'y+': date.getFullYear(),
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  }

  for (const key in regMap) {
    if (new RegExp(`(${key})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, addZero(regMap[key]))
    }
  }
  
  return fmt
}