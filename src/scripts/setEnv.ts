import * as os from 'os';
import * as fs from 'fs';
import Config from '../model/Config';
import * as chalk from 'chalk';
import * as req from 'request-promise-native';
import * as jsonpath from 'jsonpath';

/**
 * 检查配置是否正确
 */
export function initEnv(): boolean {
  let configFile = os.homedir() + '/clone.json';
  if (fs.existsSync(configFile)) {
    let text = fs.readFileSync(configFile, 'utf-8');
    if (!text) {
      console.log(chalk.bgRed('请先调用命令 api config your-postman-key配置key'));
      process.exit();
    }
    let config = JSON.parse(text);
    if (!config.key || config.key.length < 15) {
      console.log(chalk.bgRed('配置不正确，请先调用命令 api config your-postman-key配置key'));
      process.exit();
    } else {
      // 写入到配置文件
      Config.key = config['key'];
    }
  } else {
    //  创建默认配置
    fs.writeFileSync(configFile, JSON.stringify(getDefaultConfig(), null, 2), 'utf-8');
    console.log(chalk.bgRed('配置不正确，请先调用命令 api config your-postman-key配置key'));
    process.exit();
  }
  return false;
}


export function createConfig(data): void {
  let configFile = os.homedir() + '/clone.json';
  fs.writeFileSync(configFile, JSON.stringify(data, null, 2), 'utf-8');
}

function getDefaultConfig() {
  let data = {
    key: '',
  };
  return data;
}

export async function printTodayJoke(): Promise<string> {
  let key = '3804cd4c08e144eeb33af1b1c5848be2',
    url = `http://api.avatardata.cn/Joke/NewstJoke?key=${key}&page=1&rows=20`;
  let requestPromise = req.get(url);

  let jokeArr = await requestPromise.then(async content => {
    return jsonpath.query(JSON.parse(content), '$.result..content');
  }).catch(err => {
    console.log('笑话接口请求达到了限制。明天再看吧！:(');
  });
  let todayJoke = '';
  if (jokeArr && jokeArr.length > 0) {
    // 随机的取一下笑话
    let index = Math.floor(Math.random() * jokeArr.length);
    todayJoke = jokeArr[index];
  }
  if (todayJoke) {
    // 打印今日笑话
    console.log('\n\n');
    console.log('今日笑话:\n' + chalk.magentaBright(todayJoke));
  }
  return todayJoke;
}