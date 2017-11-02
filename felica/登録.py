# coding:utf-8

import urllib
import nfc
import binascii
from time import sleep
import requests
import MySQLdb

def access(tag):
    idm = binascii.hexlify(tag.idm)
    print "学籍番号を入力>>>"
    x = raw_input()
    sql = "insert into felica values('" + idm + "', '" + x + "')"
    cursor.execute(sql)
    connect.commit()

def main():
    while 1:
        with nfc.ContactlessFrontend('usb') as clf:
            print "タッチしてください"
            target_req = nfc.clf.RemoteTarget("212F")
            target_req.sensf_req = bytearray.fromhex("0000030000")
            while 1:
                target_res = clf.sense(target_req,iterations=10,interval=0.01)
                if target_res != None:
                    tag = nfc.tag.activate(clf,target_res)
                    tag.sys = 3
                    access(tag)
                    break
        sleep(0.7)

if __name__ == '__main__':
    print "MySQL connecting..."
    connect = MySQLdb.connect(host='localhost',user='root',db='yryr')
    cursor = connect.cursor()
    main()
