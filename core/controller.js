// 控制器

import express from 'express';
import { Board, Gallery, Garden, Tag, TagGallery, TagGarden, User } from './database/models.js';
import { checkObjComplete, comparePasswordHash, createPasswordHash, getDBRecordCount, getExtension, isEqualObj } from './utils.js';
import config from '../config.js';
import sqllize from './database/orm_sequelize.js';
import { sendAMail } from './mailer.js';

const routeTable = config.CONTROL_routeTable;

// 加载控制器
export function loadMachineController(machine=express()){
    // 基本
    machine.get(routeTable.root,(req,res)=>{res.send('<h1>PINKCANDY: ok</h1>');});
    machine.post(routeTable.root,(req,res)=>{res.send('PINKCANDY: post ok');});
    machine.get(routeTable.files_gallery,(req,res)=>{
        let filename = req.params.filename;
        if(!filename){res.send(0);return;}
        let fileurl = config.FILE_fileHub.gallery+filename;
        console.log(fileurl);
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
                                        type: 1,
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
                file.mv(savepath);
                res.send(1);
            }
        }
        catch(e){console.log(e);res.send(0);return;}
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
            catch(e){console.log(e);res.send(0);return;}
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
        catch(e){console.log(e);res.send(0);return;}
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
}
