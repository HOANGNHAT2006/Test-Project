import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SetUsername: React.FC = () => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const token = localStorage.getItem('token'); // Lấy token tạm từ lúc login
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/users/set-username', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ new_username: username })
            });

            const data = await response.json();

            if (response.ok) {
                // QUAN TRỌNG: Lưu lại token mới (chứa username mới)
                localStorage.setItem('token', data.new_access_token);
                
                alert("Cập nhật tên người dùng thành công!");
                navigate('/dashboard'); // Chuyển vào trang chủ
            } else {
                setError(data.detail || "Có lỗi xảy ra, vui lòng thử lại.");
            }
        } catch (err) {
            setError("Không thể kết nối đến server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.logoArea}>
                    <img src="/logo.svg" alt="Logo" style={{width: '60px', marginBottom: '10px'}} />
                    <h2 style={{margin: 0, color: '#007bff'}}>Hoàn tất hồ sơ</h2>
                </div>
                
                <p style={styles.text}>
                    Xin chào! Để sử dụng hệ thống, bạn cần tạo một <strong>Tên người dùng (Username)</strong> duy nhất. 
                    Tên này sẽ được dùng làm định danh API của bạn.
                </p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={{textAlign: 'left', width: '100%', marginBottom: '5px'}}>
                        <label style={{fontSize: '14px', fontWeight: 'bold', color: '#555'}}>Tên người dùng mong muốn:</label>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Ví dụ: nguyenvanan123" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value.trim())}
                        style={styles.input}
                        required
                        minLength={3}
                    />
                    
                    {error && <div style={styles.error}>{error}</div>}

                    <button type="submit" style={styles.button} disabled={isLoading}>
                        {isLoading ? 'Đang xử lý...' : 'Xác nhận & Truy cập'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f6f9', fontFamily: "'Segoe UI', sans-serif" },
    card: { backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', width: '400px', textAlign: 'center' },
    logoArea: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' },
    text: { color: '#666', fontSize: '15px', lineHeight: '1.5', marginBottom: '30px' },
    form: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
    input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box' },
    button: { width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' },
    error: { color: '#dc3545', fontSize: '14px', marginBottom: '15px', backgroundColor: '#ffeaea', padding: '10px', borderRadius: '5px', width: '100%' }
};

export default SetUsername;