# Login ,Signup
# login - check user authenticated  , then access token
# sign up : create user
from fastapi import APIRouter  , Depends , HTTPException
from database.db import get_db
from sqlalchemy.orm import Session 
from database.Schema.schema import user
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from Service.authl3 import authenticate_user , create_token , create_user
import redis
import time
from fastapi import Request

redis_client = redis.Redis(host = "localhost" , port=6379 )
window_size = 60
Rate_limit = 5
def rate_limiting(request : Request):
    user_id = request.client.jwt
    current_time = int(time.time())
    window_key = f"rate_limit:{user_id}:{current_time//window_size}"
    try :
        request_count = redis_client.incr(window_key)
        if request_count == 1 :
            redis_client.expire(window_key , window_size)
        if request_count > Rate_limit:
             ttl = redis_client.ttl(window_key)
             raise HTTPException(
                status_code=429,
                detail=f"Rate limit exceeded. Try again in {ttl} seconds."
            )
    except redis.RedisError:
        raise HTTPException(status_code=500, detail="Redis error")
auth  = APIRouter(prefix="/auth" , dependencies= [Depends(rate_limiting)])    
@auth.post("/login")
def login(formdata :OAuth2PasswordRequestForm = Depends(), db: Session =Depends(get_db)):
    user = authenticate_user(formdata.username , formdata.password ,db)
    if not user :
        raise  HTTPException(status_code=401 , detail="user not found")
    token = create_token(user.user_id , user.username ,timedelta(minutes=30) )
    return {
        "access_token" : token,
        "token_type" : "bearer",
        
    }

@auth.post("/Signup")
def Signup(username : user , db : Session=Depends(get_db)):
    return create_user(username , db)