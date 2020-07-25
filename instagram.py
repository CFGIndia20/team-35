import requests
import time
import json
import datetime as dt
from base64 import b64encode
import base64
import re
# STEP 1: Scrap posts for a tag
arr = []

end_cursor = '' # empty for the 1st page
tag = 'safdarjung' # hashtag
page_count = 1 # desired number of pages

for i in range(0, page_count):
    url = "https://www.instagram.com/explore/tags/{0}/?__a=1&max_id={1}".format(tag, end_cursor)
    r = requests.get(url)
    data = json.loads(r.text)
    
    end_cursor = data['graphql']['hashtag']['edge_hashtag_to_media']['page_info']['end_cursor'] # value for the next page
    edges = data['graphql']['hashtag']['edge_hashtag_to_media']['edges'] # list with posts
    
    for item in edges:
       arr.append(item['node'])
       
    time.sleep(2) # insurence to not reach a time limit
    
 # save this to restart parsing with the next page

with open('posts.json', 'w') as outfile:
    json.dump(arr, outfile) # save to json
    
# Step 2: Get locations for posts
with open('posts.json', 'r') as f:
    arr = json.loads(f.read()) # load json data from previous step
    
locations = []
for item in arr:
    shortcode = item['shortcode']
    url = "https://www.instagram.com/p/{0}/?__a=1".format(shortcode)
    
    r = requests.get(url)
    try:
        data = json.loads(r.text)
        try:
            location = data['graphql']['shortcode_media']['location']['name']# get location for a post
            address = data['graphql']['shortcode_media']['location']['address_json']# get address for a post
            address = address.replace("\"", "")
            address_arr = address.split(",")
            string = ""
            for i in range(0, 5):
                spec = address_arr[i]
                spec_split = spec.split(": ")
                string += spec_split[1] + ", "
            #ad_list = address.split("\\")
            #print(ad_list)
            epoch_time = int(data['graphql']['shortcode_media']['taken_at_timestamp'])
            time = dt.datetime.fromtimestamp(epoch_time).strftime('%Y-%m-%d %H:%M:%S')
            time = time.replace("\\\"", "")
            time = json.dumps(time) #get time for a post
            image_url = data['graphql']['shortcode_media']['display_url']
            k = requests.get(image_url)
            base64_bytes = base64.b64encode(k.content)
            base64_string = base64_bytes.decode('ascii') #store image as base64
            description = data['graphql']['shortcode_media']['edge_media_to_caption']['edges'][0]['node']['text']
            description = description.replace("\n", " ")
            re.sub(r'[^\x00-\x7f]' , r'', description)
            #description.strip()
            #description = description.decode('utf-8','ignore').encode("utf-8").decode('ascii')
            #print(description)
            #description.decode('utf-8')
            #description = json.dumps(caption)
            #taglist = description.split("#")
            #for x in taglist:
            #    x = x.decode('utf-8')
            name = data['graphql']['shortcode_media']['owner']['full_name']
        except:
            location == ''
        locations.append({'location': location, 'address': string, 'created_at': time, 'image': base64_string, 'name': name, 'description': description})
    except:
        location = ''
        
with open('locations.json', 'w') as outfile:
    json.dump(locations, outfile, indent = 2) # save to json
