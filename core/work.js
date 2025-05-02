import { Board, Gallery, GalleryComment, Garden, tableName, Tag, TagGallery, TagGarden, User } from "./database/models.js";
import fs from 'fs';
import config  from "../config.js";


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
        case tableName.gallery_comment: return GalleryComment.count();
        default: return 0;
    }
}

// 创建文件库目录
export function createFilesDir(){
    let filehub = config.FILE_fileHub;
    let keys = Object.keys(filehub);
    for(let i=0;i<keys.length;i++){
        let path = filehub[keys[i]];
        if(!fs.existsSync(path)){fs.mkdirSync(path);}
    }
}
