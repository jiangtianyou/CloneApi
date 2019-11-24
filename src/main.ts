#!/usr/bin/env node

import * as os from "os";
import * as fs from "fs";
//
import {JSDOM} from 'jsdom';
import {ResourceLoader} from 'jsdom';
import * as reg from './utils/RegexUtil';
import {isAwaitExpression} from "tsutils";
import {parse} from "./scripts/parsePage";
// 1、检验输入文件并获取路径

const exit = process.exit,
  program = require('commander');

program.version('1.1.7')
  .arguments('<bean> [env]')
  .description('生成bean对应的api')
  .action(function (bean) {
    if (bean === 'config') {
      //打开配置文件进行配置
      openConfig();
      process.exit();
    }
    if (!bean) {
      console.log('命令不正确');
      process.exit();
    }
    checkEnv();
    if (bean == 'setenv') {
      console.log('正在配置环境变量')
    }
    console.log('生成完成请在postman中查看！')

  })
program.parse(process.argv);

/**
 * 检查配置是否正确
 */
function checkEnv(): boolean {
  let configFile = os.homedir() + '/apiconfig.json';
  if (fs.existsSync(configFile)) {
    let text = fs.readFileSync(configFile, 'utf-8');
    if (!text) {
      console.log('请先调用命令 api config 进行配置key');
      process.exit();
    }
    let config = JSON.parse(text);
    if (!config.key || config.key.length < 15 || !config.host) {
      console.log('配置不正确');
      process.exit();
    } else {
      // 写入到配置文件
    }
  } else {
    //  创建默认配置
    fs.writeFileSync(configFile, JSON.stringify(getDefaultConfig(), null, 2), 'utf-8');

    console.log('请先调用命令 api config 进行配置key')
  }
  return false;
}


function openConfig(): void {
  let configFile = os.homedir() + '\\apiconfig.json';
  console.log('请先打开文件' + configFile + '完成配置');
  if (!fs.existsSync(configFile)) {
    createDefaultConfig();
  }
}


function createDefaultConfig(): void {
  let configFile = os.homedir() + '/apiconfig.json';
  let data = getDefaultConfig();
  fs.writeFileSync(configFile, JSON.stringify(data, null, 2), 'utf-8')
}

function getDefaultConfig() {
  let data = {
    key: 'you-postman-key',
    siteId: '28',
    host: 'http://192.168.201.70:8084/media-basic-community',
  };
  return data;
}


let cheerio = require('cheerio');
let req = require('./utils/RequestUtil');


let path = 'http://www.xiaoyaoji.cn/doc/1R2L3F3GY7';


let promise = parse(path);

// 从小幺鸡提取到的数据
promise.then(arr => {
  console.log('从小幺鸡提取到的数据==>', JSON.stringify(arr, null, 2));
})
