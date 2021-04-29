import { File } from '@babel/types';
import { ParserPlugin } from '@babel/parser/typings/babel-parser';

export declare interface IBizroadOptions {
  name: string;
  outputPath: string;
  parsePlugins: ParserPlugin[];
  extensions: string[];
  specialSuffix: string[];
  context: string;
  alias?:
    | {
        alias: string | false | string[];
        name: string;
        onlyModule?: boolean;
      }[]
    | { [index: string]: string | false | string[] };
}

export declare type queueFormType = {
  [index: string]: queueFormType;
};

export declare type queueType = {
  path: string;
  ast: File | null;
  form: queueFormType;
};
