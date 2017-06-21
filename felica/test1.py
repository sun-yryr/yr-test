import nfc
import binascii
from time import sleep


def on_connect(tag):
    print tag
    
    if isinstance(tag,nfc.tag.tt3.Type3Tag):
        idm = binascii.hexlify(tag.idm)
        f.write(idm)
        f.write("\n")
    print "END"


def main():
    while 1:
        with nfc.ContactlessFrontend('usb') as clf:
            print "START"
            clf.connect(rdwr={'on-connect': on_connect})
        print "wait for 1 sec"
        sleep(1)


if __name__ == '__main__':
    with open("test.txt","w") as f:
        main()
