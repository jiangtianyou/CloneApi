#!/usr/bin/env node

import * as os from "os";
import * as fs from "fs";
//
import {JSDOM} from 'jsdom';
import {ResourceLoader} from 'jsdom';
import * as reg from './utils/RegexUtil';
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

//
// try {
//
//   JSDOM.fromURL('http://www.xiaoyaoji.cn/doc/1QnSRmRbAx', {
//     referrer: "http://www.xiaoyaoji.cn",
//     // runScripts: 'dangerously'
//   })
//     .then(json => {
//       let htmlText = json.serialize();
//       // 提取出doc对象
//       let result = reg.firstMatch(/(<script>([^a-zA-Z0-9]*var doc = [\s\S]*?)<\/script>)/g,htmlText);
//
//       let jsdom = new JSDOM(result, {runScripts: "dangerously"});
//       let windowElement = jsdom.window['doc'];
//       console.log(windowElement);
//       console.log(json.window['doc']);
//       console.log('正则匹配的结果:', result);
//
//     })
//   ;
// }catch (e) {
//   // console.log(e)
// }


let myu = require('./utils/RequestUtil');

let urlContent = myu.getUrlContent('http://www.baidu.com/');
urlContent.then(content =>{
  console.log(content);
})
