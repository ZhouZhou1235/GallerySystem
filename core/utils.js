// 工具

import bcrypt from "bcryptjs";
import { Board, Gallery, Garden, tableName, Tag, TagGallery, TagGarden, User } from "./database/models.js";


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


// === 业务

// 获取数据表记录数
export function getDBRecordCount(table=''){
    switch(table){
        case tableName.board: return Board.count();
        case tableName.gallery: return Gallery.count();
        case tableName.garden: return Garden.count();
        case tableName.tag: return Tag.count();
        case tableName.tag_gallery: return TagGallery.count();
        case tableName.tag_garden: return TagGarden.count();
        case tableName.user: return User.count();
        default: return 0;
    }
}
