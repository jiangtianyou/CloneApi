import * as fs from 'fs';
import {promisify} from 'util';
import {normalize} from 'path';

class ReadFileResult {
  exist: boolean;
  fullPath: string;
  content?: string | Buffer;
  isDirectory: boolean;
  errMsg?: string

  constructor(exist: boolean = true, fullPath: string, content: string | Buffer
    , isDirectory: boolean = false, errMsg: string) {
    this.exist = exist;
    this.fullPath = fullPath;
    this.content = content;
    this.isDirectory = isDirectory;
    this.errMsg = errMsg;
  }
}

export function write(fullPath: string, content: string): void {

}


export function mkdir(dirName: string): boolean {
  return true;
}

export async function readFile(path: string): Promise<string> {
  // 先判断文件是否存在
  path = normalize(path);
  let readFile = promisify(fs.readFile);
  let text;
  try {
    text = await readFile(path, 'utf8');
  } catch (e) {
    console.error("读取文件失败");
  }
  if (text) {
    text = text.replace(/\r\n/g, '\n'); // 替换成unix style否者正则匹配可能会有问题
  }
  return text || '';
}

export function isExist(path: string): boolean {
  path = normalize(path);
  try {
    let stats = fs.statSync(path);
    return true;
  } catch (e) {
    return false;
  }
}

