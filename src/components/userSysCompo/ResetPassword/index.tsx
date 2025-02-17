import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import './index.css';
import ReCaptchaV2 from 'react-google-recaptcha';
import { RECAPTCHA_SITE_KEY } from '../../../global';
import { Field, Form, Formik } from 'formik';
import request from '../../../utils/request';
import { resetPassword } from '../../../utils/userUtils';
import { c_token, c_userName } from '../../../utils/cookies';
import Salt from '../../Salt';

interface P {
  email: string;
  token: string;
}

export default (props: P) => {
  const params = useParams();
  const navigate = useNavigate();
  const mylocation = useLocation();

  // let currentId: string = params.id as string;

  const defaultValues = {
    password: '',
    password2: '',
  };

  const [recaptchaToken, setrecaptchaToken]: [string | null, any] = useState(null);
  const [initialValues, setinitialValues]: [any, any] = useState(defaultValues);
  const [buttonAvailable, setbuttonAvailable]: [boolean, any] = useState(true);
  const [tip, settip]: [string, any] = useState('');
  const [recaptchaLoading, setrecaptchaLoading]: [boolean, any] = useState(true);
  const [hasRequestSend, sethasRequestSend]: [boolean, any] = useState(false);
  const [email, setemail]: [string, any] = useState('');

  useEffect(() => {
    c_token(props.token);
  }, [props.token]);

  useEffect(() => {
    document.title = 'Otogemap - Register';
  }, []);

  return (
    <div className="register-container">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={async (values, { resetForm }) => {
          setbuttonAvailable(false);
          if (values.password !== '' && values.password === values.password2) {
            resetPassword({ email, password: values.password })
              .then(e => {
                setbuttonAvailable(true);
                const res = e.res;
                switch (res) {
                  case 'ok':
                    resetForm();
                    settip('成功');
                    setTimeout(() => {
                      sethasRequestSend(true);
                    }, 1000);
                    break;
                  default:
                    settip('ERROR');
                    break;
                }
              })
              .catch(e => {
                setbuttonAvailable(true);
              });
          } else {
            settip('Password不一致');
          }
        }}
      >
        {({ values }) =>
          hasRequestSend ? (
            <p>君之Email中URL訪問後、ACCOUNT作成完了</p>
          ) : (
            <Form className="register-form">
              <Salt />
              <label className="register-form-item-container">{props.email}</label>
              <label className="register-form-item-container">
                <Field type="password" id="password" name="password" className="register-input" placeholder="Password" />
              </label>
              <label className="register-form-item-container">
                <Field type="password" id="password2" name="password2" className="register-input" placeholder="Password二回目" />
              </label>
              <div className="register-form-item-container">
                <button type="submit" className="retro-button register-button" disabled={!buttonAvailable}>
                  RESET Password
                </button>
                <div className="register-tip">{tip}</div>
                <Link to="/login">LOGIN</Link>
              </div>
            </Form>
          )
        }
      </Formik>
    </div>
  );
};
