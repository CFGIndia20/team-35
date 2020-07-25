import os, sys
from flask import Flask, request
# from utils import wit_response
from pymessenger import Bot
from pprint import pprint

app = Flask(__name__)
PAGE_ACCESS_TOKEN = "EAAG06SC6KRMBAHNmQJehtB5GNlMsZA8nX77IZCQYfPy4HLxPIVsIN2bmU2C3JeAkdEOzepQXkVuaJEjWw1qj8zGxbUWaJ0geB9BVNCUrswMwUL6kzkZCruwXsIBPWzkZAnbTrFnTWOhvJSCJbpclDoABplEg31rBbjrSsya1ZCgZDZD"
bot = Bot(PAGE_ACCESS_TOKEN)

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
	# log(data)

	if data['object'] == 'page':
		for entry in data['entry']:
			for messaging_event in entry['messaging']:
				#IDs
				sender_id = messaging_event['sender']['id']
				recipient_id = messaging_event['recipient']['id']
				if messaging_event.get('message'):
					if 'text' in messaging_event['message']:
						message_text = messaging_event['message']['text']
					elif 'attachments' in messaging_event['message']:
						img_url = messaging_event['message']['attachments'][0]['payload']['url']
					else:
						message_text = 'no text'
					response = "Thank you for taking your time to register this complaint. We are looking into the matter. Your ticket no. is 1234. You can track the status of your ticket here : facebook.com"
					# entity, value = wit_response(message_text)
					# print(entity, value)
					# if entity == 'helpstart':
					# 	response = "Please describe your problem in detail"
					# elif entity == "help":
					# 	response = "Please enter the location of the problem"
					# elif entity == "location":
					# 	response = "Ok I see you live in "+ str(value)
					# if response == "None":
					# 	response = "I didnt understaand you"
					#response = message_text
					print(messaging_event)
					# try:
					bot.send_text_message(sender_id, response)
					# except:
					# 	print("error")
	return "ok", 200

def log(message):
	print(message)
	sys.stdout.flush()

if __name__ == '__main__':
	app.run(debug = True, port = 80)