from pydantic import BaseModel
import passlib.hash as hash


class User(BaseModel):
    first_name: str
    last_name: str
    org_name: str
    email: str
    phone: str
    address: str
    password: str
    description: str
    # logo

    def verify_password(self, psword: str):
        return hash.bcrypt.verify(psword, self.password)
