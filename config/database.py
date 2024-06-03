from pymongo import MongoClient

client = MongoClient("mongodb+srv://VolunteeringApp:Qz0gKFs6r39hIKJ4@volunteering.glyuuhq.mongodb.net/?retryWrites=true&w=majority&appName=Volunteering")

posts_db = client.posts_db

users_db = client.users_db

users = users_db["org_users"]

published_posts = posts_db["posts"]
