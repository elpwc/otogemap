import json
import pymysql

from private import HOST, USER, PASS, DBNAME

conn = pymysql.connect(
    host=HOST,
    user=USER,
    password=PASS,
    database=DBNAME,
    charset="utf8mb4"
)
cursor = conn.cursor()

dir = './'

with open(dir + "store.json", "r", encoding="utf-8") as file:
    data = json.load(file)

for row in data:
    sql = "INSERT INTO store (id, name, `desc`, address, mapURL, country, adminlv1, adminlv2, adminlv3, adminlv4, adminlv5, arcade_amount, business_hours_start, business_minute_start, business_hours_end, business_minute_end, lng, lat, type, reviewed, is_deleted) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    values = (
        row["id"], row["name"], row["desc"], row["address"], row["mapURL"], row["country"], row["adminlv1"], row["adminlv2"], row["adminlv3"], row["adminlv4"], row["adminlv5"], row["arcade_amount"], row["business_hours_start"], row["business_minute_start"], row["business_hours_end"], row["business_minute_end"], row["lng"], row["lat"], row["type"], row["reviewed"], row["is_deleted"]
    )
    cursor.execute(sql, values)

print("store done")

with open(dir + "arcade.json", "r", encoding="utf-8") as file:
    data = json.load(file)

for row in data:
    sql = "INSERT INTO arcade (id, type, version_type, sid, arcade_amount, is_deleted, is_official, reviewed) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
    values = (
        row["id"], row["type"], row["version_type"], row["sid"], row["arcade_amount"], row["is_deleted"], row["is_official"], row["reviewed"]
    )
    cursor.execute(sql, values)

# 提交并关闭连接
conn.commit()
cursor.close()
conn.close()

print("arcade done")
