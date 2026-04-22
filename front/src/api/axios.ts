import axios from 'axios';

const api = axios.create({
  baseURL: '', // 필요시 baseURL 설정 (현재는 '/api/...'로 상대경로 사용 중)
});

// 요청 인터셉터: 모든 요청에 JWT 토큰을 자동으로 추가
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // 로그인 이전에는 바디로 토큰을 받고, 로그인 후 헤더에 토큰을 담아 요청/응답을 받음
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 토큰 만료 등 인증 에러 처리 (필요시)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 401 Unauthorized 에러 발생 시 로그아웃 처리 또는 로그인 페이지로 이동
      sessionStorage.removeItem('accessToken');
      // window.location.href = '/Login'; // 필요시 주석 해제
    }
    return Promise.reject(error);
  }
);

export default api;
