<?php

/**
 * 地标后端
 */

require '../private/dbcfg.php';
require '../private/admin.php';
require '../utils/utils.php';
require '../utils/sqlgenerator.php';
require '../utils/cors.php';
require '../private/verifygen.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

session_start();

$request_type = $_SERVER['REQUEST_METHOD']; //请求类型GET POST PUT DELETE
$json = file_get_contents('php://input'); //获取CURL GET POST PUT DELETE 请求的数据
$data = json_decode($json);


$sqllink = @mysqli_connect(HOST, USER, PASS, DBNAME) or die('数据库连接出错');
mysqli_set_charset($sqllink, 'utf8mb4');

$result = '';

switch ($request_type) {
  case 'POST':

    @$name_email = trim((string)($data->email));
    @$pw = trim((string)($data->pw));

    // user exist
    // $usersql = 'SELECT `name` FROM `user`
    // WHERE `name`="' . $name_email . '" AND `pw`="' . $pw . '" AND `is_deleted`=0 AND `is_banned`=0
    // ;';

    // email exist
    $emailsql = 'SELECT `email` FROM `user`
    WHERE `email`="' . $name_email . '" AND `pw`="' . md5($pw) . '" AND `is_deleted`=0 AND `is_banned`=0 AND `verified`=1
    ;';

    //$user_result = mysqli_query($sqllink, $usersql);

    $email_result = mysqli_query($sqllink, $emailsql);

    if (/*($user_result->num_rows > 0) ||*/($email_result->num_rows > 0)) {
      // exist
      @$token = gen_token($name_email, 72000);
      $_SESSION["token"] = $token;
      echo json_encode(["res" => "ok", "email" => $name_email, "token" => $token]);
    } else {
      // not exist
      echo json_encode(["res" => "fail", 'status' => 401]);
    }
    break;
  case 'DELETE':
    // 退出登录
    unset($_SESSION['token']);
    session_destroy();
    echo json_encode(["res" => "ok"]);
    break;
  default:
    echo json_encode(["res" => "unknown"]);
    break;
}
