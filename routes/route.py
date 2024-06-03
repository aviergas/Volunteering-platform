from fastapi import APIRouter
from fastapi import security
import fastapi
from bson import ObjectId
# from models.simple_user import SimpleUser
from models.user import User
# from models.organization import OrgUser
from models.volunteering_post import Vpost
from config.database import users, published_posts
from schema.schemas import user_list_serial, post_list_serial, individual_user_serial
from bson.json_util import dumps
import json
# import passlib.hash as hash
import jwt

JWT_SECRET = "THIS NEEDS TO BE IN .env FILE !!!!"

router = APIRouter()


# ___________________USERS__________________________
#   get all users in database
@router.get("/users/")
async def get_users():
    return user_list_serial(users.find())


#   get current user
@router.get("/users/me")
async def get_my_user(token: str = fastapi.Depends(security.OAuth2PasswordBearer(tokenUrl="/token/"))):
    payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    user = users.find_one({"email": payload["email"]})
    print(user)
    print(dumps(user))
    return json.loads(dumps(user))


#   get user by email in database
@router.get("/users/{email}")
async def get_user_by_email(email: str):

    found = users.find_one({"email": email})

    if found:
        # print(found)
        # print(dumps(found))
        # print(json.loads(dumps(found)))
        return json.loads(dumps(found))
    else:
        return {"found": "False"}


#
#   add new user to database
@router.post("/users/")
async def add_user(user: User):
    # if not user.first_name.isalpha() or not user.last_name.isalpha():
    #     return {"error": "name must contain letters only"}

    # if not user.phone_number.isdigit():
    #     return {"error": "phone number must contain digits only"}

    # if '@' not in user.email or '.' not in user.email:
    #     return {"error": "invalid email"}
    # #   password hashing ? done here or in react ?
    users.insert_one(dict(user))


#   update a user in database
@router.put("/users/{id}")
async def put_user(id: str, user: User):
    users.find_one_and_update({"_id": ObjectId(id)}, {"$set": dict(user)})
    return {"user": "added"}


#   delete
@router.delete("/users/{id}")
async def delete_user(id: str):
    users.find_one_and_delete({"_id": ObjectId(id)})


# # ___________________ORGS__________________________
# #   get all users in database
# @router.get("/orgs/")
# async def get_org_users():
#     users = org_list_serial(organization_users.find())
#     return users


# #   add new user to database
# @router.post("/orgs/")
# async def add_org_user(user: OrgUser):
#     organization_users.insert_one(dict(user))


# #   delete
# @router.delete("/orgs/{id}")
# async def delete_org_user(id: str):
#     organization_users.find_one_and_delete({"_id": ObjectId(id)})


# ___________________POSTS__________________________
#   get all posts in database
@router.get("/posts/")
async def get_posts():
    posts = post_list_serial(published_posts.find())
    return posts


@router.get("/posts/my")
async def get_my_posts(token: str = fastapi.Depends(security.OAuth2PasswordBearer(tokenUrl="/token/"))):
    payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    posts = post_list_serial(published_posts.find({"organization_name": payload["org_name"]}))
    return posts


#   add new post to database
@router.post("/posts/")
async def add_post(post: Vpost):
    published_posts.insert_one(dict(post))


#   delete
@router.delete("/posts/{id}")
async def delete_published_post(id: str):
    published_posts.find_one_and_delete({"_id": ObjectId(id)})


#
#
#
#


@router.post("/token/")
async def generate_token(form_data: security.OAuth2PasswordRequestForm = fastapi.Depends()):

    email = form_data.username
    user = await get_user_by_email(email)
    if not user:
        raise fastapi.HTTPException(status_code=401,
                                    detail="invalid credetials")
    # if not user.verify_password(form_data.password):
    #     raise fastapi.HTTPException(status_code=401,
    #                                 detail="invalid credetials")

    user_dict = individual_user_serial(user)
    token = jwt.encode(user_dict, JWT_SECRET, algorithm="HS256")
    return dict(access_token=token, token_type="bearer")
    #   add user authentication ?
