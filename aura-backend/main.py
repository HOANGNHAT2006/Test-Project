# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt 

app = FastAPI()

# 1. Cấu hình CORS
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Kết nối Database
MONGO_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)
db = client.aura_db
users_collection = db.users

# 3. Dữ liệu đầu vào 
class LoginRequest(BaseModel):
    userName: str
    password: str

class RegisterRequest(BaseModel):
    userName: str
    password: str
    role: str = "USER"

@app.post("/api/register")
async def register(data: RegisterRequest):
    existing_user = await users_collection.find_one({"userName": data.userName})
    if existing_user:
        raise HTTPException(status_code=400,details="Tên tài khoản đã được sử dụng")
    hashed_password = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt())
    new_user = {
        "userName": data.userName,
        "password": hashed_password.decode('utf-8'),
        "role": data.role
    }

    await users_collection.insert_one(new_user)
    return {"Tạo tài khoản thành công!"}
    
# --- API ĐĂNG NHẬP (BẢN FINAL ĐÃ FIX LỖI 500) ---
@app.post("/api/login")
async def login(data: LoginRequest):
    # Bước 1: Tìm user
    user = await users_collection.find_one({"userName": data.userName})
    
    if not user:
        raise HTTPException(status_code=400, detail="Tên tài khoản không tồn tại")
    
    # Bước 2: Chuẩn bị dữ liệu mật khẩu
    try:
        password_input = data.password.encode('utf-8') 
        password_hash = user["password"].encode('utf-8')
    except Exception as e:
        print(f"Lỗi dữ liệu: {e}")
        raise HTTPException(status_code=500, detail="Lỗi dữ liệu mật khẩu trong Database")

    # Bước 3: Kiểm tra mật khẩu (So sánh trực tiếp)
    # Lưu ý: checkpw không bao giờ gây lỗi, nó chỉ trả về True/False
    is_correct = bcrypt.checkpw(password_input, password_hash)
    
    # Đưa đoạn kiểm tra này ra ngoài try/except để tránh bị bắt nhầm thành lỗi 500
    if not is_correct:
         raise HTTPException(status_code=400, detail="Sai mật khẩu")

    # Bước 4: Thành công -> Trả về kết quả
    return {
        "message": "Đăng nhập thành công",
        "access_token": "fake_token_123456",
        "user_info": {
            "full_name": user.get("full_name"),
            "role": user.get("role"),
            "userName": user["userName"]
        }
    }