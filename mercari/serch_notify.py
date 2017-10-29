#coding:utf-8
#メルカリで検索かけて指定値より安かったら表示（→通知にする）
import requests
import sys
import json
import os
from requests_oauthlib import OAuth1Session
import config

def main():
    #検索したurlベタ貼り
    url = "https://www.mercari.com/jp/search/?sort_order=&keyword=iphone7&category_root=7&category_child=100&category_grand_child%5B859%5D=1&brand_name=&brand_id=&size_group=&price_min=&price_max="
    r = requests.get(url)

    # レスポンスを確認
    if r.status_code == 200:
        alldata = r.text.split('<div class="items-box-content clearfix">')[1]
        alldata = alldata.split('<ul class="pager">')[0]
        alldata = alldata.split('<section class="items-box">')
        f = open("mer_price.txt","r")
        oldprice = f.read()
        f.close()
        os.remove("/Users/sun-mba/develop/yrtest/mercari/mer_price.txt")
        for i in range(1,11):
            data = alldata[i]
            name = data.split('<h3 class="items-box-name font-2">')[1]
            name = name.split('</h3>')[0]
            name = name.encode('utf-8')
                
            price = data.split('<div class="items-box-price font-5">')[1]
            price = price.split('</div>')[0]
            price = price.split(' ')[1].replace(',', '')
            price = price.encode('utf-8')
            
            url = data.split('href="')[1]
            url = url.split('">')[0]
            url = url.encode('utf-8')
            
            if i == 1:
                f = open("mer_price.txt","w")
                f.seek(0)
                f.write(price)
                f.close()
            
            #ここを変えることで指定値段以上・以下にする
            if (int(price) <= 40000) and (price != oldprice):
                #print (name + ":" + price)
                #print "---------------------------------------------------"
                message = "・" + name + " : " + price + "円\n#ゆるゆるめも\n" + url
                twitter(message)
            elif price == oldprice:
                break
        #print "end"
    else:
        print r.status_code

def twitter(message):
    url_tweet = "https://api.twitter.com/1.1/statuses/update.json"
    oauth = OAuth1Session(
                          config.Twi_CK,
                          config.Twi_CS,
                          config.Twi_AT,
                          config.Twi_ATS
                          )
    message = "新しい商品が出品されました！\n" + message
    params = {"status" : message}
    req = oauth.post(url_tweet, params = params)
    if req.status_code != 200:
        print ("Error: %d" % req.status_code)


if __name__ == '__main__':
    main()

