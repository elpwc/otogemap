<?php
require dirname(__FILE__) . '/../private/dbcfg.php';
require dirname(__FILE__) . '/../private/admin.php';
require dirname(__FILE__) . '/../utils/utils.php';
require dirname(__FILE__) . '/../utils/sqlgenerator.php';
require dirname(__FILE__) . '/../utils/cors.php';
require dirname(__FILE__) . '/../private/verifygen.php';

session_start();

$request_type = $_SERVER['REQUEST_METHOD'];
$json = file_get_contents('php://input');
$data = json_decode($json);

$sqllink = @mysqli_connect(HOST, USER, PASS, DBNAME) or die('数据库连接出错');
mysqli_set_charset($sqllink, 'utf8mb4');

switch ($request_type) {
  case 'POST':
    $name = escape_string($sqllink, $data->name);
    $email = escape_string($sqllink, $data->email);
    $pw = trim((string)($data->password));

    $sql = "SELECT `email` FROM `user` WHERE `email` = ? AND `is_deleted` = 0";
    $result = prepare_bind_execute($sqllink, $sql, "s", [$email]);

    if ($result && mysqli_num_rows($result) > 0) {
      echo json_encode(["res" => "exist"]);
    } else {
      if ($result) {
        $sql = "INSERT INTO `user` (`name`, `pw`, `email`) VALUES (?, ?, ?)";
        $params = [$name, md5($pw), $email];

        $result = prepare_bind_execute($sqllink, $sql, "sss", $params);

        if ($result) {
          echo json_encode(["res" => "ok"]);
          $email_result = send_register_verification_mail($email, generate_verification_code($email));
        } else {
          echo json_encode(["res" => "unknown_error"]);
        }
      } else {
        echo json_encode(["res" => "email_failed"]);
      }
    }
    break;

  case 'GET':
    $email = escape_string($sqllink, $_GET['email']);

    $sql = "SELECT `id`, `name`, `email`, `is_banned`, `auth`, `verified` 
            FROM `user` 
            WHERE `email` = ? AND `is_deleted` = 0";

    $result = prepare_bind_execute($sqllink, $sql, "s", [$email]);

    if ($result && mysqli_num_rows($result) > 0) {
      $user = mysqli_fetch_assoc($result);
      echo json_encode([
        "res" => "ok",
        "user" => $user
      ]);
    } else {
      echo json_encode(["res" => "not_exist"]);
    }
    break;

  case 'PATCH':
    $email = escape_string($sqllink, $data->email);
    $update_fields = [];
    $params = [];
    $types = "";

    $fields = [
      'name' => 's',
      'pw' => 's',
      'is_deleted' => 'i',
      'is_banned' => 'i',
      'auth' => 'i',
      'verified' => 'i'
    ];

    foreach ($fields as $field => $type) {
      if (isset($data->$field)) {
        $update_fields[] = "`$field` = ?";
        $params[] = $type === 's' ?
          escape_string($sqllink, $data->$field) :
          $data->$field;
        $types .= $type;
      }
    }

    if (!empty($update_fields)) {
      $params[] = $email;
      $types .= "s";

      $sql = "UPDATE `user` SET " . implode(', ', $update_fields) . " WHERE `email` = ?";
      $result = prepare_bind_execute($sqllink, $sql, $types, $params);

      if ($result) {
        echo json_encode(["res" => "ok"]);
      } else {
        echo json_encode(["res" => "unknown_error"]);
      }
    } else {
      echo json_encode(["res" => "no_fields_to_update"]);
    }
    break;

  case 'DELETE':
    $id = escape_string($sqllink, $data->id);

    $sql = "UPDATE `user` SET `is_deleted` = 1 WHERE `id` = ?";
    $result = prepare_bind_execute($sqllink, $sql, "s", [$id]);

    if ($result) {
      echo json_encode(["res" => "ok"]);
    } else {
      echo json_encode(["res" => "unknown_error"]);
    }
    break;

  default:
    break;
}
