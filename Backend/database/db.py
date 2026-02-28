from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from dotenv import load_dotenv
import os 

load_dotenv()
sql_path = os.getenv("sql_path")
engine = create_engine(sql_path)
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
    
     

if __name__ == "__main__":
    create_db()   
            

           
        
  