// MySQL数据库

import mysql from 'mysql';
import config from '../config';

const connection = mysql.createConnection(config.DATABASE_mysql);
connection.connect();

export default connection;
