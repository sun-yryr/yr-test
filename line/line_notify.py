# coding:utf-8
import requests
import time
from line import line

def main():
    url = "https://notify-api.line.me/api/notify"
    token = line.token
    headers = {"Authorization" : "Bearer" + " " + token}
    payload = {"message" :  time.strftime("%m月%d日/%H:%M:%S",)}
    
    r = requests.post(url ,headers = headers ,params=payload)


if __name__ == '__main__':
    main()
