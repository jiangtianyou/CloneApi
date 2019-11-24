/**
 * javaBean信息
 */
import Config from './Config';

enum Type{
  String='String',
  Integer = 'Integer',
  Date = 'Date',
  List = 'List'
}

export default class FieldInfo {
  type: Type;
  filedName: string;
  required: boolean

  getUrlencodedArgs(): string{
      return '';
  }
}