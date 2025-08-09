# 幻想动物画廊系统
## 总管理员 pinkcandyzhou
项目地址 [幻想动物画廊](https://gallery.pinkcandy.top)


### 描述
欢迎访问粉糖画廊系统代码仓库，这是本网站站长小蓝狗❄️创建的开源项目；<br>
本项目为幻想动物画廊的后端，见[幻想动物画廊](https://github.com/ZhouZhou1235/pinkcandy-gallery)；<br>

**正在运行第二版**

- 第二版 Node.js Express 
- 第一版 PHP


### 幻想动物画廊接口（部分获取相关api）

- 请求方式：GET
- 响应格式：JSON（特殊标注除外）
- 基础路径：`http://gallery-system.pinkcandy.top`

| 方法 | URL                          | 参数                     | 返回数据               | 说明                     |
|------|------------------------------|--------------------------|------------------------|--------------------------|
| GET  | /files/gallery/:filename     | filename: 文件名         | 图片文件               | 获取作品原图             |
| GET  | /files/headimage/:filename   | filename: 文件名         | 图片文件               | 获取用户头像             |
| GET  | /files/garden/:filename      | filename: 文件名         | 图片文件               | 获取盆栽图片             |
| GET  | /core/getUser/:username      | username: 用户名         | 用户公开信息对象       | 获取用户资料             |
| GET  | /core/getArtworks            | [begin, num, username]   | 作品数组               | 分页获取作品列表         |
| GET  | /core/getArtwork             | id: 作品ID               | 作品详情对象           | 获取单个作品完整信息     |
| GET  | /core/getTagsArtwork/:id     | id: 作品ID               | 标签数组               | 获取作品关联标签         |
| GET  | /core/getPlantpots           | [begin, num, username]   | 盆栽数组               | 分页获取盆栽列表         |
| GET  | /core/getPlantpot            | id: 盆栽ID               | 盆栽详情对象           | 获取单个盆栽完整信息     |
| GET  | /core/getUserWatch           | username                 | {watchers, following}  | 获取用户社交关系         |
| GET  | /core/searchPinkCandy        | searchtext: 关键词       | {artworks,plantpots,users} | 全站搜索               |
| GET  | /core/getNoticenum           | username                | 未读通知数            | 获取消息提醒数量         |
| GET  | /core/getTrendnum            | username                | 未读动态数            | 获取动态更新数量         |

