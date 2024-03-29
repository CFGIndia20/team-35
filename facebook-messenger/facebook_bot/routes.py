from flask import request
from pprint import pprint
from datetime import datetime
from facebook_bot import app, db, bot
import os, sys
import random
from facebook_bot.utils import wit_response
import base64
import wget



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
						response = ''
						if 'timestamp' in messaging_event:
							timestamp = messaging_event['timestamp']
							date_object = datetime.fromtimestamp(timestamp / 1000)
							# print('\n\n\n', date_object.date(), date_object.time(), '\n\n\n')
						if 'nlp' in messaging_event['message']:
							if 'entities' in messaging_event['message']['nlp']:
								loc = messaging_event['message']['nlp']['entities']
								location = list(loc.values())[0][0]['body']

								# print('\n\n\n', location, '\n\n\n')
								category = wit_response(message_text)
								doc_ref = db.collection('all-reports').document(sender_id)
								ticket_id = ''.join([str(random.randint(0, 999)).zfill(3) for _ in range(2)])
								doc_ref.set({
									'sender': sender_id,
									'date' : str(date_object),
									'location' : location,
									'description' : message_text,
									'status' : 'received',
									'platform' : 'facebook',
									'ticket_no' : ticket_id,
									'media_url' : '',
									'category' : category
									})
								response = "Thank you for taking your time to register this complaint. We are looking into the matter. Your ticket no. is " + ticket_id + " You can track the status of your ticket here : facebook.com"
					elif 'attachments' in messaging_event['message']:
						img_url = messaging_event['message']['attachments'][0]['payload']['url']
						local_image_filename = wget.download(img_url, 'img.jpg')
						with open("img.jpg", "rb") as img_file:
						    my_string = base64.b64encode(img_file.read()).decode('utf-8')
						print('\n\n\n',my_string, '\n\n\n')
						doc_ref = db.collection('all-reports').document(sender_id)
						doc_ref.update({'media_url': my_string})
						response = "Thank you for taking your time to upload the pictures, we appreciate your efforts."
					else:
						message_text = 'no text'
						response = ''
					pprint(response)
					bot.send_text_message(sender_id, response)
	return "ok", 200

def log(message):
	print(message)
	sys.stdout.flush()
