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
alg = "HS256"
Secret_Key = "Shivam"
bcrypt = CryptContext(schemes=['bcrypt'] , deprecated = ['auto'])
oauth2 = OAuth2PasswordBearer(tokenUrl="/v1/api/auth/login")
def authenticate_user(username : str , password:str , db:Session):
    current_user = db.query(User).filter(User.username == username).first()
    
    if not current_user  or not bcrypt.verify( password, current_user.password ):
        raise HTTPException(status_code=400 , detail="user not found")
    return current_user
def create_token(user_id:int , username  , exp : timedelta):
    encode = {"id" : user_id , "sub" : username}
    expire = datetime.now() + exp
    encode.update({'exp':expire})
    return jwt.encode(encode , Secret_Key , algorithm=alg)

def create_user(user : user , db : Session):
    new_user = User(
        username = user.name,
        email = user.email,
        password = bcrypt.hash(user.password),
        create_at = user.created_at
   )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
    
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

    

    


