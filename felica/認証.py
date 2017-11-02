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
        print ("\n学籍番号>>>>>" + str(row[1]) + "\n")
        f.write(str(row[1]))
        f.write("\n")

def on_connect(tag):
    if isinstance(tag,nfc.tag.tt3.Type3Tag):
        idm = binascii.hexlify(tag.idm)
        access(idm)



def main():
    while 1:
        with nfc.ContactlessFrontend('usb') as clf:
            print "タッチしてください"
            clf.connect(rdwr={'on-connect': on_connect})
        sleep(0.7)


if __name__ == '__main__':
    print "MySQL connecting..."
    connect = MySQLdb.connect(host='localhost',user='root',db='yryr')
    cursor = connect.cursor()
    print "Please input File Name>>>"
    x = raw_input()
    with open(x,"w") as f:
        main()
