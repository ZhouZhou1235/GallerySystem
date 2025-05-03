// 工具

import bcrypt from "bcryptjs";
import sharp from "sharp";
import config  from "../config.js";

// === 通用

// bcrypt 密码哈希
export function createPasswordHash(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync());
}

// 验证bcrypt密码哈希
export function comparePasswordHash(password,hash){
    return bcrypt.compareSync(password,hash);
}

// 检查对象完整不为空
export function checkObjComplete(obj={}){
    let keys = Object.keys(obj);
    for(let i=0;i<keys.length;i++){
        let x = obj[keys[i]];
        if(!x){return false;}
    }
    return true;
}

// 获取文件后缀
export function getExtension(filename=''){return filename.split('.').pop();}

// 浅比较对象内容是否相等
export function isEqualObj(obj1={},obj2={}){
    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);
    let keyLength = keys1.length;
    if(keys1.length!=keys2.length){return false;}
    for(let i=0;i<keyLength;i++){if(!keys2.includes(keys1[i])){return false;}}
    for(let i=0;i<keyLength;i++){let key=keys1[i];if(obj1[key]!=obj2[key]){return false;}}
    return true;
}

// 压缩图片
export function compressImage(filepath,savepath,resizeNum=config.FILE_imageResizeNum){
    return sharp(filepath).resize(resizeNum).toFile(savepath)
}

// sequelize数据模型转JS对象
export function modelToObj(model){return JSON.parse(JSON.stringify(model.toJSON()))}

// sequelize数据模型数组转JS对象数组
export function modelListToObjList(data=[]){
    let objList = []
    for(let i=0;i<data.length;i++){
        let model = data[i];
        let obj = modelToObj(model);
        objList.push(obj);
    }
    return objList;
}
