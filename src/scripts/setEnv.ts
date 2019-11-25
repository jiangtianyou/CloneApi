import * as os from 'os';
import * as fs from 'fs';
import Config from '../model/Config';
import * as chalk from 'chalk';

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
