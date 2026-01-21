declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<object, object, any>;
  export default component;
}

declare module '*.scss' {
  const scss: Record<string, string>;
  export default scss;
}
