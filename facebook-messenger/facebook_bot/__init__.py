import os, sys
from flask import Flask, request
from pymessenger import Bot
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

app = Flask(__name__)
PAGE_ACCESS_TOKEN = os.environ.get("PAGE_ACCESS_TOKEN")
bot = Bot(PAGE_ACCESS_TOKEN)

cred = credentials.Certificate('C:\\firebase-sdk.json')

firebase_admin.initialize_app(cred)

db = firestore.client()

from facebook_bot import routes