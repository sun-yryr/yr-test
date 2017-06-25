# coding:utf-8
import urllib
import nfc
import binascii
from time import sleep

def access(idm):
    url = "https://script.google.com/macros/s/AKfycbx1LEM5AkQpD_GCyrk9j9-d0DRM5gzD0XlqXvBHs4HtK-_0cdw/exec"

    param = [
             ( "idm", idm),
             ]

    url += "?{0}".format( urllib.urlencode( param ) )

    result = None
    try :
        result = urllib.urlopen( url ).read()
        result = result[2:7]
        print ("\n学籍番号>>>>>" + result + "\n")
        f.write(result)
        f.write("\n")
    except:
        print "アクセスに失敗しました。"

def on_connect(tag):
    print "読み込み中..."
    try:
        if isinstance(tag,nfc.tag.tt3.Type3Tag):
            idm = binascii.hexlify(tag.idm)
            access(idm)
    except:
        pass


def main():
    while 1:
        with nfc.ContactlessFrontend('usb') as clf:
            print "START"
            clf.connect(rdwr={'on-connect': on_connect})
        print "wait for 0.2 sec"
        sleep(0.2)


if __name__ == '__main__':
    print "Please input File Name>>>"
    x = raw_input()
    with open(x,"w") as f:
        main()
