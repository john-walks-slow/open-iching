import fs from "fs"
import {
  LINE_HEADERS_REGEX,
  ZHUAN_HEADERS_REGEX,
  ZHUAN_ZH_EN_DICT,
  parseYaoName,
  getSymbolById,
} from "../utils"
let xhtml = fs.readFileSync("./source.xhtml")
let lines = xhtml.toString().split("\n")

let data = []
let dataWithZhuan = []
let zhuan = {
  wen: {},
  xiang: {},
  tuan: {},
  xu: {},
}
let current
let index = -1
let isWenyan = false
let rareChars = {}
for (let line of lines) {
  let rareCharMatch = line.match(
    /<img class="kindle-cn-inline-character" alt="(.)" src="(\S*)" \/>/
  )
  if (rareCharMatch?.[2]) {
    rareChars[rareCharMatch[1]] = rareCharMatch[2]
    line = line.replace(
      /<img class="kindle-cn-inline-character" alt="(.)" src="(\S*)" \/>/,
      "$1"
    )
  }
  let gua = line.match(/<\/a>\d+．(.*)卦.*<\/h2>/)?.[1]
  let paragraph = line.match(/<p>(.*)<\/p>/)?.[1]
  if (gua) {
    index++
    isWenyan = false
    current = {
      id: index + 1,
      name: gua,
      symbol: getSymbolById(index + 1),
      array: [],
      combination: [],
      scripture: "",
      lines: [],
    }
    data[index] = current
    continue
  }
  let combination = line.match(
    /<p class="kindle-cn-picture-txt-withfewcharactors">(.)下(.)上<\/p>/
  )
  if (combination?.[2]) {
    current.combination = [combination[1], combination[2]]
    continue
  }
  if (paragraph) {
    let scriptureMatch = paragraph.startsWith(current.name + "：", "")
    let lineMatch = paragraph.match(LINE_HEADERS_REGEX)
    let zhuanMatch = paragraph.match(ZHUAN_HEADERS_REGEX)
    // console.log(paragraph);
    if (scriptureMatch) {
      current.scripture = paragraph.replace(current.name + "：", "")
    }
    if (lineMatch) {
      current.lines.push({
        ...parseYaoName(lineMatch[1]),
        name: lineMatch[1],
        scripture: lineMatch[2],
      })
      if (parseYaoName(lineMatch[1]).id == 6)
        current.array = current.lines.map((l) => l.type)
    }
    if (isWenyan) {
      zhuan.wen[`iching__${current.id}`] += "\n" + paragraph
      continue
    }
    if (zhuanMatch) {
      if (zhuanMatch[1] == "文言") {
        isWenyan = true
        zhuan.wen[`iching__${current.id}`] = zhuanMatch[2]
        continue
      }

      if (current.lines.length == 0) {
        if (zhuanMatch[1] == "序卦") {
          zhuanMatch[2] = zhuanMatch[2].slice(1, -1)
        }
        zhuan[ZHUAN_ZH_EN_DICT[zhuanMatch[1]]][`iching__${current.id}`] =
          zhuanMatch[2]
      } else {
        zhuan[ZHUAN_ZH_EN_DICT[zhuanMatch[1]]][
          `iching__${current.id}_${current.lines.length}`
        ] = zhuanMatch[2]
      }
    }

    continue
  }
}

const save = (str, name) => {
  fs.writeFileSync("./" + name, str)
}
const saveJson = (obj, name) => {
  console.log(obj)
  fs.writeFileSync("./" + name + ".json", JSON.stringify(obj, false, 2))
}
for (let z in zhuan) {
  let html = "<root>\n"
  for (let k in zhuan[z]) {
    html += `<span class="${k}">${zhuan[z][k].replaceAll(
      "\n",
      "<br>"
    )}</span><br>\n`
  }
  html += "</root>"
  save(html, z + ".html")
}
// save(data, "iching_with_xiang")
saveJson(data, "iching")
saveJson(zhuan.wen, "wen")
saveJson(zhuan.xu, "xu")
saveJson(zhuan.tuan, "tuan")
saveJson(zhuan.xiang, "xiang")
