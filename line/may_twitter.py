# coding:utf-8
#自分のツイートの中からRTと指定タグを検出
import requests
import sys
import json
from requests_oauthlib import OAuth1Session
import config

def main(oauth):
    url_tweet = "https://api.twitter.com/1.1/statuses/update.json"
    url_read = "https://api.twitter.com/1.1/statuses/home_timeline.json"
    url_myread = "https://api.twitter.com/1.1/statuses/user_timeline.json"
    
    f = open("id.txt","r+")
    Twi_id = f.read()
    
    params = {
            "user_id":3404290100,
            "count":20,
            "since_id":Twi_id,
            #"include_rts":False
            }
    req = oauth.get(url_myread, params = params)

    # レスポンスを確認
    if req.status_code == 200:
        timeline = json.loads(req.text)
        # 各ツイートの本文を表示
        for tweet in reversed(timeline):
            user = tweet["user"]
            toukou = "[" + user["name"] + "]\n" + tweet["text"]
            notify(toukou)
        if len(timeline) != 0:
            f.seek(0)
            f.write(str(tweet["id"]))
    else:
        print ("Error: %d" % req.status_code)
    f.close


def notify(text):
    url = "https://notify-api.line.me/api/notify"
    token = config.LINE_token
    headers = {"Authorization" : "Bearer" + " " + token}
    payload = {"message" :  text}
    
    r = requests.post(url ,headers = headers ,params=payload)


if __name__ == '__main__':
    try:
        oauth = OAuth1Session(
                   config.Twi_CK,
                   config.Twi_CS,
                   config.Twi_AT,
                   config.Twi_ATS
                   )
    except:
        print "oauth error\n"
        sys.exit(1)

    main(oauth)

