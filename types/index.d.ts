declare module '*.vue' {
  import Vue from 'vue';

  export default Vue;
}

declare namespace JSX {
  interface Element {}
  interface IntrinsicElements {
    div: any;
    TransitionPlus: any;
  }
}
