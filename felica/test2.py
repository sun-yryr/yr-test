# coding:utf-8

import urllib
import nfc
import binascii
from time import sleep
import requests

def access(idm):
    print "Please input s*****>>>"
    x = raw_input()
    url = "https://script.google.com/macros/s/AKfycbx1LEM5AkQpD_GCyrk9j9-d0DRM5gzD0XlqXvBHs4HtK-_0cdw/exec"
    s = requests.session()
    params = {"idm":idm, "s" : x }
    r =  s.post(url, data=params)

def on_connect(tag):
    print tag
    
    try:
        if isinstance(tag,nfc.tag.tt3.Type3Tag):
            idm = binascii.hexlify(tag.idm)
            access(idm)
    except:
        pass
    print "END"


def main():
    while 1:
        with nfc.ContactlessFrontend('usb') as clf:
            print "START"
            clf.connect(rdwr={'on-connect': on_connect})
        print "wait for 1 sec"
        sleep(1)


if __name__ == '__main__':
    main()
