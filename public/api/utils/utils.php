<?php

/**
 * 一些php工具方法
 * @author wniko
 */

require dirname(__FILE__) . '/../private/illegal_words_list.php';
require dirname(__FILE__) . '/../plugin/Lib_Smtp.php';
require dirname(__FILE__) . '/../utils/mailSender.php';

/**
 * 防注入
 */
function anti_inj($text)
{
    $res = $text;
    $res = str_replace('\'', '', $res);
    $res = str_replace('"', '', $res);
    $res = str_replace('_', ' ', $res);

    $res = str_ireplace('<script', '<scramble', $res);
    $res = str_ireplace('<object', '<scramble', $res);
    $res = str_ireplace('<style', '<scramble', $res);
    $res = str_ireplace('<iframe', '<scramble', $res);
    $res = str_ireplace('<link', '<scramble', $res);

    return $res;
}

function escape_string($sqllink, $str)
{
    if ($str === null) return null;
    return mysqli_real_escape_string($sqllink, trim((string)$str));
}

function prepare_bind_execute($sqllink, $sql, $types, $params)
{
    $stmt = mysqli_prepare($sqllink, $sql);
    if ($stmt === false) {
        return false;
    }

    if (!empty($params)) {
        mysqli_stmt_bind_param($stmt, $types, ...$params);
    }

    $result = mysqli_stmt_execute($stmt);
    if ($result === false) {
        mysqli_stmt_close($stmt);
        return false;
    }

    $query_result = mysqli_stmt_get_result($stmt);
    mysqli_stmt_close($stmt);
    return $query_result;
}

/**
 * 和谐
 */
function cator_to_cn_censorship($text)
{
    $res = $text;
    foreach (ILLEGAL_LIST as $word) {
        $res = str_ireplace($word, str_repeat('*', mb_strlen($word)), $res);
    }
    return $res;
}



function send_verification_code_mail($target, $verify_code)
{
    try {
        $mail = new Lib_Smtp();

        $mail->setServer(EMAIL_HOST, EMAIL_USER, EMAIL_PASS, EMAIL_PORT, true);
        $mail->setFrom(EMAIL_MAIL);
        $mail->setReceiver($target);
        $mail->addAttachment("");
        $mail->setMail(
            "邮箱验证码",
            '<h3>验证码是：<span>' . $verify_code . '</span></h3><p>有效期：5分钟</p>' . date('Y-m-d H:i:s')
        );
        return true;
    } catch (Exception $e) {
        return false;
    }
}


function send_register_verification_mail($target, $verify_code)
{
    $url_prefix = 'http://localhost:3001/';
    $url = $url_prefix . 'registercomp?acc=' . $target . '&v=' . $verify_code; //'https://www.elpwc.com/otogemap/';

    $res =  sendMail(
        $target,
        "全国引誘地図 ACCOUNT認証",
        '<p>
             下之「ACCOUNT認証」link訪問後、ACCOUNT作成完了：<br/>
             Click the link below to complete your registration:
             </p><br/>
             <a href="' . $url . '" target="_blank"><h1> ACCOUNT認証 </h1></a><br/>
             ' . date('Y-m-d H:i:s')
    );
    if ($res) {
        error_log('114');
        return true;
    } else {
        error_log('514');
        return false;
    }

    // $url_prefix = 'http://localhost:3001/';
    // $url = $url_prefix . 'registercomp?acc=' . $target . '&v=' . $verify_code; //'https://www.elpwc.com/otogemap/';
    // try {
    //     $mail = new Lib_Smtp();

    //     $mail->setServer(EMAIL_HOST, EMAIL_USER, EMAIL_PASS, EMAIL_PORT, true);
    //     $mail->setFrom(EMAIL_MAIL);
    //     $mail->setReceiver($target);
    //     $mail->addAttachment("");
    //     $mail->setMail(
    //         "全国引誘地図 ACCOUNT認証",
    //         '<p>
    //         下之「ACCOUNT認証」link訪問後、ACCOUNT作成完了：<br/>
    //         Click the link below to complete your registration:
    //         </p><br/>
    //         <a href="' . $url . '" target="_blank"><h1> ACCOUNT認証 </h1></a><br/>
    //         ' . date('Y-m-d H:i:s')
    //     );
    //     if($mail->send()){
    //         error_log('114');
    //         return true;
    //     }else{
    //         error_log('514');
    //         return false;
    //     }
    // } catch (Exception $e) {
    //     error_log($e->getMessage());
    // }
}
