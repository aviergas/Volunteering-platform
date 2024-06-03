from fastapi import FastAPI
# from pymongo.mongo_client import MongoClient
# from pymongo.server_api import ServerApi
from fastapi.middleware.cors import CORSMiddleware

from routes.route import router

app = FastAPI()

# uri = "mongodb+srv://VolunteeringApp:Qz0gKFs6r39hIKJ4@volunteering.glyuuhq.mongodb.net/?retryWrites=true&w=majority&appName=Volunteering"

# # Create a new client and connect to the server
# client = MongoClient(uri, server_api=ServerApi('1'))

# # Send a ping to confirm a successful connection
# try:
#     client.admin.command('ping')
#     print("Pinged your deployment. You successfully connected to MongoDB!")
# except Exception as e:
#     print(e)

origins = ["http://localhost:3000", "localhost:3000"]

app.add_middleware(CORSMiddleware,
                   allow_origins=origins,
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"]
                   )

app.include_router(router)
