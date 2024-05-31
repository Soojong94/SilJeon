from dbutils.pooled_db import PooledDB
import pymysql

# 커넥션 풀 설정
pool = PooledDB(
    creator=pymysql,  # 사용할 DBMS
    maxconnections=10,  # 최대 커넥션 수
    mincached=2,       # 초기에 생성할 커넥션 수
    maxcached=6,       # 최대로 유지할 커넥션 수
    maxusage=None,     # 한 커넥션에 최대 사용 횟수
    blocking=True,     # 커넥션 수가 부족할 때 블로킹할지 여부
    host='project-db-cgi.smhrd.com',
    user='campus_23K_AI18_p3_3',
    password='smhrd3',
    db='campus_23K_AI18_p3_3',
    charset='utf8',
    port=3307
)

def connect_db():
    return pool.connection()

