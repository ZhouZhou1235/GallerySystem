# 幻想动物画廊系统
## 总管理员 pinkcandyzhou
项目地址 [幻想动物画廊](https://gallery.pinkcandy.top)

### 描述
欢迎访问粉糖画廊系统代码仓库，这是本网站站长小蓝狗❄️创建的开源项目；<br>
本项目为幻想动物画廊的后端，见[幻想动物画廊](https://github.com/ZhouZhou1235/pinkcandy-gallery)；<br>

**正在运行第二版**
第一版计划废弃

- 第二版 Node.js Express 
- 第一版 PHP

------

### 幻想动物画廊接口
前端异步请求 后端响应返回
请求规范：获取数据使用get 提交表单或执行操作使用post
响应规范：json/string/html/文件/... 成功1 失败0
host = http://gallery-system.pinkcandy.top
| 方法 | URL | 参数 | 说明 | 返回 |
|-----|-----|-----|-----|-----|
| get | / | null | 欢迎 | string |
| post | / | null | post测试 | string |
| get | /core/getUser/:username | username | 获取用户 | {...} |
| get | /core/getArtwork | id | 获取一个作品 | {...} |
| get | /core/getArtworks | begin,num,username | 获取作品 | {...} |
| get | /core/getTags | begin,num | 获取标签 | {...} |
| get | /core/searchPinkCandy | searchtext | 来点粉糖 | {...} |
| - | - | - | - | - |

接口请求样例
```
# 接口请求测试

import requests
import json

host = "http://gallery-system.pinkcandy.top"

# 获取用户10002
res = requests.get(host+"/core/getUser/10002")
print(json.dumps(json.loads(res.text),indent=4))

# 获取作品 id=gallery7000756624
res = requests.get(host+"/core/getArtwork/?id=gallery7000756624")
print(json.dumps(json.loads(res.text),indent=4))

# 获取用户10002的最近3个作品
res = requests.get(host+"/core/getArtworks/?begin=0&num=3&username=10002")
print(json.dumps(json.loads(res.text),indent=4))

# 默认获取最近的作品
res = requests.get(host+"/core/getArtworks")
print(json.dumps(json.loads(res.text),indent=4))

# 默认获取最近的标签
res = requests.get(host+"/core/getTags")
print(json.dumps(json.loads(res.text),indent=4))

# 来点粉糖 搜索关键字“小蓝狗、白白、煎饼”
searchtext = '小蓝狗 白白 煎饼'
res = requests.get(host+f"/core/searchPinkCandy?searchtext={searchtext}")
print(json.dumps(json.loads(res.text),indent=4))
# 来点粉糖对搜索粉糖画廊全站资源 返回的数据包格式如下 {...}
# {
#     artwork: [{
#         id: '',
#         username: '',
#         filename: '',
#         title: '',
#         info: '',
#         time: '',
#     }],
#     plantpot: [{
#         id: '',
#         username: '',
#         filename: '',
#         title: '',
#         content: '',
#         createtime: '',
#         updatetime: '',
#     }],
#     user: [{
#         username: '',
#         name: '',
#         jointime: '',
#         info: '',
#         headimage: '',
#         backimage: '',
#         sex: '',
#         species: '',
#     }],
# }
```

### 粉糖主站的接口请求示例（计划废弃）
```
import requests
import json

api = "https://pinkcandy.top/website/gallery/api.php"

# 获取粉糖用户
res1 = requests.get(api+"?action=getUser&username=10002")

# 根据号码获取画廊
res2 = requests.get(api+"?action=getGalleryByID&galleryID=gallery1989595568")

# 随机获得一个画廊
res3 = requests.get(api+"?action=randomGetGallery")

# 获取多个画廊
res4 = requests.post(api,data={
    "action":"getGalleries",
    "data":json.dumps({
        "num":5,
        "order":1,
    }),
})

# 获取标签
res5 = requests.post(api,data={
    "action":"getTags",
    "data":json.dumps({
        "num":10,
        "order":3,
        "tag":"伊布",
    }),
})

# 搜索画廊
res6 = requests.post(api,data={
    "action":"searchGallery",
    "text":"小蓝狗 白白",
    "strict":0,
})

print(json.loads(res1.text))
print(json.loads(res2.text))
print(json.loads(res3.text))
print(json.loads(res4.text))
print(json.loads(res5.text))
print(json.loads(res6.text))
```

### 第一版系统接口说明（已废弃）
```
    /**
    * ## coreEntry 请求入口
    * ### 幻想动物画廊请求标准
    * - 前端程序通信接口API与此对接
    * - 通过发送POST或GET请求 并按操作表给出action和todo
    * - action 动作 todo 操作数
    * #### ECHO 流程处理机 回应 数据包json 或 命令数字number
    * ### 操作表
    * #### 1 WebEntry 网站入口
    * - 1登录 2注册 3获取重置验证码 4重置密码 5退出登录
    * #### 2 WebAdder 添加
    * - 1上传画廊 2种植盆栽 3添加标签 4添加评论/盆栽叶
    * - 5印爪 6收藏 7添加盆栽叶回复 8关注小兽 9在留言板写下一条留言
    * #### 3 WebPresenter 展示主持
    * - 1给出画廊数据包 2给出盆栽数据包 3给出小兽用户数据包
    * - 4给出标签标记数据包 5给出评论/盆栽叶数据包 6给出小兽收藏数据包
    * - 7给出小兽消息数据包 8给出搜索结果数据包 9给出留言板数据包
    * - 10给出标签数据包 11回复画廊概况数据
    * #### 4 WebModification 修改
    * - 1修改小兽用户信息 2撕下标签 3修改媒体基本信息 4删除画廊 5删除盆栽
    * - 6修改标签
    * #### 5 WebSimpleReply 简单回复
    * - 1回复小兽是否印爪 2回复小兽是否收藏 3回复小兽是否关注 4回复小兽是否登录
    */
```
