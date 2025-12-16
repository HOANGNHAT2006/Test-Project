import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google'; 
import './App.css';

const Login = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false); // Thêm state cho Remember Me
    const [error, setError] = useState(''); 
    
    const navigate = useNavigate(); 

    // --- 2. LOGIC ĐĂNG NHẬP GOOGLE ---
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
                    if (rememberMe) { // Logic ghi nhớ nếu cần
                        localStorage.setItem('user_info', JSON.stringify(data.user_info));
                    } else {
                        sessionStorage.setItem('user_info', JSON.stringify(data.user_info));
                    }
                  
                    // 2. KIỂM TRA: CÓ PHẢI USER MỚI (HOẶC CHƯA ĐỔI TÊN) KHÔNG?
                    if (data.is_new_user) {
                        console.log("User mới -> Chuyển đến trang đặt tên");
                        navigate('/set-username');
                    } else {
                        // 3. NẾU USER CŨ -> ĐIỀU HƯỚNG THEO ROLE (BAO GỒM ADMIN)
                        const userInfo = data.user_info;
                        const standardizedRole = userInfo.role ? userInfo.role.toLowerCase() : '';
                        console.log("Vai trò:", standardizedRole);
                        
                        if (standardizedRole === 'admin') { 
                            navigate('/admin', { replace: true });
                        } else if (standardizedRole === 'doctor') { 
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

    // --- LOGIC ĐĂNG NHẬP THƯỜNG ---
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
                
                // Quyết định nơi lưu thông tin người dùng dựa trên rememberMe
                if (rememberMe) {
                    localStorage.setItem('user_info', JSON.stringify(data.user_info));
                } else {
                    sessionStorage.setItem('user_info', JSON.stringify(data.user_info));
                    // Lưu ý: Token vẫn dùng localStorage như quy ước của bạn
                }

                const userInfo = data.user_info;

                const standardizedRole = userInfo.role ? userInfo.role.toLowerCase() : '';
                
                if (standardizedRole === 'admin') { 
                    navigate('/admin', { replace: true });
                } else if (standardizedRole === 'doctor') {
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
                <h3>Login</h3>
            </div>
            
            <form onSubmit={handleLogin}>
                {error && <p style={{color: 'red', marginBottom: '10px'}}>{error}</p>}

                <div className="input-group">
                    <i className="fas fa-user icon"></i> 
                    <input 
                        type="text" 
                        placeholder="Email/Username" 
                        value={userName} 
                        onChange={(e) => setUserName(e.target.value)} 
                        required
                    />
                </div>
                <div className="input-group">
                    <i className="fas fa-lock icon"></i>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                {/* ĐẶT TRƯỚC NÚT SUBMIT */}
                <div className="login-options"> 
                    <div className="remember-me" onClick={() => setRememberMe(!rememberMe)}>
                        <input 
                            type="checkbox" 
                            id="remember-me" 
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            style={{ /* Đảm bảo checkbox hiển thị rõ ràng */
                                width: '15px', 
                                height: '15px', 
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.4)',
                                borderRadius: '3px'
                            }}
                        />
                        <label htmlFor="remember-me">Remember me</label>
                    </div>
                    
                    <div className="forgot-password">
                        <a href="#">Forgot Password?</a>
                    </div>
                </div>

                <button type="submit">Login</button>
                
                <div className="divider">Or</div>
                
                <button 
                    type="button" 
                    className="social-button google-btn"
                    onClick={() => loginWithGoogle()} 
                >
                    <i className="fab fa-google"></i> Login with Google
                </button>

                <button 
                    type="button" 
                    className="social-button facebook-btn" 
                    onClick={() => alert('Chức năng đăng nhập Facebook đang phát triển')} 
                >
                    <i className="fab fa-facebook"></i> Login with Facebook
                </button>

                <div className="register-section">
                    <p>Don't have an account?</p>
                    <span
                        className="register-link"
                        style={{cursor: 'pointer'}}
                        onClick={() => navigate('/register')}
                    >
                        Register
                    </span>
                </div>
            </form>
        </div>
    );
};

export default Login;