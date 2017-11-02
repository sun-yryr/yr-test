# coding:utf-8
import urllib
import nfc
import binascii
from time import sleep
import sys

def access(tag):
    idm = binascii.hexlify(tag.idm)
    fwrite(idm)


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
    with open(x,"w") as f:
        main()
