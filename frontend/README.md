## 前端开发文档

> 务必将目录切换到`frontend/`

### scripts

``` shell
# 启动
yarn start

# 打包
yarn build
```

### 目录结构

```
.
├── README.md
├── config
├── jsconfig.json
├── package.json
├── public
├── scripts
├── src
│   ├── components
│   ├── index.js
│   ├── layout
│   ├── pages
│   ├── router
│   ├── serviceWorker.js
│   ├── setupProxy.js
│   ├── setupTests.js
│   ├── services
│   ├── style
│   └── utils
└── yarn.lock
```

#### `src`目录：
- components: 公共组件
- layout：页面布局组件，菜单在这里修改
- pages： 页面级组件，在router中引入
- router/index： 路由配置
- services: axios请求实例；集成API
- style: 全局样式
- utils：工具函数库

### 添加边框等样式

参见[data-view-react](http://datav-react.jiaminghi.com/guide/)文档

### 图表库

`echarts`

`d3`

### 样式文件

`.less`会被`cssModule`转换，需要全局引用的的类需要包裹`:global`

``` less
:global {
    .classname1 {
        // ...
    }
}
```

> 需要其他库使用`yarn add xx`安装即可

