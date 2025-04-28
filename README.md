# 幻想动物画廊系统
## 开发者 pinkcandyzhou
项目地址 [幻想动物画廊](https://gallery.pinkcandy.top)

**正在运行第一版**

- 第二版（开发中） Node.js Express 
- 第一版 纯PHP

------

## 幻想动物画廊接口
（开发中 还未上线）
| 方法 | URL | 参数 | 说明 |
|-----|----------|----------|----------|
| get | / | null | 欢迎 |
| post | / | null | post测试 |
......

## 粉糖主站的接口请求示例（计划废弃）
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

## 第一版系统接口说明
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
