// 配置

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// 系统目录 ES标准实现 CommonJS __dirname
export const workPath = dirname(fileURLToPath(import.meta.url));

const config = {
    LISTEN_PORT: 3000, // 运行端口
    TEXT_ENCODING: 'utf8', // 文本编码
    CONTROL_routeTable: { // 访问规则表
        root: '/',
        files_gallery: '/files/gallery/:filename',
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
    },
    // session
    SESSION_secret: 'pinkcandy gallery', // session会话密钥
    SESSION_name: 'PINKCANDY_USER',
    SESSION_cookie: {maxAge:1000*60*60*24*7},
    SESSION_resave: true,
    SESSION_saveUninitialized: true,
    SESSION_effectiveTime: 1000*60*5, // 有效时间
    // 数据库
    DATABASE_mysql: { // MySQL 配置
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'pinkcandy_gallery4',
    },
    DATABASE_sequelize: { // ORM 数据模型映射
        host: 'localhost',
        post: 3306,
        dialect: 'mysql',
        pool: {
            max: 10,
            min: 3,
            idle: 10000,
        }
    },
    DATABASE_defaultLimit: 50,
    // 文件系统
    FILE_fileHub: {
        root: workPath+'/files',
        gallery: workPath+'/files/gallery/',
        galleryPreview: workPath+'/files/GalleryPreview/',
        garden: workPath+'/files/garden/',
    },
    FILE_staticURL: workPath+'/static',
    FILE_imageAllowExtension: [
        'jpg','gif','jpeg','png',
        'PNG','JPG','GIF',
        'tif','tiff'
    ],
    FILE_uploadLimit: '50mb',
    // 邮件模块
    MAILER_transport: {
        host: 'smtp.qq.com',
        service: 'qq',
        secure: true,
        auth: {
            user: '1479499289@qq.com',
            pass: 'auyvbrlqnjeejhjd',
        },
    },
};

export default config;
