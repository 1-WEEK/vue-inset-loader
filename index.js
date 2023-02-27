const { parseComponent } = require("vue-template-compiler");
const {
  generateHtmlCode,
  generateLabelCode,
  generateStyleCode,
  getPagesMap,
  initPages,
  getRoute,
  replaceByPosition,
} = require("./utils");

// 是否初始化过
let _init = false;
// 是否需要做处理
let needHandle = false;
// 路由和配置的映射关系
let pagesMap = {};

module.exports = function (content) {
  let newContent = content;

  if (!_init) {
    _init = true;
    init(this);
  }

  // 配置无效不予处理
  if (!needHandle) {
    return content;
  }

  // 获取当前文件的小程序路由
  const route = getRoute(this.resourcePath);
  // 根据路由并找到对应配置
  const curPage = pagesMap[route];
  if (curPage) {
    // 解析sfc
    const compiler = parseComponent(newContent);

    // 在匹配的标签之前插入额外标签代码
    let templateCode = `<${curPage.ele}>${compiler.template.content}</${curPage.ele}>`;

    // 确保 page-meta 是根节点
    const rootBlock = parseComponent(compiler.template.content)
      ?.customBlocks?.[0];
    if (rootBlock?.type === "page-meta") {
      templateCode = replaceByPosition(
        compiler.template.content,
        `<${curPage.ele}>${rootBlock.content}</${curPage.ele}>`,
        rootBlock.start,
        rootBlock.end
      );
    }

    // 替换新的 template
    newContent = replaceByPosition(
      newContent,
      `
    ${templateCode}
`,
      compiler.template.start,
      compiler.template.end
    );
  }
  return newContent;
};

function init(that) {
  const isWx = process.env.VUE_APP_PLATFORM == "mp-weixin";
  // 首次需要对pages配置文件做解析，并判断是否为有效配置
  // 非小程序环境或无效配置不予处理
  needHandle = isWx && initPages(that);
  // 转换为路由和配置的映射对象
  needHandle && (pagesMap = getPagesMap());
}
