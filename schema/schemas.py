# def individual_user_serial(simple_user) -> dict:
#     return {
#         "id": str(simple_user["_id"]),
#         "first_name": str(simple_user["first_name"]),
#         "last_name": simple_user["last_name"],
#         "phone_number": simple_user["phone_number"],
#         "email": simple_user["email"],
#         "password": simple_user["password"],
#         "hometown": simple_user["hometown"],
#         "gender": simple_user["gender"]

#     }


# def user_list_serial(simple_users) -> list:
#     return [individual_user_serial(user) for user in simple_users]

# ____________________________ORGS____________________________________

def individual_user_serial(user) -> dict:
    return {
        "id": str(user["_id"]),
        "first_name": str(user["first_name"]),
        "last_name": str(user["last_name"]),
        "org_name": str(user["org_name"]),
        "description": user["description"],
        "phone": user["phone"],
        "address": user["address"],
        "email": user["email"],
        "password": user["password"]
    }


def user_list_serial(users) -> list:
    return [individual_user_serial(user) for user in users]


# ____________________________POSTS____________________________________


def individual_post_serial(post) -> dict:
    return {
        "id": str(post["_id"]),
        "organization_name": str(post["organization_name"]),
        "contact_first_name": post["contact_first_name"],
        "description": post["description"],
        "date_of_start": post["date_of_start"],
        "date_of_finish": post["date_of_finish"],
        # "contact_first_name": post["contact_first_name"],
        # "contact_last_name": post["contact_last_name"],
        "times": post["times"],
        "phone_number": post["phone_number"],
        "address": post["address"]
    }


def post_list_serial(posts) -> list:
    return [individual_post_serial(post) for post in posts]
