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
    print "読み込み中..."
    try:
        if isinstance(tag,nfc.tag.tt3.Type3Tag):
            idm = binascii.hexlify(tag.idm)
            access(idm)
    except:
        print "読み込み失敗"
        pass


def main():
    while 1:
        with nfc.ContactlessFrontend('usb') as clf:
            print "START"
            clf.connect(rdwr={'on-connect': on_connect})
        print "wait for 0.7 sec"
        sleep(0.7)


if __name__ == '__main__':
    print "MySQL connecting..."
    connect = MySQLdb.connect(host='localhost',user='root',db='yryr')
    cursor = connect.cursor()
    print "Please input File Name>>>"
    x = raw_input()
    with open(x,"w") as f:
        main()
