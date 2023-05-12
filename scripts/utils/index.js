import order_dict from "../json/order_dict.json" assert { type: "json" }
export const LINE_NAME_FORMATS = [
  "初_",
  "_二",
  "_三",
  "_四",
  "_五",
  "上_",
  "用_",
]

export const LINE_TYPES = ["九", "六"]
export const LINE_HEADERS = LINE_NAME_FORMATS.map((f) =>
  LINE_TYPES.map((l) => `${f.replaceAll("_", l)}`)
).flat()
export const LINE_HEADERS_REGEX = new RegExp(
  "^(" + LINE_HEADERS.join("|") + ")(?:：|，)(.*)"
)

export const parseYaoName = (name) => {
  let order, type
  for (let f of LINE_NAME_FORMATS) {
    let typePos = f.indexOf("_")
    let orderPos = 1 - typePos
    if (name[orderPos] == f[orderPos]) {
      order = LINE_NAME_FORMATS.indexOf(f)
      type = name[typePos] == "九" ? 1 : 0
      return { id: order + 1, type }
    }
  }
}

export const generateYaoName = (order, type) => {
  return LINE_NAME_FORMATS[order - 1].replaceAll("_", LINE_TYPES(type))
}

export const ZHUAN_ZH_EN_DICT = {
  彖: "tuan",
  象: "xiang",
  文言: "wen",
  序卦: "xu",
}

export const ZHUAN_HEADERS_REGEX = new RegExp(
  "^《(" + Object.keys(ZHUAN_ZH_EN_DICT).join("|") + ")》曰?：(.*)"
)

export const getSymbolById = (id, size = 6) => {
  let start
  switch (size) {
    case 6:
      start = "4DC0"
      break
    case 3:
      start = "2630"
      break
    case 2:
      start = "268C"
      break
    case 1:
      start = "268A"
      break
    default:
      break
  }
  return String.fromCharCode(parseInt(start, 16) + id - 1)
}

export const getSymbolByArray = (array) => {
  if (typeof array == "string") array = array.split("")
  let id = order_dict[`unicode_${array.length}`].lastIndexOf(array.join("")) + 1
  return getSymbolById(id, array.length)
}
