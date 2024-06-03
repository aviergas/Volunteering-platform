from pydantic import BaseModel


class Vpost(BaseModel):
    organization_name: str
    contact_first_name: str
    description: str
    date_of_start: str
    date_of_finish: str
    times: str
    phone_number: str
    address: str
