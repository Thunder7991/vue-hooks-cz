/*
 * @Author: thunderchen
 * @Date: 2023-10-30 10:05:57
 * @LastEditTime: 2023-12-11 15:00:36
 * @email: 853524319@qq.com
 * @Description: 自动通知用户更新 / 仅测试环境使用
 */

export interface Options {
  timer?: number;
  path?: string;
}

export class Updater {
  oldScript: string[]; //存储第一次值也就是script 的hash 信息
  newScript: string[]; //获取新的值 也就是新的script 的hash信息
  dispatch: Record<string, Function[]>; //小型发布订阅通知用户更新了
  static instance: any;
  static htmlPath: string;
  static isInstance: boolean;
  private constructor(options: Options) {
    if (Updater.instance) {
      throw new Error('Use Updater.getInstance() to get an instance.');
    }
    if (!Updater.instance && !Updater.isInstance) {
      throw new Error('Use Updater must call the getInstance method init');
    }
    this.oldScript = [];
    this.newScript = [];
    this.dispatch = {};
    Updater.htmlPath = options?.path || '/main';
    this.init(); //初始化
    this.timing(options?.timer); //轮询
  }
  static getInstance(options: Options) {
    if (!Updater.instance) {
      Updater.isInstance = true;
      Updater.instance = new Updater(options);
    }
    return Updater.instance;
  }
  async init() {
    const html: string = await this.getHtml();
    this.oldScript = this.parserScript(html);
  }

  async getHtml() {
    const html = await fetch(Updater.htmlPath).then((res) => res.text()); //读取index html
    return html;
  }

  parserScript(html: string) {
    const reg = new RegExp(/<script(?:\s+[^>]*)?>(.*?)<\/script\s*>/gi); //script正则
    return html.match(reg) as string[]; //匹配script标签
  }

  //发布订阅通知
  on(key: 'no-update' | 'update', fn: Function) {
    (this.dispatch[key] || (this.dispatch[key] = [])).push(fn);
    return this;
  }

  compare(oldArr: string[], newArr: string[]) {
    const base = oldArr.length;
    const arr = Array.from(new Set(oldArr.concat(newArr)));
    //如果新旧length 一样无更新
    if (arr.length === base) {
      this.dispatch['no-update'] &&
        this.dispatch['no-update'].forEach((fn) => {
          fn();
        });
    } else {
      //否则通知更新
      this.dispatch['update'] &&
        this.dispatch['update'].forEach((fn) => {
          fn();
        });
    }
  }

  timing(time = 10000) {
    //轮询
    setInterval(async () => {
      const newHtml = await this.getHtml();
      this.newScript = this.parserScript(newHtml);
      this.compare(this.oldScript, this.newScript);
    }, time);
  }
}
