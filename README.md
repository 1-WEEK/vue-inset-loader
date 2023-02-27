# vue-inset-loader

仅支持 HTML 类型的 template

#### 编译阶段在 sfc 模板指定位置插入自定义内容，适用于 webpack 构建的 vue 应用，常用于小程序需要全局引入组件的场景。（由于小程序没有开放根标签，没有办法在根标签下追加全局标签，所以要使用组件必须在当前页面引入组件标签）

### 第一步 安装

    npm install vue-inset-loader --save-dev

### 第二步 vue.config.js 注入 loader

    module: {
        rules: [
          {
            test: /\.vue$/,
            use:{
                loader: "vue-inset-loader"
                // // 针对Hbuilder工具创建的uni-app项目
                // loader: path.resolve(__dirname,"./node_modules/vue-inset-loader")
                // // 支持自定义pages.json文件路径
                // options: {
                //     pagesPath: path.resolve(__dirname,'./src/pages.json')
                // }
            }
          }
        ]
    },

### 第三步 pages.json 配置文件中添加 insetLoader

    "insetLoader": {
        "rootEle":"div"
    },
    "pages": [
        {
            "path": "pages/tabbar/index/index",
            "style": {
                "navigationBarTitleText": "测试页面",
                // 单独配置，用法跟全局配置一致，优先级高于全局
                "rootEle":"div"
            }
        },
    ]

### 配置说明

- `rootEle`(default: `"div"`)
  根元素的标签类型，缺省值为 div

✔ `rootEle` 支持在单独页面的 style 里配置，优先级高于全局配置
