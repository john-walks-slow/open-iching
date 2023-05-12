import iching from "../../json/iching.json" assert { type: "json" }
import tuan from "../../json/tuan.json" assert { type: "json" }
import wen from "../../json/wen.json" assert { type: "json" }
import xiang from "../../json/xiang.json" assert { type: "json" }
import xu from "../../json/xu.json" assert { type: "json" }
import zhuan_dict from "../../json/zhuan_dict.json" assert { type: "json" }
import fs from "fs"

const zhuan_data = {
  tuan,
  wen,
  xu,
  xiang,
}

const save = (str, name) => {
  console.log(str)
  fs.writeFileSync("./" + name, str)
}
let quote = (c) => {
  return c
    .split("\n")
    .map((line) => "> " + line)
    .join("\n>\n")
}

let code = (c) => {
  return "```\n" + c + "\n```"
}

let indent = (str) => {
  if (str.length >= 3) return ""
  if (str.length == 2) {
    return "&nbsp;&nbsp; "
  }
  if (str.length == 1) {
    return "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "
  }
}
let cleanTemplate = (n, c) => `${c}\n\n`
let simpleTemplate = (n, c) => `${n}${indent(n)}${c}\n\n`
let simpleBoldTemplate = (n, c) => `**${n}**${indent(n)}${c}\n\n`
let tagTemplate = (n, c) => `\`${n}: \`${indent(n + 1)}${c}\n\n`
let tagBoldTemplate = (n, c) => `**\`${n}\`**${indent(n)}${c}\n\n`
let quoteTemplate = (n, c) => `${quote(`**${n}：**${c}`)}\n\n`
let collapseTemplate = (n, c) =>
  `<details><summary>\n展开《${n}》\n</summary>\n${c}\n</details>\n\n`

function generateMd(enabledZhuans) {
  let str = `# 周易\n\n`
  enabledZhuans.length > 0 &&
    (str += `\`\`\`\n 包含易传：${enabledZhuans
      .map((z) => zhuan_dict[z].name)
      .join("，")}\n\`\`\`\n\n<br>\n\n`)
  function addZhuan(z, id, template = simpleTemplate) {
    if (enabledZhuans.includes(z)) {
      let name = zhuan_dict[z].name
      let content = zhuan_data[z][id]
      if (content) {
        str += template(name, content)
      }
    }
  }
  /*   function addZhuanCollapseGroup(zs) {
    let enabledZs = zs.filter(
      (z) => enabledZhuans.includes(z) && zhuan_data[z][`#${o.id}`]
    )
    if (enabledZs.length == 0) return
    str += `<details><summary>\n\n\`展开${enabledZs
      .map((z) => "《" + zhuan_dict[z].name + "》")
      .join("")}\`\n\n</summary>\n\n`
    for (let z of enabledZs) {
      addZhuan(z, cleanTemplate)
    }
    str += `\n\n<br>\n\n</details>\n`
  } */
  let hex
  for (hex of iching) {
    str += `## ${hex.id}. ${hex.name} ${hex.symbol}\n\n`
    str += simpleBoldTemplate(hex.name, hex.scripture)
    addZhuan("xu", `iching__${hex.id}`, tagTemplate)
    addZhuan("tuan", `iching__${hex.id}`, tagTemplate)
    addZhuan("xiang", `iching__${hex.id}`, tagTemplate)
    str += "<br>\n\n"
    for (let l of hex.lines) {
      str += simpleBoldTemplate(l.name, l.scripture)
      addZhuan("xiang", `iching__${hex.id}_${l.id}`, tagTemplate)
    }
    addZhuan("wen", `iching__${hex.id}`, collapseTemplate)
    str += "<br>\n\n"
  }
  // zhuan.forEach((z) => {
  //   let content = zhuan_data[z][`#${o.id}`]
  //   if (content) {
  //     str += `**《${zhuan_dict[z].name}》曰：** ${content}\n`
  //   }
  // })

  // str = str.replaceAll("\n", "\n\n")
  save(
    str,
    `易经${enabledZhuans.map((z) => "_" + zhuan_dict[z].name).join("")}.md`
  )
}
generateMd(["tuan", "xiang", "wen", "xu"])
generateMd([])
