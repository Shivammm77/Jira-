from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from dotenv import load_dotenv
import os 

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL1")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autoflush=False , autocommit = False , bind= engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try : 
        yield db
    finally :
        db.close()
def create_db():
    Base.metadata.create_all(bind = engine)
    
create_db()     


     
            

           
        
  