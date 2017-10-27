#自分のツイートの中からRTと指定タグを検出

# coding:utf-8
import requests
import sys
from line import twi
from requests_oauthlib import OAuth1Session
import json
from time import sleep

def main(oauth):
    url_tweet = "https://api.twitter.com/1.1/statuses/update.json"
    url_read = "https://api.twitter.com/1.1/statuses/home_timeline.json"
    url_myread = "https://api.twitter.com/1.1/statuses/user_timeline.json"
    #tweet = raw_input("tweet>> ")
    #params = {"status": tweet}
    params = {
            "count":200,
            #"include_rts":False
            }
    req = oauth.get(url_myread, params = params)

    # レスポンスを確認
    if req.status_code == 200:
        timeline = json.loads(req.text)
        # 各ツイートの本文を表示
        for tweet in timeline:
            user = tweet["user"]
            if tweet["text"].find("RT") == 0:
                print(tweet["text"].split(":",1)[1])
                print("------------------------------")
            if tweet["text"].find(unicode("#ゆるゆるめも",'utf-8')) != -1:
                print("ok")
                print("------------------------------")
        #   print("[" + user["name"] + "]:" + tweet["text"])

    else:
        print ("Error: %d" % req.status_code)


if __name__ == '__main__':
    try:
        oauth = OAuth1Session(
                   twi.CK,
                   twi.CS,
                   twi.AT,
                   twi.ATS
                   )
    except:
        print "error\n"
        sys.exit(1)
        
    main(oauth)

