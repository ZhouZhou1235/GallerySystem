// 控制器

import express from 'express';
import { Board, Gallery, GalleryComment, GalleryPaw, GalleryStar, Garden, GardenComment, GardenCommentReply, GardenPaw, GardenStar, Tag, TagGallery, TagGarden, User, UserWatch } from './database/models.js';
import { checkObjComplete, comparePasswordHash, compressImage, createPasswordHash, getExtension, isEqualObj, modelListToObjList } from './utils.js';
import { getDBRecordCount } from './work.js';
import config from '../config.js';
import sqllize from './database/orm_sequelize.js';
import { sendAMail } from './mailer.js';
import fs from 'fs';
import { console } from 'inspector';
import { GArea } from './ConstVars.js';

// 访问规则表
const routeTable = { 
    root: '/',
    files_gallery: '/files/gallery/:filename',
    files_headimage: '/files/headimage/:filename',
    files_backimage: '/files/backimage/:filename',
    files_galleryPreview: '/files/GalleryPreview/:filename',
    files_garden: '/files/garden/:filename',
    checkLogin: '/core/checkLogin',
    getUser: '/core/getUser/:username',
    getSessionUser: '/core/getSessionUser',
    login: '/core/login',
    logout: '/core/logout',
    uploadArtwork: '/core/uploadArtwork',
    getArtworks: '/core/getArtworks',
    getTags: '/core/getTags',
    getRegisterCode: '/core/getRegisterCode',
    register: '/core/register',
    getResetPasswordCode: '/core/getResetPasswordCode',
    resetPassword: '/core/resetPassword',
    createPlantpot: '/core/createPlantpot',
    addBoardMessage: '/core/addBoardMessage',
    getBoradMessages: '/core/getBoradMessages',
    getTopInfo: '/core/getTopInfo',
    getDBRecordCount: '/core/getDBRecordCount',
    getArtwork: '/core/getArtwork',
    editUser: '/core/editUser',
    editUserImage: '/core/editUserImage',
    getEditUserImportantCode: '/core/getEditUserImportantCode',
    editUserImportant: '/core/editUserImportant',
    clearUserImage: '/core/clearUserImage',
    getTagsArtwork: '/core/getTagsArtwork/:id',
    sendCommentArtwork: '/core/sendCommentArtwork',
    getArtworkComments: '/core/getArtworkComments',
    getCommentGalleryCount: '/core/getCommentGalleryCount',
    pawArtworkMedia: '/core/pawArtworkMedia',
    starArtworkMedia: '/core/starArtworkMedia',
    getArtworkPawAreaInfo: '/core/getArtworkPawAreaInfo',
    haveWatch: '/core/haveWatch',
    watchUser: '/core/watchUser',
    getUserInfoCount: '/core/getUserInfoCount',
    getPlantpots: '/core/getPlantpots',
    getPlantpotComments: '/core/getPlantpotComments',
    getCommentGardenCount: '/core/getCommentGardenCount',
    pawPlantpotMedia: '/core/pawPlantpotMedia',
    sendPlantpotCommentReply: '/core/sendPlantpotCommentReply',
    starPlantpotMedia: '/core/starPlantpotMedia',
    getPlantpotPawAreaInfo: '/core/getPlantpotPawAreaInfo',
};

