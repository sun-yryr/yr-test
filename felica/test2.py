# coding:utf-8

import urllib
import nfc
import binascii
from time import sleep
import requests
import MySQLdb

def access(idm):
    print "学籍番号を入力>>>"
    x = raw_input()
    sql = "insert into felica values('" + idm + "', '" + x + "')"
    cursor.execute(sql)
    connect.commit()

def on_connect(tag):
    print tag
    
    try:
        if isinstance(tag,nfc.tag.tt3.Type3Tag):
            idm = binascii.hexlify(tag.idm)
            access(idm)
    except:
        pass


def main():
    while 1:
        with nfc.ContactlessFrontend('usb') as clf:
            print "タッチしてください"
            clf.connect(rdwr={'on-connect': on_connect})
        sleep(1)


if __name__ == '__main__':
    print "MySQL connecting..."
    connect = MySQLdb.connect(host='localhost',user='root',db='yryr')
    cursor = connect.cursor()
    main()
