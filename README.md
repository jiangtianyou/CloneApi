# CloneApi

## 用途

克隆小幺鸡上的接口到postman.

## 安装

`npm i @jiagntianyou -g`

## 配置

只需配置一个postman key即可。此key用于在postman上生成文档使用。
### 1、怎样获取postman的key?
打开postman客户端点击右上角 Account Settings
![](https://cdn.jsdelivr.net/gh/jiangtianyou/ImageBase/2019/postman_key1.png)

在打开的页面如下即可生成key

![](https://cdn.jsdelivr.net/gh/jiangtianyou/ImageBase/2019/20191119095009.png)

复制这个生成的key， 安装完成后打开cmd窗口,运行`clone config your-postman-key`即可。

(这会在你电脑的用户目录生成一个clone.json文件，key保存再这里，供之后请求接口之用)


## 使用

复制要克隆的小幺鸡接口地址。例如 http://192.168.0.187:8080/xiaoyaoji/doc/6HmkvpK9a

cmd里运行`clone http://192.168.0.187:8080/xiaoyaoji/doc/6HmkvpK9a`即可.