# 开放易经易传 Open I' Ching

> :warning: 施工中  

> :sparkles: **《易经》** 是古代中国巫师用于推演未来吉凶祸福的卜筮书，它的中心思想是用阴阳符号构成的卦象代表世间万物的运行状态。《易》据说有三种：连山、归藏和周易，合称三易。仅《周易》传至后世。
> 
> 传说，伏羲创八卦，夏禹将其扩充为六十四卦，周文王奠定了周易卦序并写下“卦辞”，周文王之子周公旦作“爻辞”。
> 
> **《易传》** 是学者对《经》的注解。
> 
> 见： <https://zh.wikipedia.org/wiki/%E6%98%93%E7%BB%8F>

## 1. 目标

- 易经的结构化数据
  - `象数`、`卦辞`、`爻辞`
- 易传的结构化数据
  - 十翼：`彖`、`象`、`文言`、`说卦`、`系辞`、`序卦`、`杂卦`
  - 后学和当代评注
  - 可扩展
- 译本的结构化数据（现代汉语、外语）
- 工具类
- 前端
  - 对比不同易传
  - 提供字典功能

## 2. 项目结构

```bash
- iching # 易经与象数的结构化数据
| - iching.json # 易经
| - array-name_dict.json # 象数-卦名词典
| - array-symbol_dict.json # 象数-卦符词典
| - order_dict.json # 卦序词典

- ichuan # 易传的结构化数据
| - xu.json # 序卦的段落id-评注词典，非阅读顺序，不包含非评注内容
| - xu.html # 序卦HTML，包含非评注内容

- md # markdown 格式，便于直接阅读

- scripts # javascript 工具
| - utils # 工具
| - crawler # 数据爬虫
| - md_generator # md格式生成
```

## 3. 数据格式参考

### 3.1 易经

`iching.json`

```JSON
[
  {
    "id": 1,
    "name": "乾", // 卦名
    "symbol": "䷀", // 卦象
    "array": [1, 1, 1, 1, 1, 1], // 1 为阳爻，0 为阴爻
    "combination": ["乾", "乾"], // 主卦，客卦
    "scripture": "元亨利贞。", // 卦辞
    "lines": [
      {
        "id": 1, // 第一爻
        "type": 1, // 1 为阳爻，0 为阴爻 
        "name": "初九", // 爻名
        "scripture": "潜龙，勿用。", // 爻辞
      },
      ...
    ]
  },
  ...
]
  
```

### 3.2 易传

> 用 `iching__卦_爻-翼` 的格式标识评注的对象，如 `iching__1_1-tuan` 表示《乾》卦第一爻的彖传。

#### 3.2.1 JSON

`xiang.json` （象传）

```JSON
{
  "#1": "天行健，君子以自强不息。", // 对应第一卦卦辞
  "#1.1": "“潜龙，勿用”，阳在下也。" // 对应第一卦第一爻爻辞
  ...
}
```

`dongpo.json`（东坡易传）

```JSON

{
  "#1.1": "「乾」之所以取於「龍」者，以其能飛能潛也...",
  ...
  "#1.1_xiang": "夫天，豈以「剛」故能「健」哉..." //对应第一卦第一爻象传
}
```

### 3.2.2 HTML

## 4. 易传列表

### 4.1 十翼

**《十翼》** 即孔子所作的十篇传（有观点认为是集体创作），受到历来学者的重视。

| 名称 | id    | 备注                               |
| ---- | ----- | ---------------------------------- |
| 彖传 | tuan  | 解释卦辞。着眼天地。               |
| 象传 | xiang | 解释卦辞。着眼在人。               |
| 文言 | wen   | 述说《乾》、《坤》之德。           |
| 说卦 | shuo  | 述说《易》的大要及八卦的象征。     |
| 序卦 | xu    | 描写六十四卦次序中的因由。         |
| 杂卦 | za    | 两卦为一组，概括卦意。             |
| 系辞 | ji    | “系”于《易》之后的心得，分为上下。 |

### 4.2 后学易传和当代评注

## 5. 现代汉语及外语译本

## 6. 版权声明

数据采集自互联网，仅供学习交流使用，不得用于商业用途。