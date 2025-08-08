# 幻想动物画廊系统
## 总管理员 pinkcandyzhou
项目地址 [幻想动物画廊](https://gallery.pinkcandy.top)

### 描述
欢迎访问粉糖画廊系统代码仓库，这是本网站站长小蓝狗❄️创建的开源项目；<br>
本项目为幻想动物画廊的后端，见[幻想动物画廊](https://github.com/ZhouZhou1235/pinkcandy-gallery)；<br>

**正在运行第二版**

- 第二版 Node.js Express 
- 第一版 PHP

### 幻想动物画廊接口
前端异步请求 后端响应返回  
请求规范：获取数据使用get 提交表单或执行操作使用post  
响应规范：json/string/html/文件/... 成功1 失败0  
host = http://gallery-system.pinkcandy.top  

| 方法 | URL | 参数 | 返回 | 说明 |
|------|-------------------------------|--------------------------------|----------------|--------------------------------|
| get  | /                             | null                           | HTML字符串     | 服务状态检查                   |
| get  | /files/gallery/:filename       | filename: 文件名               | 图片文件       | 获取作品原图                   |
| get  | /files/headimage/:filename     | filename: 文件名               | 图片文件       | 获取用户头像                   |
| get  | /files/garden/:filename        | filename: 文件名               | 图片文件       | 获取盆栽图片                   |
| post | /core/checkLogin              | null                           | 1/0            | 检查登录状态                   |
| post | /core/login                   | username, password             | 1/0            | 用户登录                       |
| post | /core/logout                  | null                           | 1              | 用户登出                       |
| get  | /core/getUser/:username        | username: 用户名               | 用户对象       | 获取用户公开信息               |
| get  | /core/getSessionUser          | null                           | 用户对象       | 获取当前登录用户信息           |
| post | /core/uploadArtwork           | file, title, info, tags        | 1/0            | 上传艺术作品                   |
| get  | /core/getArtworks             | [begin, num, username]         | 作品数组       | 获取作品列表                   |
| get  | /core/getArtwork              | id: 作品ID                     | 作品对象       | 获取单个作品详情               |
| get  | /core/getTagsArtwork/:id       | id: 作品ID                     | 标签数组       | 获取作品关联标签               |
| post | /core/editArtwork             | id, title, info, tags          | 1/0            | 编辑作品信息                   |
| post | /core/deleteArtwork           | id: 作品ID                     | 1/0            | 删除作品                       |
| get  | /core/getPlantpots            | [begin, num, username]         | 盆栽数组       | 获取盆栽列表                   |
| get  | /core/getPlantpot             | id: 盆栽ID                     | 盆栽对象       | 获取单个盆栽详情               |
| post | /core/createPlantpot          | title, content, [file], tags   | 1/0            | 创建新盆栽                     |
| post | /core/editPlantpot            | id, title, content, tags       | 1/0            | 编辑盆栽内容                   |
| post | /core/deletePlantpot          | id: 盆栽ID                     | 1/0            | 删除盆栽                       |
| post | /core/sendCommentArtwork      | id, content                    | 1/0            | 发表作品评论                   |
| post | /core/sendCommentPlantpot     | id, content, [file]            | 1/0            | 发表盆栽评论（生长叶子）       |
| post | /core/pawArtworkMedia         | id, [commentid]                | 1/0            | 点赞/取消点赞作品或评论        |
| post | /core/starArtworkMedia        | id                             | 1/0            | 收藏/取消收藏作品              |
| get  | /core/getUserWatch            | username                       | {watcher,towatch}| 获取用户的关注和粉丝列表       |
| post | /core/watchUser               | towatch: 目标用户名            | 1/0            | 关注/取消关注用户              |
| get  | /core/searchPinkCandy         | searchtext: 搜索文本           | 综合结果       | 全站搜索（作品/盆栽/用户）     |
| post | /core/register                | code, username, password, name, email | 1/0 | 注册新账号       |
| post | /core/resetPassword           | email, code, newPassword       | 1/0            | 重置密码                       |

#### 特殊功能接口
| 方法 | URL                          | 参数               | 返回  | 说明                          |
|------|------------------------------|--------------------|-------|-------------------------------|
| get  | /core/getNoticenum           | username           | 数字  | 获取未读通知数量              |
| post | /core/noticeFinishRead       | null               | 1     | 标记所有通知为已读            |
| get  | /core/getTrendnum            | username           | 数字  | 获取未读动态数量              |
| post | /core/trendFinishRead        | null               | 1     | 标记所有动态为已读            |

#### 状态码说明
- `1`: 操作成功
- `0`: 操作失败或参数错误
- 文件类接口直接返回文件流

> 注：所有需要认证的接口需携带有效的session cookie  
> 方括号[]表示可选参数
