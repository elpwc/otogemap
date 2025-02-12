import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import './index.css';
import ReCaptchaV2 from 'react-google-recaptcha';
import { RECAPTCHA_SITE_KEY } from '../../../global';
import { Field, Form, Formik } from 'formik';
import request from '../../../utils/request';
import salt1000 from '../../../resources/icons/salt1000.png';
import { c_token } from '../../../utils/cookies';

interface P {
  email: string;
  verifycode: string;
}

export default (props: P) => {
  const params = useParams();
  const navigate = useNavigate();
  const mylocation = useLocation();

  // let currentId: string = params.id as string;\
  const [tip, settip]: [string, any] = useState('');

  const verify = async ({ name, verifycode }: { name: string; verifycode: string }) => {
    return request<any>('/user/registerVerify.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: { name, verifycode },
    });
  };

  useEffect(() => {
    document.title = 'Otogemap - Register';
  }, []);

  useEffect(() => {
    (async () => {
      if (props.email !== '' && props.verifycode !== '') {
        const verifyRes = await verify({ name: props.email, verifycode: props.verifycode });
        console.log(verifyRes);
        switch (verifyRes.res) {
          case 'ok':
            settip('ACCOUNT 作成完了nya~');
            const token = verifyRes.token;
            c_token(token);
            break;
          case 'update_fail':
            settip('DATABASE ERROR発生、USER情報更新失敗');
            break;
          case 'not_correct':
            settip('認証番号錯誤、URL再度検査請求');
            break;
          case 'not_correct_request':
            settip('未知ERROR発生');
            break;
          default:
            settip('未知ERROR発生');
            break;
        }
      }
    })();
  }, [props.email, props.verifycode]);

  return (
    <div className="register-container">
      <div className="register-form">
        <img src={salt1000} height={'100px'} width={'100px'} />
        <label className="register-form-item-container">
          <p>{props.email}</p>
          <p>{tip}</p>
        </label>

        <div className="register-form-item-container">
          <button
            onClick={() => {
              navigate('/login');
            }}
            className="shahow-button register-button"
          >
            GO TO Login Page
          </button>
        </div>
      </div>
    </div>
  );
};
