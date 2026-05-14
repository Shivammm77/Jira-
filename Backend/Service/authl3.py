# auth logic : authenticate , token creation , get current_user
from sqlalchemy.orm import Session
from database.Model.user import User
from fastapi import HTTPException , status , Depends
from datetime import timedelta , datetime
from fastapi.security import OAuth2PasswordBearer 
from database.Schema.schema import user 
from database.Model.user import User
from passlib.context import CryptContext
from jose import jwt , JWTError
from fastapi_mail import FastMail , MessageSchema , ConnectionConfig , MessageType
import hashlib

alg = "HS256"
Secret_Key = "Shivam"
bcrypt = CryptContext(schemes=['bcrypt'] , deprecated = 'auto')
oauth2 = OAuth2PasswordBearer(tokenUrl="/v1/api/auth/login")
config = ConnectionConfig(
    MAIL_USERNAME = "sonishivam12356@gmail.com",
    MAIL_PASSWORD = "hwbekqutpunqxrch",
    MAIL_FROM = "sonishivam12356@gmail.com",
    MAIL_PORT = 587,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True
)
async def send_welcome_email(email: str, username: str):
    html = f"""
   hey {username} Welcome to the community 
    """
    
    message = MessageSchema(
        subject="Welcome to Our Community!",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(config)
    await fm.send_message(message)
def authenticate_user(username: str, password: str, db: Session):
    current_user = db.query(User).filter(User.username == username).first()

    if not current_user:
        return None

    sha256_hash = hashlib.sha256(password.encode()).hexdigest()

    if not bcrypt.verify(sha256_hash, current_user.password):
        return None

    return current_user
   
def create_token(user_id:int , username  , exp : timedelta):
    encode = {"id" : user_id , "sub" : username}
    expire = datetime.now() + exp
    encode.update({'exp':expire})
    return jwt.encode(encode , Secret_Key , algorithm=alg)



def create_user(user_data: user, db: Session):
    try:
       
        username = user_data.name.strip()
        email = user_data.email.strip().lower()
        password = user_data.password.strip()

       
        if not password:
            raise HTTPException(status_code=400, detail="Password cannot be empty")

        if len(password.encode("utf-8")) > 72:
            raise HTTPException(
                status_code=400,
                detail="Password too long (max 72 bytes)"
            )

        
        sha256_hash = hashlib.sha256(password.encode()).hexdigest()
        hashed_password = bcrypt.hash(sha256_hash)

        
        new_user = User(
            username=username,
            email=email,
            password=hashed_password,
            
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user

    except HTTPException:
        raise  

    except Exception as e:
        print(f"DATABASE ERROR: {str(e)}")
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

    
def getcurrentuser(token  : Session = Depends(oauth2)):
    
    try : 
        payload  = jwt.decode(token , Secret_Key , algorithms=[alg])
        if payload is None:
            raise HTTPException(status_code=403 , detail="invalid token ")
            
        user_id = payload.get("id")
        username = payload.get("sub")
        
        return {
            "user_id" : user_id,
            "username" : username,
            
        }
    except JWTError as e :
        raise HTTPException(status_code=400 , detail="invalid token") 

    

    


