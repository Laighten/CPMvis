### chinaVis 2020 挑战赛（三等奖）

- 仓库地址：[https://github.com/sinpor/chinaVis2020.git](https://github.com/sinpor/chinaVis2020.git)

### 前端部署

#### 必备软件：

- node：>8, [地址](https://nodejs.org/zh-cn/)，最好选择LTS版本
- yarn: <2, [地址](https://classic.yarnpkg.com/en/docs/install)
- git

部署流程：

``` shell
cd ./front_end
# 安装依赖
yarn

# 本地启动
yarn start
# http://localhost:3300(或其他端口，即使占用也无需配置)
```
### 后端部署

#### 1、文件夹说明
```
1、获得的数据存放到Data_CSV 
2、mongodb_data是Mongodb数据库
3、Django_backend为Danggo搭建的后台
4、Crawler为爬虫code
```
#### 2、后台Django框架说明：
必备软件：
- mongodb v3.7.3 其他版本也行
- python 3.0以上

部署流程：
``` 下载完成后按以下版本安装python库
#安装库：pip install Django==2.0.6
版本要求：
  Django 2.0.6 
  django-cors-headers 2.2.0 
  django-rest-framework-mongoengine 3.4.0 
  djangorestframework 3.10.3 
  pymongo 3.6.1 
  mongoengine 0.17.0 
由于mongodb和Django框架的更新换代，不同版本的库可能出现不适配的问题。 为确保程序正常运行请按上述版本进行安装
```
### 服务器部署
```必须需要后台发送的数据才才封装API发送数据，前端可直接读取文件夹的建议直接读取文件夹以此减少工作量```
#### API文档：
	（1）接口名称：
		ProvinceData
	     请求类型：
	        get型
	     接口定义：
	        到当日为止各省累计确诊、疑似、治愈、死亡人数
	        每日各省province_confirmedCount(确诊)、province_suspectedCount（疑似病例）、province_curedCount（治愈）、province_deadCount（死亡）
	     接口地址：
	        http://chinavis2020.cvnis.net:8000/ProvinceData
	（2）接口名称：
	        CityData
	     请求类型：
	        post  ["大连","2020-04-18"]
	     接口定义：
	     	到当日为止各市区累计确诊、疑似、治愈、死亡人数
	        市区的city_confirmedCount(确诊)、city_suspectedCount（疑似病例）、city_curedCount（治愈）、city_deadCount（死亡）
	     接口地址：
	        http://chinavis2020.cvnis.net:8000/CityData
#### 未做接口的数据的说明
	(1)CityDataDaily.csv/json
	     2020-01-23到2020-05-24全国各市区（精确到区）每日新增确诊人数city_confirmedCount、新增疑似人数city_suspectedCount、新增治愈人数city_curedCount、新增死亡人数city_deadCount
	(2)CityName.csv
	     用于对照查找（1）中市区名称
	(3)ProvinceDataDaily.csv/json
	     2020-01-23到2020-05-24全国各省（精确到省）每日新增确诊人数province_confirmedCount、新增疑似人数province_suspectedCount、新增治愈人数province_curedCount、新增死亡人数province_deadCount
	(4)ProvinceName.csv
	     用于对照查找（3）中省的名称
	(5)weiboHotTop10.csv/json
	     微博热搜数据，从1月18日到5月26日的微博热额top10数据（按搜索数量排名）
	(6)CountTopicNum.csv/json
	     从1月17日到3月31日微博所有以2019-ncov、covid-19、新冠、新冠肺炎、新型冠状病毒、疫情为主题的话题数量统计。
	     
#### 服务器命令
```
后台启动mongodb:
	mongod -dbpath /mnt/ChinaVIS2020_Challenge/Mongo_data/ -logpath /mnt/ChinaVIS2020_Challenge/Mongo_data/logs/mongo.log -logappend -fork -port 27017
后台启动Django框架：
	cd /mnt/ChinaVIS2020_Challenge/Django_backend/ #进入Django后台目录
	nohup python3 manage.py runserver 0.0.0.0:8000 &    #后台启动Django服务
查看端口服务是否打开：
	netstat -tunlp | grep 27017 #本地mongo数据库
	netstat -tunlp | grep 8000 #Django后台端口
```
