# -*- coding: utf-8 -*-
"""
Created on Tue Jun 16 11:50:20 2020

@author: shruti yadav
"""

import numpy as np
import pandas as pd
import itertools
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import PassiveAggressiveClassifier
from sklearn.metrics import accuracy_score, confusion_matrix
import emoji
import re
import nltk
import json

import requests
import firebase_admin
from firebase_admin import credentials 
#from firebase_admin import firestore
nltk.download('words')
words=set(nltk.corpus.words.words())
df=pd.read_csv('cd_mumbai_complaints.csv',encoding='ISO-8859-1')
#df=df.head(1000)
df['created_at']=df['created_at'].astype(str)  #changing to string datatype
df.dropna(axis=0,how='any',inplace=True)
df=df.reset_index()
df=df.replace([np.inf,-np.inf],np.nan)
print(df['created_at'].isnull().sum())
print(df.shape)
print(df.head())
labels=df.category_id
print("Labels head")
print(labels.head())
print(df[df.isin([np.nan,np.inf,-np.inf]).any(1)])
print(df.shape)
print(df.head(300))
contractions = { 
"ain't": "am not",
"aren't": "are not",
"can't": "cannot",
"can't've": "cannot have",
"'cause": "because",
"could've": "could have",
"couldn't": "could not",
"couldn't've": "could not have",
"didn't": "did not",
"doesn't": "does not",
"don't": "do not",
"hadn't": "had not",
"hadn't've": "had not have",
"hasn't": "has not",
"haven't": "have not",
"he'd": "he would",
"he'd've": "he would have",
"he'll": "he will",
"he's": "he is",
"how'd": "how did",
"how'll": "how will",
"how's": "how is",
"i'd": "i would",
"i'll": "i will",
"i'm": "i am",
"i've": "i have",
"isn't": "is not",
"it'd": "it would",
"it'll": "it will",
"it's": "it is",
"let's": "let us",
"ma'am": "madam",
"mayn't": "may not",
"might've": "might have",
"mightn't": "might not",
"must've": "must have",
"mustn't": "must not",
"needn't": "need not",
"oughtn't": "ought not",
"shan't": "shall not",
"sha'n't": "shall not",
"she'd": "she would",
"she'll": "she will",
"she's": "she is",
"should've": "should have",
"shouldn't": "should not",
"that'd": "that would",
"that's": "that is",
"there'd": "there had",
"there's": "there is",
"they'd": "they would",
"they'll": "they will",
"they're": "they are",
"they've": "they have",
"wasn't": "was not",
"we'd": "we would",
"we'll": "we will",
"we're": "we are",
"we've": "we have",
"weren't": "were not",
"what'll": "what will",
"what're": "what are",
"what's": "what is",
"what've": "what have",
"where'd": "where did",
"where's": "where is",
"who'll": "who will",
"who's": "who is",
"won't": "will not",
"wouldn't": "would not",
"you'd": "you would",
"you'll": "you will",
"you're": "you are",
"thx"   : "thanks"
}
def remove_contractions(text):
    return contractions[text.lower()] if text.lower() in contractions.keys() else text
df['created_at']=df['created_at'].apply(remove_contractions)
print(df.head())

