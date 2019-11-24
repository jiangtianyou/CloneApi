/**
 * api条目信息
 */

export default class ApiItem {
  id: string
  name: string;  // api名称 或 是文件夹的名
  folderName?: string;  //所在文件夹的名称
  fullPath: string;
  data?: RequestDetail;


  constructor(id: string, name: string, folderName:string, fullPath: string, data: RequestDetail) {
    this.id = id;
    this.name = name;
    this.folderName = folderName;
    this.fullPath = fullPath;
    this.data = data;
  }
}

interface RequestDetail {
  contentType: string;
  description: string;
  requestArgs: Arg[]
}


interface Arg {
  name: string; // 参数名
  description: string;
}

