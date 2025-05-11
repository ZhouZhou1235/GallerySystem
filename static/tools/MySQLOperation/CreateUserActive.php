<?php

require_once 'MysqlOperation.php';

$db4 = new MysqlOperation(
    'localhost',
    'root',
    '123456',
    'pinkcandy_gallery4',
);

$userList = $db4->queryAndList("SELECT * FROM user;");
for($i=0;$i<count($userList);$i++){
    $user = $userList[$i];
    $username = $user['username'];
    $time = date('Y-m-d H:i:s');
    $db4->query("INSERT INTO user_active VALUES('$username','$time')");
}
