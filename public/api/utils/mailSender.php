<?php
require "../private/emailcfg.php";
require '../../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function sendMail($addr, $subject, $body){
  $mail = new PHPMailer(true);

  error_log('1919');
  try {
      // 配置 SMTP
      $mail->isSMTP();
      $mail->Host = EMAIL_HOST; 
      $mail->SMTPAuth = true;
      $mail->Username = EMAIL_USER;  
      $mail->Password = EMAIL_PASS; 
      $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
      $mail->Port = EMAIL_PORT;
  
      // 邮件信息
      $mail->setFrom(EMAIL_USER, '114514');
      $mail->addAddress($addr);
      $mail->Subject = $subject;
      $mail->Body = $body;
  
      // 发送
      error_log('114');
      return $mail->send();
  } catch (Exception $e) {
      error_log('514' . $mail->ErrorInfo);
      return false;
  }
}
