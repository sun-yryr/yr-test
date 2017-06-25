# coding:utf-8

import MySQLdb

connect = MySQLdb.connect(host='localhost',user='root',db='yryr')
cursor = connect.cursor()

sql = "insert into felica values('apple', '100yen')"
cursor.execute(sql) # 1つ目のレコードを挿入
sql = "insert into felica values('orange', '150yen')"
cursor.execute(sql) # 2つ目のレコードを挿入

connect.commit()    # コミットする

sql = "select * from felica"
cursor.execute(sql)  # select文を実行

for row in cursor:
    print row[0], row[1]

sql = "delete from felica where idm = 'apple';"
cursor.execute(sql)

connect.commit()

cursor.close()
connect.close()
