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

