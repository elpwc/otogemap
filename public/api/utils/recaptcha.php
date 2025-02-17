<?php
require dirname(__FILE__) . '/../private/recaptcha_key.php';

error_log(RECAPTCHA_SITE_KEY);
function verify_recaptcha($token)
{
  $url = 'https://www.google.com/recaptcha/api/siteverify';
  $data = array(
    'secret' => RECAPTCHA_SITE_KEY,
    'response' => $token
  );
  $options = array(
    'http' => array(
      'header' => "Content-type: application/x-www-form-urlencoded\r\n",
      'method' => 'POST',
      'content' => http_build_query($data)
    )
  );
  $context = stream_context_create($options);
  $result = file_get_contents($url, false, $context);
  error_log(114514);
  error_log(($result));
  error_log(json_decode($result)->error_codes);
  return json_decode($result)->success;
}