def clean_dataset(text):
    # Remove hashtag while keeping hashtag text
    text = re.sub(r'#','', text)
    # Remove HTML special entities (e.g. &amp;)
    text = re.sub(r'\&\w*;', '', text)
    # Remove tickers
    text = re.sub(r'\$\w*', '', text)
    # Remove hyperlinks
    text = re.sub(r'https?:\/\/.*\/\w*', '', text)
    # Remove whitespace (including new line characters)
    text = re.sub(r'\s\s+','', text)
    text = re.sub(r'[ ]{2, }',' ',text)
    # Remove URL, RT, mention(@)
    text=  re.sub(r'http(\S)+', '',text)
    text=  re.sub(r'http ...', '',text)
    text=  re.sub(r'(RT|rt)[ ]*@[ ]*[\S]+','',text)
    text=  re.sub(r'RT[ ]?@','',text)
    text = re.sub(r'@[\S]+','',text)
    # Remove words with 4 or fewer letters
    text = re.sub(r'\b\w{1,4}\b', '', text)
    #&, < and >
    text = re.sub(r'&amp;?', 'and',text)
    text = re.sub(r'&lt;','<',text)
    text = re.sub(r'&gt;','>',text)
    # Remove characters beyond Basic Multilingual Plane (BMP) of Unicode:
    text= ''.join(c for c in text if c <= '\uFFFF') 
    text = text.strip()
    # Remove misspelling words
    text = ''.join(''.join(s)[:2] for _, s in itertools.groupby(text))
    # Remove emoji
    text = emoji.demojize(text)
    text = text.replace(":"," ")
    text = ' '.join(text.split()) 
    text = re.sub("([^\x00-\x7F])+"," ",text)
    # Remove Mojibake (also extra spaces)
    text = ' '.join(re.sub("[^\u4e00-\u9fa5\u0030-\u0039\u0041-\u005a\u0061-\u007a]", " ", text).split())
    text=''.join(w for w in nltk.wordpunct_tokenize(text) if w.lower() in words or not w.isalpha())
    return text

df['created_at'] =df['created_at'].apply(clean_dataset)
print(df.head())
print(df.shape)

x_train,x_test,y_train,y_test=train_test_split(df['created_at'], labels, test_size=0.2, random_state=7)

#DataFlair - Initialize a TfidfVectorizer
from sklearn.feature_extraction.text import CountVectorizer

vectorizer = CountVectorizer()
vectorizer.fit(x_train)
d=df.replace([np.inf,-np.inf],np.nan)
X_train = vectorizer.transform(x_train)
X_test  = vectorizer.transform(x_test)


#from sklearn.neighbors import KNeighborsClassifier 
#knn = KNeighborsClassifier(n_neighbors = 15).fit(X_train, y_train) 

# accuracy on X_test 
#accuracy = knn.score(X_test, y_test) 
#print (accuracy )

# creating a confusion matrix 
#knn_predictions = knn.predict(X_test) 
#print(knn_predictions)
#cm = confusion_matrix(y_test, knn_predictions) 


from sklearn.naive_bayes import MultinomialNB
clf = MultinomialNB().fit(X_train, y_train)
predicted = clf.predict(X_test)
print(np.mean(predicted == y_test))
from sklearn.linear_model import SGDClassifier
clf = SGDClassifier().fit(X_train, y_train)


predicted = clf.predict(X_test)

print(predicted)
print(np.mean(predicted == y_test))

#testing
def predict_category(text):
    print("issue:" +text)
    
    data = {'created_at':
        [text]}
    test_df=pd.DataFrame(data)
    
    test_df['created_at']=test_df['created_at'].apply(remove_contractions)
    ## Clean Data set
    test_df['created_at'] =test_df['created_at'].apply(clean_dataset)
    X_test  = vectorizer.transform(test_df['created_at'])
    test_df['category']=clf.predict(X_test)
    #print(y_pred)
    #import pdb;pdb.set_trace()
    print(test_df)
     #converting to json
    json=test_df.to_json()
    print(json)
#cred=credentials.Certificate('C:/Users/shruti yadav/Downloads/firebase-sdk.json')
#firebase_admin.initialize_app(cred)
#db=firestore.client()

#users_ref=db.collection('whatsapp')
response=requests.get("https://firestore.googleapis.com/v1/projects/cfgtest-36a9e/databases/(default)/documents/whatsapp?key=AIzaSyAKehNIq0yCW8_cfWNEpVqv8oG195wLupU")
data=response.json()
print(type(data))
print(data)
for item in data["documents"]:
    print(item["fields"]["description"]["stringValue"])
    predict_category(item["fields"]["description"]["stringValue"])
    
predict_category("Garbage is not desposed.")
#import pdb;pdb.set_trace()








