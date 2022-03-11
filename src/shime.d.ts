// 这个文件项目会自动扫描到,根据结尾.d.ts
// 在此申明后，文件里鼠标移上去会有提示

/* shims-vue.d.ts */
declare module '*.vue' {
  import { defineComponent } from 'vue';

  const component: ReturnType<typeof defineComponent>;
  export default component;
}

  declare module '*'
// declare module 'lodash' {
//   export function chunk(array: any[], size?: number): any[];
//   export function get(source: any, path: string, defaultValue?: any): any;
// }