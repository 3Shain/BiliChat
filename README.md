# Comen

[![AGPL License](https://img.shields.io/badge/AGPL-Licensed-blue)](https://github.com/3Shain/Comen/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

**当前仍在活跃开发中，代码结构可能尚未稳定，并行开发请注意代码的破坏更新** , 原项目【bilichat】请查看[bilichat](https://github.com/3Shain/Comen/tree/bilichat)分支

### 贡献代码

本项目主要技术栈为前端Angular+后端Nestjs,即完全使用TypeScript(JavaScript)实现。

本项目使用到了nx workspace作为管理代码的工具。本项目是一个monorepo的结构，所以任何本项目开源的部分都能在此仓库找到。

**代码结构**
```
- apps
    - core    --- 前端项目
    - node-backend    --- 后端的node(cli)包装
    - electron-app    --- electron应用
- libs
    - backend-core    --- 后端的可嵌入式实现
    - common          --- 公共代码库
    - delta           --- 高可自定义评论栏渲染器(React)
    - dogfood         --- [kairo](https://github/3shain/kairo) 内部消化测试
    - editor          --- 样式编辑器(Angular)
    - gamma           --- 兼容Youtube样式表的评论栏渲染器(Angular)
    - isomorphic-danmaku            --- 同构弹幕，实现了acfun、bilibili的ws连接
    - isomprphic-danmaku-server     --- 同构弹幕，服务端only部分
```

**调试运行**
拉取仓库后，首先安装项目依赖
```sh
npm install
```

然后分别打开前端与后端的dev-server
```
nx serve core
nx serve node-backend
```

现在可以对代码进行更改了。任何有关代码更改都会触发自动刷新。

### License

```
Copyright (c) 2021 3Shain.
All rights reserved.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
```