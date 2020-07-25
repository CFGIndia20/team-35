import requests
import time
import json
import datetime as dt
from base64 import b64encode
import base64
import re
import random
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('firebase-sdk.json')

firebase_admin.initialize_app(cred)

db = firestore.client()
arr = []

end_cursor = ''
tag = 'safdarjung'
page_count = 3

for i in range(0, page_count):
    url = "https://www.instagram.com/explore/tags/{0}/?__a=1&max_id={1}".format(tag, end_cursor)
    r = requests.get(url)
    data = json.loads(r.text)

    try:
        end_cursor = data['graphql']['hashtag']['edge_hashtag_to_media']['page_info']['end_cursor'] # value for the next page
        edges = data['graphql']['hashtag']['edge_hashtag_to_media']['edges'] # list with posts
    
        for item in edges:
            arr.append(item['node'])
       
        time.sleep(2) # insurance to not reach a time limit

    except KeyError:
        print("Not enough pages")

with open('posts.json', 'w') as outfile:
    json.dump(arr, outfile) # save to json
    
with open('posts.json', 'r') as f:
    arr = json.loads(f.read())
    
locations = []

for item in arr:
    shortcode = item['shortcode']
    url = "https://www.instagram.com/p/{0}/?__a=1".format(shortcode)
    r = requests.get(url)
    try:
        ticket_no = str(random.randint(10000, 20000))
        data = json.loads(r.text)
        location = data['graphql']['shortcode_media']['location']['name']
        address = data['graphql']['shortcode_media']['location']['address_json']
        address = address.replace("\"", "")
        address_arr = address.split(",")
        string = ""
        for i in range(0, 5):
            spec = address_arr[i]
            spec_split = spec.split(": ")
            string += spec_split[1] + ", "

        epoch_time = data['graphql']['shortcode_media']['taken_at_timestamp']
        time = dt.datetime.fromtimestamp(epoch_time).strftime('%Y-%m-%d %H:%M:%S')
        time = json.dumps(time)
        image_url = data['graphql']['shortcode_media']['display_url']
        print(image_url)
        status = 'Received'
        k = requests.get(image_url)
        base64_bytes = base64.b64encode(k.content)
        base64_string = base64_bytes.decode('ascii')
        description = data['graphql']['shortcode_media']['edge_media_to_caption']['edges'][0]['node']['text']
        description = description.replace("\n", " ")
        re.sub(r'[^\x00-\x7f]' , r'', description)
        name = data['graphql']['shortcode_media']['owner']['full_name']
        platform = 'Instagram'
        #ticket_no = str(random.randomint(10000, 20000))
        #status = 'Received'
        locations.append({'created_at': time, 'description': description, 'location': location, 'address': string,'image': base64_string, 'platform': platform, 'sender': name, 'status': status, 'ticket_no': ticket_no})
        doc_ref = db.collection('instagram').document(shortcode)
        doc_ref.set({'created_at': time, 'description': description, 'location': location, 'address': string,'image': base64_string, 'platform': platform, 'sender': name, 'status': status, 'ticket_no': ticket_no})
    except:
        data = ''

with open('locations.json', 'w') as outfile:
    json.dump(locations, outfile, indent = 2) # save to json