// 加载控制器
export function loadMachineController(machine=express()){
    // 基本
    machine.get(routeTable.root,(req,res)=>{res.send('<h1>PINKCANDY: ok</h1>');});
    machine.post(routeTable.root,(req,res)=>{res.send('PINKCANDY: post ok');});
    machine.get(routeTable.files_gallery,(req,res)=>{
        let filename = req.params.filename;
        if(!filename){res.send(0);return;}
        let fileurl = config.FILE_fileHub.gallery+filename;
        res.sendFile(fileurl);
    });
    machine.get(routeTable.files_headimage,(req,res)=>{
        let filename = req.params.filename;
        if(!filename){res.send(0);return;}
        let fileurl = config.FILE_fileHub.headimage+filename;
        res.sendFile(fileurl);
    });
    machine.get(routeTable.files_backimage,(req,res)=>{
        let filename = req.params.filename;
        if(!filename){res.send(0);return;}
        let fileurl = config.FILE_fileHub.backimage+filename;
        res.sendFile(fileurl);
    });
    machine.get(routeTable.files_galleryPreview,(req,res)=>{
        let filename = req.params.filename;
        if(!filename){res.send(0);return;}
        let fileurl = config.FILE_fileHub.galleryPreview+filename;
        res.sendFile(fileurl);
    });
    machine.get(routeTable.files_garden,(req,res)=>{
        let filename = req.params.filename;
        if(!filename){res.send(0);return;}
        let fileurl = config.FILE_fileHub.garden+filename;
        res.sendFile(fileurl);
    });
    // GET
    machine.get(routeTable.getUser,(req,res)=>{ // 获取用户
        let username = req.params.username;if(!username){return 0;}
        User.findOne({where:{username:username}}).then(data=>{res.send(data);});
    });
    machine.get(routeTable.getSessionUser,(req,res)=>{ // 获取用户自己
        let username = req.session.username;if(!username){return 0;}
        User.findOne({where:{username:username}}).then(data=>{res.send(data);});
    });
    machine.get(routeTable.getArtworks,(req,res)=>{ // 获取作品
        let queryObj = req.query
        let begin = queryObj.begin
        let num = queryObj.num
        if(!begin){begin=0;}
        if(!num){num=config.DATABASE_defaultLimit;}
        (async ()=>{
            let data = await Gallery.findAll({limit:Number(num),offset:Number(begin),order:[['time','DESC']]});
            res.send(data);
        })()
    });
    machine.get(routeTable.getTags,(req,res)=>{ // 获取标签
        let queryObj = req.query
        let begin = queryObj.begin
        let num = queryObj.num
        if(!begin){begin=0;}
        if(!num){num=config.DATABASE_defaultLimit;}
        (async ()=>{
            let data = await Tag.findAll({limit:Number(num),offset:Number(begin),order:[['time','DESC']]});
            res.send(data)
        })()
    })
    machine.get(routeTable.getBoradMessages,(req,res)=>{ // 获取留言板信息
        let queryObj = req.query
        let begin = queryObj.begin
        let num = queryObj.num
        if(!begin){begin=0;}
        if(!num){num=config.DATABASE_defaultLimit;}
        (async ()=>{
            Board.belongsTo(User,{foreignKey:'username',targetKey:'username'});
            let data = await Board.findAll({
                limit:Number(num),
                offset:Number(begin),
                order:[['time','DESC']],
                include: [
                    {
                        model: User,
                        attributes: ['name'],
                    },
                ]
            });
            res.send(data);
        })();
    });
    machine.get(routeTable.getTopInfo,(req,res)=>{ // 获取首页置顶信息
        res.sendFile(config.FILE_staticURL+'/TopInfo.html');
    });
    machine.get(routeTable.getDBRecordCount,(req,res)=>{ // 获取数据库记录数
        let table = req.query.table;
        if(!table){res.send(0);return;}
        (async ()=>{
            let count = await getDBRecordCount(table);
            res.send(count);
        })()
    });
    machine.get(routeTable.getArtwork,(req,res)=>{ // 获取一个作品
        let id = req.query.id;
        if(!id){res.send(0);return;}
        (async ()=>{
            let data = await Gallery.findOne({where:{id:id}});
            res.send(data);
        })()
    });
    machine.get(routeTable.getTagsArtwork,(req,res)=>{ // 获取作品的标签
        let id = req.params.id;
        if(!id){res.send(0);return;}
        (async()=>{
            Tag.belongsTo(TagGallery,{foreignKey:'id',targetKey:'tagid'});
            try{
                let data = await Tag.findAll({
                    order:[['type','ASC']],
                    include: [
                        {
                            model: TagGallery,
                            attributes: ['galleryid'],
                            where:{galleryid:id},
                        },
                    ]
                });
                res.send(data);
            }
            catch(e){console.log(e);res.send(0);}
        })()
    });
    machine.get(routeTable.getArtworkComments,(req,res)=>{ // 获取作品评论
        let id = req.query.id;
        let begin = req.query.begin
        let num = req.query.num
        let username = req.session.username;
        if(!id){res.send(0);return;}
        if(!begin){begin=0;}
        if(!num){num=config.DATABASE_defaultLimit;}
        (async ()=>{
            GalleryComment.belongsTo(User,{foreignKey:'username',targetKey:'username'});
            try{
                let data = await GalleryComment.findAll({
                    where:{galleryid:id},
                    limit:Number(num),
                    offset:Number(begin),    
                    order:[['time','DESC']],
                    include: [
                        {
                            model: User,
                            attributes: ['username','name','headimage','sex','species'],
                        },
                    ],
                });
                let result = modelListToObjList(data);
                for(let i=0;i<result.length;i++){
                    let obj = result[i];
                    obj['pawnum'] = await GalleryPaw.count({where:{commentid:obj.id}});
                    obj['havepaw'] = false;
                    if(username){
                        obj['havepaw'] = await GalleryPaw.findOne({where:{galleryid:id,username:username,commentid:obj.id}})?true:false;
                    }
                }
                res.send(result);
            }
            catch(e){console.log(e);res.send(0);}
        })()
    })
    machine.get(routeTable.getCommentGalleryCount,(req,res)=>{ // 获取有关作品评论的数量
        let id = req.query.id;
        GalleryComment.count({where:{galleryid:id}}).then(count=>{res.send(count);});
    })
    machine.get(routeTable.getArtworkPawAreaInfo,(req,res)=>{ // 获取作品印爪空间情况
        let id = req.query.id;
        let username = req.session.username;
        if(!id){res.send(0);return;}
        (async ()=>{
            let result = {
                pawnum: await GalleryPaw.count({where:{galleryid:id}}),
                starnum: await GalleryStar.count({where:{galleryid:id}}),
                commentnum: await GalleryComment.count({where:{galleryid:id}}),
                user: {
                    havepaw: false,
                    havestar: false,
                }
            };
            if(username){
                result.user.havepaw = await GalleryPaw.findOne({where:{username:username,galleryid:id,commentid:null}})?true:false;
                result.user.havestar = await GalleryStar.findOne({where:{username:username,galleryid:id}})?true:false;
            }
            res.send(result);
        })()
    });
    machine.get(routeTable.getUserInfoCount,(req,res)=>{ // 获取用户概况数
        let username = req.query.username;
        if(!username){res.send(0);return;}
        (async ()=>{
            let result = {
                watchernum: await UserWatch.count({where:{username:username}}),
                towatchnum: await UserWatch.count({where:{watcher:username}}),
                medianum: await Gallery.count({where:{username:username}}),
                gotpawnum: await (async()=>{
                    // 复杂查询 获得的总印爪数
                    // todo 盆栽和叶子的印爪
                    let gotpawnum = 0;
                    let artworkList = await Gallery.findAll({where:{username:username}});
                    let artworkCommentList = await GalleryComment.findAll({where:{username:username}});
                    for(let i=0;i<artworkList.length;i++){
                        let galleryid = artworkList[i]['id'];
                        gotpawnum += await GalleryPaw.count({where:{galleryid:galleryid,commentid:null}});
                    }
                    for(let i=0;i<artworkCommentList.length;i++){
                        let gallerycommentid = artworkCommentList[i]['id'];
                        gotpawnum += await GalleryPaw.count({where:{commentid:gallerycommentid}});
                    }
                    return gotpawnum;
                })(),
            }
            res.send(result);
        })()
    });
    machine.get(routeTable.getPlantpots,(req,res)=>{ // 获取盆栽
        let begin = req.query.begin
        let num = req.query.num
        if(!begin){begin=0;}
        if(!num){num=config.DATABASE_defaultLimit;}
        (async ()=>{
            let data = await Garden.findAll({limit:Number(num),offset:Number(begin),order:[['updatetime','DESC']]});
            res.send(data);
        })()
    });
    machine.get(routeTable.getPlantpotComments,(req,res)=>{ // 获取盆栽叶子 包括叶纸条
        let id = req.query.id;
        let begin = req.query.begin
        let num = req.query.num
        let username = req.session.username;
        if(!id){res.send(0);return;}
        if(!begin){begin=0;}
        if(!num){num=config.DATABASE_defaultLimit;}
        (async ()=>{
            GardenComment.belongsTo(User,{foreignKey:'username',targetKey:'username'});
            try{
                let data = await GardenComment.findAll({
                    where:{gardenid:id},
                    limit:Number(num),
                    offset:Number(begin),    
                    order:[['time','DESC']],
                    include: [
                        {
                            model: User,
                            attributes: ['username','name','headimage','sex','species'],
                        },
                    ],
                });
                let result = modelListToObjList(data);
                for(let i=0;i<result.length;i++){
                    let obj = result[i];
                    obj['pawnum'] = await GardenPaw.count({where:{commentid:obj.id}});
                    obj['havepaw'] = false;
                    GardenCommentReply.belongsTo(User,{foreignKey:'username',targetKey:'username'});
                    obj['reply'] = await GardenCommentReply.findAll({
                        where:{commentid:obj.id},
                        order:[['time','DESC']],
                        include: [
                            {
                                model: User,
                                attributes: ['username','name','headimage','sex','species'],
                            }
                        ],
                    });
                    if(username){
                        obj['havepaw'] = await GardenPaw.findOne({where:{gardenid:id,username:username,commentid:obj.id}})?true:false;
                    }
                }
                res.send(result);
            }
            catch(e){console.log(e);res.send(0);}
        })()
    })
    machine.get(routeTable.getCommentGardenCount,(req,res)=>{ // 获取有关盆栽的叶子数量
        let id = req.query.id;
        GardenComment.count({where:{gardenid:id}}).then(count=>{res.send(count);});
    })
    machine.get(routeTable.getPlantpotPawAreaInfo,(req,res)=>{ // 获取盆栽印爪空间情况
        let id = req.query.id;
        let username = req.session.username;
        if(!id){res.send(0);return;}
        (async ()=>{
            let result = {
                pawnum: await GardenPaw.count({where:{gardenid:id}}),
                starnum: await GardenStar.count({where:{gardenid:id}}),
                commentnum: await GardenComment.count({where:{gardenid:id}}),
                user: {
                    havepaw: false,
                    havestar: false,
                }
            };
            if(username){
                result.user.havepaw = await GardenPaw.findOne({where:{username:username,gardenid:id,commentid:null}})?true:false;
                result.user.havestar = await GardenStar.findOne({where:{username:username,gardenid:id}})?true:false;
            }
            res.send(result);
        })()
    });
    // POST
    machine.post(routeTable.checkLogin,(req,res)=>{ // 检查登录
        if(req.session.username){res.send(1);}else{res.send(0);}
    });
    machine.post(routeTable.login,(req,res)=>{ // 登录
        let loginForm = req.body;
        if(!checkObjComplete(loginForm)){res.send(0);return;}
        let username = loginForm.username;
        let password = loginForm.password;
        User.findOne({where:{username:username}}).then(data=>{
            if(!data){res.send(0);return;}
            if(!comparePasswordHash(password,data.password)){res.send(0);return;}
            let session = req.session;
            session['username'] = data.username;
            res.send(1);
        });
    });
    machine.post(routeTable.logout,(req,res)=>{ // 退出登录
        req.session.destroy();
        res.send(1);
    });
    machine.post(routeTable.uploadArtwork,async(req,res)=>{ // 上传作品
        let artworkForm = req.body;
        let title = artworkForm.title;
        let info = artworkForm.info;
        let tags = artworkForm.tags;
        let file = req.files?.file;
        let id = Math.floor(Math.pow(10,10)*Math.random());
        let username = req.session.username;
        if(!title || !file || !username){res.send(0);return;}
        let ext = getExtension(file.name);
        if(!ext in config.FILE_imageAllowExtension){res.send(0);return;}
        let saveFilename = id+'.'+ext;
        let savepath = config.FILE_fileHub.gallery+saveFilename;
        try{
            // Sequelize 托管事务
            let result = sqllize.transaction(async t=>{
                await Gallery.create({
                    id: id,
                    username: username,
                    filename: saveFilename,
                    title: title,
                    info: info,
                    time: Date(),
                },{ transaction:t });
                if(tags){
                    let tagList = JSON.parse(tags);
                    for(let tag in tagList){
                        Tag.findOne({where:{tag:tagList[tag]}}).then((data)=>{
                            if(!data){
                                let tagid = Math.floor(Math.pow(10,10)*Math.random());
                                sqllize.transaction(async t=>{
                                    await Tag.create({
                                        id: tagid,
                                        tag: tagList[tag],
                                        type: GArea.tagtype_info,
                                        time: Date(),
                                    },{ transaction:t });
                                    await TagGallery.create({
                                        tagid: tagid,
                                        galleryid: id,
                                    },{ transaction:t });    
                                });
                            }
                            else{
                                sqllize.transaction(async t=>{
                                    await TagGallery.create({
                                        tagid: data.id,
                                        galleryid: id,
                                    },{ transaction:t });    
                                });
                            }
                        });
                    }
                }
            });
            if(result){
                await file.mv(savepath);
                if(ext!='gif'||ext!='GIF'){compressImage(savepath,config.FILE_fileHub.galleryPreview+saveFilename);}
                res.send(1);
            }
        }
        catch(e){console.log(e);res.send(0);}
    });
    machine.post(routeTable.getRegisterCode,(req,res)=>{ // 获取注册验证码
        let username = req.body.username;
        let password = req.body.password;
        let name = req.body.name;
        let email = req.body.email;
        let code = Math.floor(Math.pow(10,6)*Math.random());
        let content = `
            <h1>注册粉糖账号 ${ username }</h1>
            <p>验证码：${ code }</p>
        `
        sendAMail(email,content).then(x=>{
            if(x){
                req.session['registerForm'] = {
                    username: username,
                    password: password,
                    name: name,
                    email: email,
                    code: code,
                }
                req.session.cookie.maxAge = config.SESSION_effectiveTime;
                res.send(1);return;
            }
            else{res.send(0);}
        })
    });
    machine.post(routeTable.register,(req,res)=>{ // 注册
        let registerForm = req.body;
        if(isEqualObj(registerForm,req.session['registerForm'])){
            try{
                let username = registerForm.username;
                let passwordhash = createPasswordHash(registerForm.password);
                let name = registerForm.name;
                let email = registerForm.email;
                sqllize.transaction(async t=>{
                    await User.create({
                        username: username,
                        password: passwordhash,
                        name: name,
                        email: email,
                        jointime: Date(),
                    },{ transaction:t });
                });
                req.session['username'] = username;
                res.send(1);
            }
            catch(e){console.log(e);res.send(0);}
        }
        else{res.send(0);}
    });
    machine.post(routeTable.getResetPasswordCode,(req,res)=>{  // 获取重设密码验证码
        let resetPasswordForm = req.body;
        let email = resetPasswordForm.email;
        User.findOne({where:{email:email}}).then(data=>{
            if(data){
                let code = Math.floor(Math.pow(10,6)*Math.random());
                let username = data.username;
                let content = `
                    <h1>重设粉糖账号 ${ username } 的密码</h1>
                    <p>验证码：${ code }</p>
                `
                req.session['resetPasswordEmail'] = email;
                req.session['resetPasswordCode'] = code;
                req.session.cookie.maxAge = config.SESSION_effectiveTime;
                sendAMail(email,content).then(x=>{
                    if(x){res.send(1);}
                    else{res.send(0);}
                });
            }
        });
    });
    machine.post(routeTable.resetPassword,(req,res)=>{ // 重设密码
        let resetPasswordForm = req.body;
        let email = resetPasswordForm.email;
        let code = resetPasswordForm.code;
        let password = resetPasswordForm.password;
        if(email!=req.session.resetPasswordEmail || code!=req.session.resetPasswordCode){res.send(0);return;}
        User.findOne({where:{email:email}}).then(data=>{
            try{
                let username = data.username;
                let passwordhash = createPasswordHash(password);
                sqllize.transaction(async t=>{
                    await User.update(
                        {password:passwordhash},
                        {where:{username:username}},
                        { transaction:t },
                    );
                    req.session.destroy();
                    res.send(1);
                });
            }
            catch(e){console.log(e);res.send(0);}
        });
    });
    machine.post(routeTable.createPlantpot,(req,res)=>{ // 创建盆栽
        let plantpotForm = req.body;
        let title = plantpotForm.title;
        let content = plantpotForm.content;
        let tags = plantpotForm.tags;
        let file = req.files?.file;
        let id = Math.floor(Math.pow(10,10)*Math.random());
        let username = req.session.username;
        if(!title || !content || !username){res.send(0);return;}
        let saveFilename = null;
        if(file){
            let ext = getExtension(file.name);
            saveFilename = id+'.'+ext;
            let savepath = config.FILE_fileHub.garden+saveFilename;
            if(!ext in config.FILE_imageAllowExtension){res.send(0);return;}
            file.mv(savepath);
        }
        try{
            let result = sqllize.transaction(async t=>{
                await Garden.create({
                    id: id,
                    username: username,
                    filename: saveFilename,
                    title: title,
                    content: content,
                    createtime: Date(),
                    updatetime: Date(),
                },{ transaction:t });
                if(tags){
                    let tagList = JSON.parse(tags);
                    for(let tag in tagList){
                        Tag.findOne({where:{tag:tagList[tag]}}).then((data)=>{
                            if(!data){
                                let tagid = Math.floor(Math.pow(10,10)*Math.random());
                                sqllize.transaction(async t=>{
                                    await Tag.create({
                                        id: tagid,
                                        tag: tagList[tag],
                                        type: 1,
                                        time: Date(),
                                    },{ transaction:t });
                                    await TagGarden.create({
                                        tagid: tagid,
                                        gardenid: id,
                                    },{ transaction:t });
                                });
                            }
                            else{
                                sqllize.transaction(async t=>{
                                    await TagGarden.create({
                                        tagid: data.id,
                                        gardenid: id,
                                    },{ transaction:t });
                                });
                            }
                        });
                    }
                }
            });
            if(result){res.send(1);}
        }
        catch(e){console.log(e);res.send(0);}
    });
    machine.post(routeTable.addBoardMessage,(req,res)=>{ // 留言
        let username = req.session.username;
        let content = req.body.content;
        if(!username || !content){res.send(0);return;}
        try{
            sqllize.transaction(async t=>{
                await Board.create({
                    username: username,
                    content: content,
                    time: Date(),
                },{ transaction: t });
                res.send(1);
            });
        }
        catch(e){console.log(e);res.send(0);}
    });
    machine.post(routeTable.editUser,(req,res)=>{ // 修改用户信息
        let editUserForm = req.body;
        let name = editUserForm.name;
        let info = editUserForm.info;
        let sex = editUserForm.sex;
        let species = editUserForm.species;
        let username = req.session.username;
        if(!name || !username){res.send(0);return;}
        try{
            sqllize.transaction(async t=>{
                await User.update(
                    {
                        name: name,
                        info: info,
                        sex: sex,
                        species: species,
                    },
                    {where:{username:username}},
                    { transaction:t },
                );
                res.send(1);
            });
        }
        catch(e){console.log(e);res.send(0);}
    });
    machine.post(routeTable.editUserImage,(req,res)=>{ // 修改用户图片
        let headimage = req.files?.headimage;
        let backimage = req.files?.backimage;
        let username = req.session.username;
        if(!username){res.send(0);return;}
        if(!headimage && !backimage){res.send(0);return;}
        if(headimage){
            let id = Math.floor(Math.pow(10,10)*Math.random());
            let ext = getExtension(headimage.name);
            if(!ext in config.FILE_imageAllowExtension){res.send(0);return;}
            let saveFilename = id+'.'+ext;
            let saveTmpFilename = id+'tmp'+'.'+ext;
            let savepath = config.FILE_fileHub.headimage+saveFilename;
            let tmpSavepath = config.FILE_fileHub.headimage+saveTmpFilename;
            try{
                sqllize.transaction(async t=>{
                    let oldFilename;
                    await User.findOne({where:{username:username}}).then(data=>{oldFilename = data.headimage;});
                    await User.update(
                        {headimage:saveFilename,},
                        {where:{username:username}},
                        { transaction:t },
                    );
                    await headimage.mv(tmpSavepath);
                    await compressImage(tmpSavepath,savepath);
                    fs.unlinkSync(tmpSavepath);
                    if(oldFilename){fs.unlinkSync(config.FILE_fileHub.headimage+oldFilename);}
                });
            }
            catch(e){console.log(e);res.send(0);}
        }
        if(backimage){
            let id = Math.floor(Math.pow(10,10)*Math.random());
            let ext = getExtension(backimage.name);
            if(!ext in config.FILE_imageAllowExtension){res.send(0);return;}
            let saveFilename = id+'.'+ext;
            let saveTmpFilename = id+'tmp'+'.'+ext;
            let savepath = config.FILE_fileHub.backimage+saveFilename;
            let tmpSavepath = config.FILE_fileHub.backimage+saveTmpFilename;
            try{
                sqllize.transaction(async t=>{
                    let oldFilename;
                    await User.findOne({where:{username:username}}).then(data=>{oldFilename=data.backimage;});
                    await User.update(
                        {backimage:saveFilename,},
                        {where:{username:username}},
                        { transaction:t },
                    );
                    await backimage.mv(tmpSavepath)
                    await compressImage(tmpSavepath,savepath,config.FILE_imageResizeNum*4);
                    fs.unlinkSync(tmpSavepath);
                    if(oldFilename){fs.unlinkSync(config.FILE_fileHub.backimage+oldFilename);}
                });
            }
            catch(e){console.log(e);res.send(0);}
        }
        res.send(1);
    });
    machine.post(routeTable.getEditUserImportantCode,(req,res)=>{ // 获取用户关键信息验证码
        let editUserImportantForm = req.body;
        let email = editUserImportantForm.email;
        let username = req.session.username;
        if(!username){res.send(0);return;}
        (async()=>{
            if(!email){
                await User.findOne({where:{username:username}}).then(data=>{
                    email = data.email;
                });
            }
            let code = Math.floor(Math.pow(10,6)*Math.random());
            let content = `
                <h1>修改粉糖账号 ${ username } 的关键内容</h1>
                <p>验证码：${ code }</p>
            `
            req.session['editUserImportantCode'] = code;
            req.session.cookie.maxAge = config.SESSION_effectiveTime;
            sendAMail(email,content);
            res.send(1);
        })()
    });
    machine.post(routeTable.editUserImportant,(req,res)=>{ // 修改用户关键信息
        let editUserImportantForm = req.body;
        let password = editUserImportantForm.password;
        let email = editUserImportantForm.email;
        let code = editUserImportantForm.code;
        let username = req.session.username;
        if(!username || code!=req.session['editUserImportantCode']){res.send(0);return;}
        if(password){
            try{
                let passwordhash = createPasswordHash(password);
                sqllize.transaction(async t=>{
                    await User.update(
                        {password:passwordhash},
                        {where:{username:username}},
                        { transaction:t },
                    );
                });
            }
            catch(e){console.log(e);res.send(0);}
        }
        if(email){
            try{
                sqllize.transaction(async t=>{
                    await User.update(
                        {email:email},
                        {where:{username:username}},
                        { transaction:t },
                    );
                });
            }
            catch(e){console.log(e);res.send(0);}
        }
        req.session.destroy();
        res.send(1);
    });
    machine.post(routeTable.clearUserImage,(req,res)=>{ // 清除用户图片
        let username = req.session.username;
        if(!username){res.send(0);return;}
        try{
            User.findOne({where:{username:username}}).then(data=>{
                let headimage = data.headimage;
                let backimage = data.backimage;
                sqllize.transaction(async t=>{
                    await User.update(
                        {headimage:null,backimage:null},
                        {where:{username:username}},
                        { transaction:t },
                    );
                    if(headimage){
                        let headimagepath = config.FILE_fileHub.headimage+headimage;
                        fs.unlinkSync(headimagepath);    
                    }
                    if(backimage){
                        let backimagepath = config.FILE_fileHub.backimage+backimage;
                        fs.unlinkSync(backimagepath);    
                    }
                    res.send(1);
                });
            });
        }
        catch(e){console.log(e);res.send(0);}
    });
    machine.post(routeTable.sendCommentArtwork,(req,res)=>{ // 发送作品评论
        let commentid = Math.floor(Math.pow(10,10)*Math.random())
        let galleryid = req.body.id;
        let username = req.session.username;
        let content = req.body.content;
        let time = Date();
        if(!galleryid || !username || !content){res.send(0);return;}
        try{
            sqllize.transaction(async (t)=>{
                await GalleryComment.create({
                    id: commentid,
                    galleryid: galleryid,
                    username: username,
                    content: content,
                    time: time,
                },{ transaction:t });
                res.send(1);
            });
        }
        catch(e){console.log(e);res.send(0);};
    });
    machine.post(routeTable.pawArtworkMedia,(req,res)=>{ // 作品印爪
        let username = req.session.username;
        let id = req.body.id;
        let commentid = req.body.commentid?req.body.commentid:null;
        if(!username || !id){res.send(0);return;}
        try{
            (async ()=>{
                let havePaw = await GalleryPaw.findOne({where:{username:username,galleryid:id,commentid:commentid}});
                if(!havePaw){
                    sqllize.transaction(async t=>{
                        await GalleryPaw.create({
                            username: username,
                            galleryid: id,
                            commentid: commentid,
                            time: Date(),
                        },{transaction: t});
                    });
                }
                else{
                    sqllize.transaction(async t=>{
                        await GalleryPaw.destroy({where:{
                            username: username,
                            galleryid: id,
                            commentid: commentid,
                        }},{transaction: t});
                    });
                }
                res.send(1);
            })()
        }
        catch(e){console.log(e);res.send(0);}
    });
    machine.post(routeTable.starArtworkMedia,(req,res)=>{ // 作品收藏
        let username = req.session.username;
        let id = req.body.id;
        if(!username || !id){res.send(0);return;}
        try{
            (async ()=>{
                let haveStar = await GalleryStar.findOne({where:{username:username,galleryid:id}});
                if(!haveStar){
                    sqllize.transaction(async t=>{
                        await GalleryStar.create({
                            username: username,
                            galleryid: id,
                            time: Date(),
                        },{transaction: t});
                    });
                }
                else{
                    sqllize.transaction(async t=>{
                        await GalleryStar.destroy({where:{
                            username: username,
                            galleryid: id,
                        }},{transaction: t});
                    });
                }
                res.send(1);
            })()
        }
        catch(e){console.log(e);res.send(0);}
    });
    machine.post(routeTable.haveWatch,(req,res)=>{ // 是否关注用户
        let watcher = req.session.username;
        let username = req.body.towatch;
        if(!watcher){res.send(0);return;}
        (async ()=>{
            let haveWatch = await UserWatch.findOne({where:{
                username: username,
                watcher: watcher,
            }});
            res.send(haveWatch?1:0);    
        })()
    })
    machine.post(routeTable.watchUser,(req,res)=>{ // 关注用户
        let watcher = req.session.username;
        let username = req.body.towatch;
        if(!watcher){res.send(0);return;}
        if(watcher==username){res.send(0);return;}
        try{
            (async ()=>{
                let haveWatch = await UserWatch.findOne({where:{
                    username: username,
                    watcher: watcher,
                }});
                if(!haveWatch){
                    sqllize.transaction(async t=>{
                        await UserWatch.create({
                            username: username,
                            watcher: watcher,
                            time: Date(),
                        },{transaction:t});
                    });
                }
                else{
                    sqllize.transaction(async t=>{
                        await UserWatch.destroy({where:{
                            username: username,
                            watcher: watcher,
                        }},{transaction:t});
                    });
                }
                res.send(1);
            })()
        }
        catch(e){console.log(e);res.send(0);}
    });
    machine.post(routeTable.pawPlantpotMedia,(req,res)=>{ // 盆栽印爪
        let username = req.session.username;
        let id = req.body.id;
        let commentid = req.body.commentid?req.body.commentid:null;
        if(!username || !id){res.send(0);return;}
        try{
            (async ()=>{
                let havePaw = await GardenPaw.findOne({where:{username:username,gardenid:id,commentid:commentid}});
                if(!havePaw){
                    sqllize.transaction(async t=>{
                        await GardenPaw.create({
                            username: username,
                            gardenid: id,
                            commentid: commentid,
                            time: Date(),
                        },{transaction: t});
                    });
                }
                else{
                    sqllize.transaction(async t=>{
                        await GardenPaw.destroy({where:{
                            username: username,
                            gardenid: id,
                            commentid: commentid,
                        }},{transaction: t});
                    });
                }
                res.send(1);
            })()
        }
        catch(e){console.log(e);res.send(0);}
    });
    machine.post(routeTable.sendPlantpotCommentReply,(req,res)=>{ // 发送叶纸条
        let commentid = req.body.id;
        let username = req.session.username;
        let content = req.body.content;
        if(!commentid || !username || !content){res.send(0);return;}
        try{
            sqllize.transaction(async (t)=>{
                await GardenCommentReply.create({
                    commentid: commentid,
                    username: username,
                    content: content,
                    time: Date(),
                },{ transaction:t });
                res.send(1);
            });
        }
        catch(e){console.log(e);res.send(0);};
    });
    machine.post(routeTable.starPlantpotMedia,(req,res)=>{ // 盆栽收藏
        let username = req.session.username;
        let id = req.body.id;
        if(!username || !id){res.send(0);return;}
        try{
            (async ()=>{
                let haveStar = await GardenStar.findOne({where:{username:username,gardenid:id}});
                if(!haveStar){
                    sqllize.transaction(async t=>{
                        await GardenStar.create({
                            username: username,
                            gardenid: id,
                            time: Date(),
                        },{transaction: t});
                    });
                }
                else{
                    sqllize.transaction(async t=>{
                        await GardenStar.destroy({where:{
                            username: username,
                            gardenid: id,
                        }},{transaction: t});
                    });
                }
                res.send(1);
            })()
        }
        catch(e){console.log(e);res.send(0);}
    });
}
