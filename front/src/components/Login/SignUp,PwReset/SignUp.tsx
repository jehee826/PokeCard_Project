import api from '../../../api/axios';
import axios from 'axios';
import styles from './SignUp_PwReset.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [nickname, setNickname] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async () => {
        if (pw !== confirmPw) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const response = await api.post('/api/public/signup', {
                email: email,
                loginId: id,
                password: pw,
                nickname: nickname,
            });

            alert((response.data).message || "회원가입 성공");
            navigate('/Login');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data || "회원가입 실패");
            } else {
                console.error("알 수 없는 에러:", error);
            }
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginForm} style={{ height: 'auto', padding: '20px' }}>
                <div className={styles.loginTitle}>
                    <input 
                        className={styles.loginInput} 
                        type='email'
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="EMAIL" 
                    />
                </div>
                <div className={styles.loginTitle}>
                    <input 
                        className={styles.loginInput} 
                        onChange={(e) => setId(e.target.value)} 
                        placeholder="ID" 
                    />
                </div>
                <div className={styles.loginTitle}>
                    <input 
                        className={styles.loginInput} 
                        type="password"
                        onChange={(e) => setPw(e.target.value)} 
                        placeholder="PW" 
                    />
                </div>
                <div className={styles.loginTitle}>
                    <input 
                        className={styles.loginInput} 
                        type="password"
                        onChange={(e) => setConfirmPw(e.target.value)} 
                        placeholder="Confirm PW" 
                    />
                </div>
                <div className={styles.loginTitle}>
                    <input 
                        className={styles.loginInput} 
                        onChange={(e) => setNickname(e.target.value)} 
                        placeholder="NICKNAME" 
                    />
                </div>
                <div>
                    <button className={styles.loginButton} onClick={handleSignUp}>회원가입</button>
                </div>
            </div>
            <div className={styles.signup}>
                <h6 onClick={() => navigate('/Login')} style={{ cursor: 'pointer' }}>이미 계정이 있으신가요? 로그인</h6>
            </div>
        </div>
    );
};

export default SignUp;