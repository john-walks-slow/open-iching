const fs = require("fs");
let xhtml = fs.readFileSync("./source.xhtml");
let lines = xhtml.toString().split("\n");

const LINE_ORDER_FORMATS = ["初_", "_二", "_三", "_四", "_五", "上_", "用_"];
const LINE_NAMES = ["九", "六"];
const LINE_HEADERS = LINE_ORDER_FORMATS.map((o) =>
  LINE_NAMES.map((l) => `${o.replaceAll("_", l)}`)
).flat();
const LINE_HEADERS_REGEX = new RegExp(
  "^(" + LINE_HEADERS.join("|") + ")(?:：|，)(.*)"
);
const parseYaoName = (name) => {
  let order, type;
  for (f of LINE_ORDER_FORMATS) {
    let typePos = f.indexOf("_");
    let orderPos = 1 - typePos;
    if (name[orderPos] == f[orderPos]) {
      order = LINE_ORDER_FORMATS.indexOf(f);
      type = name[typePos] == "九" ? 1 : 0;
      return { id: order + 1, type };
    }
  }
};
const generateYaoName = (order, type) => {
  return LINE_ORDER_FORMATS[order - 1].replaceAll("_", LINE_NAMES(type));
};
const ZHUAN_HEADERS = ["彖", "象", "文言", "序卦"];
const ZHUAN_DICT = {
  彖: "tuan",
  象: "xiang",
  文言: "wenyan",
  序卦: "xugua",
};
const GUA_DICT = {
  999: "乾",
  699: "巽",
  696: "坎",
  669: "艮",
  666: "坤",
  966: "震",
  969: "离",
  996: "兑",
};
const ZHUAN_HEADER_TO_KEY = (h) => ZHUAN_DICT[h];
const ZHUAN_HEADERS_REGEX = new RegExp(
  "^《(" + ZHUAN_HEADERS.join("|") + ")》曰?：(.*)"
);

let data = [];
let dataWithoutComments = [];
let index = -1;
let isWenyan = false;
let rareChars = {};
for (let line of lines) {
  let rareCharMatch = line.match(
    /<img class="kindle-cn-inline-character" alt="(.)" src="(\S*)"\/>/
  );
  if (rareCharMatch?.[2]) {
    rareChars[rareCharMatch[1]] = rareCharMatch[2];
    line = line.replace(
      /<img class="kindle-cn-inline-character" alt="(.)" src="(\S*)"\/>/,
      "$1"
    );
  }
  let gua = line.match(/<\/a>\d+．(.*)卦.*<\/h2>/)?.[1];
  let paragraph = line.match(/<p>(.*)<\/p>/)?.[1];
  if (gua) {
    index++;
    isWenyan = false;
    data[index] = {
      id: index + 1,
      name: gua,
      symbol: String.fromCharCode(parseInt(19904 + index, 16)),
      array: [],
      combination: [],
      jing: "",
      lines: [],
    };
    continue;
  }
  let combination = line.match(
    /<p class="kindle-cn-picture-txt-withfewcharactors">(.)下(.)上<\/p><\/div>/
  );
  if (combination?.[2]) {
    data[index].combination = [combination[1], combination[2]];
    continue;
  }
  if (paragraph) {
    if (isWenyan) {
      data[index].wenyan += "\n" + paragraph;
      continue;
    }
    let jingMatch = paragraph.startsWith(data[index].name + "：", "");
    let lineMatch = paragraph.match(LINE_HEADERS_REGEX);
    let zhuanMatch = paragraph.match(ZHUAN_HEADERS_REGEX);
    // console.log(paragraph);
    if (jingMatch) {
      data[index].jing = paragraph.replace(data[index].name + "：", "");
    }
    if (lineMatch) {
      data[index].lines.push({
        ...parseYaoName(lineMatch[1]),
        name: lineMatch[1],
        jing: lineMatch[2],
      });
      if (parseYaoName(lineMatch[1]).id == 6)
        data[index].array = data[index].lines.map((l) => l.type);
    }
    if (zhuanMatch) {
      if (zhuanMatch[1] == "文言") {
        isWenyan = true;
        data[index].wenyan = zhuanMatch[2];
        continue;
      }
      if (data[index].lines.length == 0) {
        if (zhuanMatch[1] == "序卦") {
          zhuanMatch[2] = zhuanMatch[2].slice(1, -1);
        }
        data[index][ZHUAN_HEADER_TO_KEY(zhuanMatch[1])] = zhuanMatch[2];
      } else {
        data[index].lines[data[index].lines.length - 1][
          ZHUAN_HEADER_TO_KEY(zhuanMatch[1])
        ] = zhuanMatch[2];
      }
    }

    continue;
  }
}
let resultString = JSON.stringify(data, true, 2);
console.log(resultString);
console.log(rareChars);
fs.writeFileSync("./result.json", resultString);
