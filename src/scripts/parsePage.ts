import ApiItem from '../model/ApiItem';
import { URL } from 'url';
import Config from '../model/Config';
import { getUrlContent } from '../utils/RequestUtil';
import { firstMatch } from '../utils/RegexUtil';
import { JSDOM } from 'jsdom';
import * as jp from 'jsonpath';
import * as cheerio from 'cheerio';
import * as chalk from 'chalk';
import * as ora from 'ora';

let ID_NAME_MAP = {};

// todo 递归迭代文件夹
/**
 * 解析小幺鸡页面
 */
export async function parse(path: string): Promise<ApiItem[]> {
  initBaseUrl(path);
  return parseApiPage(path);
}


/**
 * 初始化项目必要的参数
 */
function initContext(content: string): void {
  let $ = cheerio.load(content);
  $('.name-item').each((index, item) => {
    let id = $(item).attr('data-id');
    let name = $(item).attr('data-name');
    ID_NAME_MAP[id + ''] = (name || '').trim();
  });
  // 提取环境相关代码的script
  let envScript = _extractEnvScript(content);
  if (envScript) {
    // 替换掉里面的reload代码，否则jsdom内部会抛出异常，且没法捕捉，影响观感
    envScript = envScript.replace('reload()', 'placeholder');
    let wd = {};
    try {
      wd = new JSDOM(envScript, { runScripts: 'dangerously' }).window;
    } catch (e) {
    }
    if (wd['_projectName_']) {
      Config.collectionName = wd['_projectName_'];
    }
  }
}


function initBaseUrl(path: string): void {
  if (path) {
    Config.baseUrl = new URL(path).origin;
  }
}


/**
 * 解析单个具体APi页面的数据
 */
async function parseApiPage(path: string): Promise<ApiItem[]> {
  let rtn = [];
  let content = await getUrlContent(path);
  const extractSpinner = ora('正在从下载的页面中，提取数据').start();
  // 0、解析出项目名、ID-Name对应关系等数据
  initContext(content);
  let $ = cheerio.load(content);
  // 1、作为单个文件解析
  let script = _extractDataScript(content);
  if (!script) {
    // 2、当做文件夹进行处理
    let urls = _extractFolderUrl(content);
    for (let url of urls) {
      let content = await getUrlContent(url);
      let yaoJiData = getYaoJiData(url, content);
      if (yaoJiData) {
        rtn.push(yaoJiData);
      }
    }
  }
  let yaoji = getYaoJiData(path, content);
  if (yaoji) {
    rtn.push(yaoji);
  }
  extractSpinner.succeed('提取成功. 共提取到' + chalk.bgGreen(rtn.length) + '条api数据');
  return rtn;
}


function _extractFolderUrl(content: string): string[] {
  let rtn = [];
  let $ = cheerio.load(content);
  let $elements = $('.uk-list-bullet a');
  if ($elements.length != 0) {
    $elements.each((index, ele) => {
      let subUrl = $(ele).attr('href');
      rtn.push(Config.baseUrl + subUrl);
    });
  }
  return rtn;
}


function getYaoJiData(fullPath: string, content: string): ApiItem {
  let script = _extractDataScript(content);
  if (!script) {
    return null;
  }
  let wd = new JSDOM(script, { runScripts: 'dangerously' }).window;
  let doc = wd['doc'];
  if (doc && doc['content']) {
    let contentObj = JSON.parse(doc['content']);
    if (!contentObj) {
      return null;
    }
    let apiItem = toApiItem(fullPath, doc);
    return apiItem;
  }
  return null;
}


function toApiItem(fullPath: string, doc: Object): ApiItem {
  let name = doc['name'],
    id = doc['id'],
    contentObj = JSON.parse(doc['content']);
  let args = jp.query(contentObj, '$.requestArgs')[0];
  if (args) {
    // 转成ApiItem里的数据格式
    args = args.map(item => {
      return {
        name: item['name'],
        description: item['description'] || '',
      };
    });
  }
  let folderName = ID_NAME_MAP[doc['parentId']] || '';
  let description = contentObj['description'] || '';
  if (description) {
    // 去除html代码
    let $ = cheerio.load(description);
    description = $('pre').text();
  }
  return new ApiItem(id, name, folderName, fullPath, {
    contentType: contentObj['contentType'],
    description: description,
    requestArgs: args,
  });
}

function _extractDataScript(content: string): string {
  let reg = /(<script>([^a-zA-Z0-9]*var doc = [\s\S]*?)<\/script>)/g;
  return firstMatch(reg, content);
}


function _extractEnvScript(content: string): string {
  let reg = /(<script>([^a-zA-Z0-9]*window._edit_ = [\s\S]*?)<\/script>)/g;
  return firstMatch(reg, content);
}




