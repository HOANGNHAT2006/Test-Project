import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google'; 
import './App.css';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  
  const navigate = useNavigate(); 

  // --- 2. LOGIC ĐĂNG NHẬP GOOGLE (ĐÃ CẬP NHẬT) ---
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
        try {
            // Gửi Token về Backend để xác thực
            const response = await fetch('http://127.0.0.1:8000/api/google-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: tokenResponse.access_token }), 
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.detail || 'Đăng nhập Google thất bại');
            } else {
                // 1. Luôn lưu Token và thông tin user trước
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user_info', JSON.stringify(data.user_info));
              
                // 2. KIỂM TRA: CÓ PHẢI USER MỚI (HOẶC CHƯA ĐỔI TÊN) KHÔNG?
                if (data.is_new_user) {
                    console.log("User mới -> Chuyển đến trang đặt tên");
                    navigate('/set-username');
                } else {
                    // 3. NẾU USER CŨ -> ĐIỀU HƯỚNG THEO ROLE NHƯ CŨ
                    const userInfo = data.user_info;
                    const standardizedRole = userInfo.role ? userInfo.role.toLowerCase() : '';
                    console.log("Vai trò:", standardizedRole);
                    
                    if (standardizedRole === 'doctor') { 
                        navigate('/dashboarddr', { replace: true });
                    } else {
                        navigate('/dashboard', { replace: true });
                    }
                }
            }
        } catch (err) {
            setError('Không thể kết nối đến Server khi đăng nhập Google!');
            console.error(err);
        }
    },
    onError: () => setError('Đăng nhập Google thất bại (Popup closed)'),
  });

  // --- LOGIC ĐĂNG NHẬP THƯỜNG (Giữ nguyên) ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
        const response = await fetch('http://127.0.0.1:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userName, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.detail || 'Đăng nhập thất bại');
        } else {
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user_info', JSON.stringify(data.user_info));
            const userInfo = data.user_info;

            const standardizedRole = userInfo.role ? userInfo.role.toLowerCase() : '';
            if (standardizedRole === 'doctor') {
                 navigate('/dashboarddr', { replace: true });
            } else {
                 navigate('/dashboard', { replace: true });
            }
        }

    } catch (err) {
        setError('Không thể kết nối đến Server!');
        console.error(err);
    }
  };

  return (
    <div className="login-box">
      <div className="form-title">
        <img src="/logo.svg" alt="AURA Logo" style={{ width: '80px', marginBottom: '10px' }} />
        <h3>Đăng Nhập</h3>
      </div>
      
      <form onSubmit={handleLogin}>
        {error && <p style={{color: 'red', marginBottom: '10px'}}>{error}</p>}

        <div className="input-group">
          <i className="fas fa-user icon"></i> 
          <input 
            type="text" 
            placeholder="Tên người dùng" 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)} 
            required
          />
        </div>
        <div className="input-group">
          <i className="fas fa-lock icon"></i>
          <input 
            type="password" 
            placeholder="Mật khẩu" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit">Đăng Nhập</button>

        <p className="forgot-password"><a href="#">Quên mật khẩu?</a></p>
        
        <div className="divider">Hoặc</div>
        
        <button 
            type="button" 
            className="social-button google-btn"
            onClick={() => loginWithGoogle()} 
        >
              <i className="fab fa-google"></i> Đăng nhập bằng Google
        </button>

        <div className="register-section">
            <p>Chưa có tài khoản?</p>
            <span
                className="register-link"
                style={{cursor: 'pointer'}}
                onClick={() => navigate('/register')}
            >
                Đăng Ký Ngay
            </span>
        </div>
      </form>
     </div>
  );
};

export default Login;