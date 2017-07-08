# coding:utf-8
import urllib
import nfc
import binascii
import MySQLdb
from time import sleep
import sys

def access(idm):
    sql = "select * from felica where idm = '" + idm + "'"
    cursor.execute(sql)
    for row in cursor:
        print ("\n学籍番号>>>>>" + row[1] + "\n")
        f.write(row[1])
        f.write("\n")

def on_connect(tag):
    idm = binascii.hexlify(tag.idm)
    access(idm)


def main():
    while 1:
        with nfc.ContactlessFrontend('usb') as clf:
            print "タッチしてください"
            target_req = nfc.clf.RemoteTarget("212F")
            target_req.sensf_req = bytearray.fromhex("000003000")
            while 1:
                target_res = clf.sense(target_req,iterations=10,interval=0.01)
                    if target_res != None:
                        tag = nfc.tag.tt3.Type3Tag(clf,target_res)
                        tag.sys = 3
                        on_connect(tag)
                        break
        sleep(0.7)


if __name__ == '__main__':
    print "MySQL connecting..."
    connect = MySQLdb.connect(host='localhost',user='root',db='yryr')
    cursor = connect.cursor()
    print "Please input File Name>>>"
    x = raw_input()
    with open(x,"w") as f:
        main()
