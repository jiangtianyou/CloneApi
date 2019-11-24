import {readFile} from '../utils/FileUtil';
import * as fs from 'fs';
import {firstMatch, match} from '../utils/RegexUtil';
import {normalize} from 'path';
import ClassInfo from "../model/ClassInfo";

let BASE_URL = '';

/**
 * 解析小幺鸡页面
 */
export function parse(bean: string) :ClassInfo {
  let fullPath = getFullPath(bean);
  let beanText = readFile(fullPath);

  // todo 解析成ClassInfo格式
  return null;
}
export function parsePage(bean: string) :ClassInfo {
  let fullPath = getFullPath(bean);
  let beanText = readFile(fullPath);

  // todo 解析成ClassInfo格式
  return null;
}


function getFullPath(bean: string): string {
  bean = bean.endsWith('.java') ? bean : bean + '.java';
  let fullPath = process.cwd() + '/' + bean;
  if (fs.existsSync(fullPath)) {
    if (fs.statSync(fullPath).isDirectory()) {
      console.error('输入的路径不能是文件夹');
      process.exit();
    }
  } else {
    console.error('找不到输入的文件');
    process.exit();
  }
  if (!fullPath.endsWith('java')) {
    console.error('输入的必须是java文件');
    process.exit();
  }
  return normalize(fullPath);
}
