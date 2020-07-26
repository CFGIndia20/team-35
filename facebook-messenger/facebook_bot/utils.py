from wit import Wit
from pprint import pprint
import os

access_token = os.environ.get("WIT_ACCESS_TOKEN")

client = Wit(access_token = access_token)

def wit_response(message_text):
	resp = client.message(message_text)
	# pprint(list(resp['entities'].values())[0][0]['body'])
	try:
		return list(resp['entities'].values())[0][0]['body']
	except:
		return None


# pprint(wit_response("I live in Kanpur and there are a lot of potholes in this area."))