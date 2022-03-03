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