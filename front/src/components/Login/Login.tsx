import api from '../../api/axios';
import axios from 'axios';
import styles from './Login.module.css';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Login = () => {
    const [id, setId] = useState(() => sessionStorage.getItem('login_id') || '');
    const [pw, setPw] = useState('');
    const [isOn, setIsOn] = useState(() => sessionStorage.getItem('login_isOn') === 'true');
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // ProtectedRoute에서 넘겨준 '원래 가려던 경로' 정보를 가져옴
    const from = (location.state as any)?.from?.pathname || '/';
    
    useEffect(() => {
        sessionStorage.setItem('login_id', id);
        sessionStorage.setItem('login_isOn', String(isOn));
    }, [id, isOn]);

    const handleReset = () => {
        setId('');
        sessionStorage.removeItem('login_id');
    };

    const handleLogin = async () => {
        if (!isOn) return;
        try {
            const response = await api.post('/api/public/login', {
                username: id,
                password: pw
            });

            const token = response.data.token;
            login(token);
            
            alert((response.data).message || "로그인 성공");
            sessionStorage.removeItem('login_pw');

            // 원래 가려던 페이지로 이동 (없으면 메인으로)
            navigate(from, { replace: true });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data || "로그인 실패";
                alert(message);
            } else {
                console.error("알 수 없는 에러:", error);
            }
        }
    };

    const togglePower = () => {
        setIsOn(!isOn);
    };
    const mainHandleClick = () => {
    navigate('/');
  };

    return (
    
        <div className={`${styles['loginContainer']} ${isOn ? styles['power-on'] : styles['power-off']}`}>
            <div><img className={`${styles['mainlogo']} ${isOn ? styles['mainlogo-on'] : styles['mainlogo-off']}`} src="/lightPokeLogo.png" alt="로고" style={{ cursor: 'pointer' }} onClick={mainHandleClick}/>
                <div className={styles['gameboy']}>
                    <div className={styles['screen-container']}>
                        <div className={`${styles['screen']} ${isOn ? styles['screen-on'] : styles['screen-off']}`}>
                            {isOn ? (
                                <div className={styles['screen-content']}>
                                    <div className={styles['login-header']}>POKE CARD</div>
                                    <div className={styles['input-group']}>
                                        <input 
                                            className={styles['game-input']} 
                                            onChange={(e) => setId(e.target.value)} 
                                            placeholder="ID" 
                                            value={id}
                                        />
                                        <input 
                                            className={styles['game-input']} 
                                            type="password" 
                                            onChange={(e) => setPw(e.target.value)} 
                                            placeholder="PW" 
                                            value={pw}
                                        />
                                    </div>
                                    <div className={styles['screen-footer']}>
                                        <span className={styles['footer-link']} onClick={() => navigate('/SignUp')}>SIGN UP</span>
                                        <span className={styles['separator']}>|</span>
                                        <span className={styles['footer-link']} onClick={() => navigate('/PwReset')}>RESET</span>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles['screen-black']}></div>
                            )}
                        </div>
                    </div>

                    <div className={styles['controls']}>
                        <div className={styles['d-pad']}>
                            <div className={styles['up']}></div>
                            <div className={styles['right']}></div>
                            <div className={styles['down']}></div>
                            <div className={styles['left']}></div>
                        </div>

                        <div className={styles['action-buttons']}>
                            <div className={styles['button-label-group']}>
                                <button className={styles['btn-b']} onClick={handleReset}>B</button>
                                <span className={styles['btn-text']}>CANCEL</span>
                            </div>
                            <div className={styles['button-label-group']}>
                                <button className={styles['btn-a']} onClick={handleLogin}>A</button>
                                <span className={styles['btn-text']}>LOGIN</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles['bottom-controls']}>
                        <div className={styles['select-start']}>
                            <div className={styles['pill-button-wrapper']}>
                                <div className={styles['pill-button']} onClick={togglePower}></div>
                                <div className={styles['pill-label']}>POWER</div>
                            </div>
                            <div className={styles['pill-button-wrapper']}>
                                <div className={styles['pill-button']} onClick={handleLogin}></div>
                                <div className={styles['pill-label']}>START</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;