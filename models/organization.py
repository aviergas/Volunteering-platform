from pydantic import BaseModel
# import datetime as _dt
# import passlib.hash as _hash


class OrgUser(BaseModel):
    org_name: str
    email: str
    phone: str
    contact_first_name: str
    contact_last_name: str
    address: str
    password: str
    description: str
    # logo
