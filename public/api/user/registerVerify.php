<?php
require '../private/dbcfg.php';
require '../utils/cors.php';
require '../private/verifygen.php';

session_start();

$request_type = $_SERVER['REQUEST_METHOD']; //请求类型GET POST PUT DELETE
$json = file_get_contents('php://input'); //获取CURL GET POST PUT DELETE 请求的数据
$data = json_decode($json);

$sqllink = @mysqli_connect(HOST, USER, PASS, DBNAME) or die('数据库连接出错');
mysqli_set_charset($sqllink, 'utf8mb4');

switch ($request_type) {
  case 'POST':
    @$email = trim((string)($data->name));
    @$verifycode = trim((string)($data->verifycode));

    if (generate_verification_code($email) === $verifycode) {
      $update_sql = 'UPDATE `user` SET `verified`=1 WHERE `email`="' . $email . '" AND `is_deleted`=0 AND `is_banned`=0;';

      $update_result = mysqli_query($sqllink, $update_sql);

      if ($update_result && mysqli_affected_rows($sqllink) > 0) {
        // update successful
        @$token = md5(((string)time()) + $email);
        $_SESSION["token"] = $token;
        echo json_encode(["res" => "ok", "token" => $token]);
      } else {
        // update failed
        echo json_encode(["res" => "update_fail"]);
      }
    } else {
      echo json_encode(["res" => "not_correct"]);
    }
    break;
  default:
    echo json_encode(["res" => "not_correct_request"]);
    break;
}
