import os, sys
from flask import Flask, request
from pymessenger import Bot
from pprint import pprint
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from pprint import pprint
from datetime import datetime
import os
# import uuid


app = Flask(__name__)
PAGE_ACCESS_TOKEN = os.environ.get('PAGE_ACCESS_TOKEN')
bot = Bot(PAGE_ACCESS_TOKEN)

cred = credentials.Certificate('firebase-sdk.json')

firebase_admin.initialize_app(cred)

db = firestore.client()

@app.route('/', methods = ['GET'])
def verify():
	if request.args.get("hub.mode") == "subscribe" and request.args.get("hub.challenge"):
		if not request.args.get("hub.verify_token") == "hello":
			return "Verification token mismatch", 403
		return request.args["hub.challenge"], 200
	return "Hello World", 200

@app.route('/', methods = ['POST'])
def webhook():
	data = request.get_json()
	log(data)

	if data['object'] == 'page':
		for entry in data['entry']:
			for messaging_event in entry['messaging']:
				#IDs
				sender_id = messaging_event['sender']['id']
				recipient_id = messaging_event['recipient']['id']
				if messaging_event.get('message'):
					if 'text' in messaging_event['message']:
						message_text = messaging_event['message']['text']
						if 'timestamp' in messaging_event:
							timestamp = messaging_event['timestamp']
							date_object = datetime.fromtimestamp(timestamp / 1000)
							print('\n\n\n', date_object.date(), date_object.time(), '\n\n\n')
						if 'nlp' in messaging_event['message']:
							if 'entities' in messaging_event['message']['nlp']:
								loc = messaging_event['message']['nlp']['entities']
								location = list(loc.values())[0][0]['body']

								print('\n\n\n', location, '\n\n\n')
						# doc_id = uuid.uuid1()
								doc_ref = db.collection('facebook').document(sender_id)
								doc_ref.set({
									'sender_id': sender_id,
									'datetime' : str(date_object),
									'location' : location,
									'description' : message_text,
									'status' : 'received',
									'platform' : 'facebook-messenger',
									})
						response = "Thank you for taking your time to register this complaint. We are looking into the matter. Your ticket no. is 1234. You can track the status of your ticket here : facebook.com"
					elif 'attachments' in messaging_event['message']:
						img_url = messaging_event['message']['attachments'][0]['payload']['url']
						response = "Thank you for taking your time to upload the pictures, we appreciate your efforts."
					else:
						message_text = 'no text'
						response = ''
					pprint(messaging_event)
					bot.send_text_message(sender_id, response)
	return "ok", 200

def log(message):
	print(message)
	sys.stdout.flush()

if __name__ == '__main__':
	app.run(debug = True, port = 80)