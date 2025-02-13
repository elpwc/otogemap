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

session_start();

$request_type = $_SERVER['REQUEST_METHOD']; //请求类型GET POST PUT DELETE
$json = file_get_contents('php://input'); //获取CURL GET POST PUT DELETE 请求的数据
$data = json_decode($json);


$sqllink = @mysqli_connect(HOST, USER, PASS, DBNAME) or die('数据库连接出错');
mysqli_set_charset($sqllink, 'utf8mb4');

$result = '';

switch ($request_type) {
  case 'POST':

    @$name = trim((string)($data->name));
    @$email = trim((string)($data->email));
    @$token = trim((string)($data->token));
    @$pw = trim((string)($data->password));

    //if ($_SESSION["verify_code"] != '' && $verify_code == $_SESSION["verify_code"]) {

    //unset($_SESSION['verify_code']);

    // user exist
    //   $usersql = 'SELECT `name` FROM `user`
    // WHERE `name`="' . $name . '" AND `is_deleted`=0
    // ;';
    // email exist
    $emailsql = 'SELECT `email` FROM `user`
    WHERE `email`="' . $email . '" AND `is_deleted`=0
    ;';

    //$user_result = mysqli_query($sqllink, $usersql);

    $email_result = mysqli_query($sqllink, $emailsql);

    if (/*($user_result->num_rows > 0) ||*/($email_result->num_rows > 0)) {
      // exist
      echo json_encode(["res" => "exist"]);
    } else {
      if ($email_result) {
        // not exist
        $sql = 'INSERT 
      INTO `user` (`name`, `pw`, `email`)
      VALUES ("' . $name . '","' . md5($pw) . '","' . $email . '");
      ';


        $result = mysqli_query($sqllink, $sql);
        if ($result == true) {
          echo json_encode(["res" => "ok"]);
        } else {
          echo json_encode(["res" => "unknown_error"]);
        }
        $email_result = send_register_verification_mail($email, generate_verification_code($email));
      } else {

        echo json_encode(["res" => "email_failed"]);
      }
    }
    // } else {
    //   echo json_encode(["res" => "verification_error"]);
    // }

    break;
  case 'GET':
    @$email = trim((string)($_GET['email']));
    error_log(($email));

    $sql = 'SELECT `id`, `name`, `email`, `is_banned`, `auth`, `verified` FROM `user` 
    WHERE `email`="' . $email . '" AND `is_deleted`=0
    ;';

    $result = mysqli_query($sqllink, $sql);

    if ($result->num_rows > 0) {
      // exist
      $user = mysqli_fetch_assoc($result);
      echo json_encode([
        "res" => "ok",
        "user" => $user
      ]);
    } else {
      // not exist
      echo json_encode(["res" => "not_exist"]);
    }

    break;
  case 'PATCH':
    @$id = trim((string)($data->id));
    @$name = trim((string)($data->name));
    @$pw = trim((string)($data->pw));
    @$is_deleted = isset($data->is_deleted) ? (int)$data->is_deleted : null;
    @$is_banned = isset($data->is_banned) ? (int)$data->is_banned : null;
    @$auth = isset($data->auth) ? (int)$data->auth : null;
    @$email = trim((string)($data->email));
    @$verified = isset($data->verified) ? (int)$data->verified : null;

    $update_fields = [];
    if ($name !== '') $update_fields[] = "`name`='$name'";
    if ($pw !== '') $update_fields[] = "`pw`='$pw'";
    if ($is_deleted !== null) $update_fields[] = "`is_deleted`=$is_deleted";
    if ($is_banned !== null) $update_fields[] = "`is_banned`=$is_banned";
    if ($auth !== null) $update_fields[] = "`auth`=$auth";
    if ($verified !== null) $update_fields[] = "`verified`=$verified";

    if (!empty($update_fields)) {
      $sql = "UPDATE `user` SET " . implode(', ', $update_fields) . " WHERE `email`='$email';";
      error_log($sql);
      $result = mysqli_query($sqllink, $sql);

      if ($result == true) {
        echo json_encode(["res" => "ok"]);
      } else {
        echo json_encode(["res" => "unknown_error"]);
      }
    } else {
      echo json_encode(["res" => "no_fields_to_update"]);
    }
    break;
  case 'DELETE':
    @$id = trim((string)($data->id));

    $sql = "UPDATE user
    SET `is_deleted`=1
    WHERE `id`=$id;";

    $result = mysqli_query($sqllink, $sql);

    if ($result == true) {
      echo json_encode(["res" => "ok"]);
    } else {
      echo json_encode(["res" => "unknown_error"]);
    }

    break;
  default:
    break;
}
