import { RecordPropsDefinition } from 'vue/types/options';

declare module 'vue/types/options' {
  // https://gist.github.com/wonderful-panda/3156681f25ee72e1a3bfbeaf3764288b propsの型を抽出するやつ
  type RequiredPropNames<PD extends RecordPropsDefinition<any>> = ({
    [K in keyof PD]: PD[K] extends { required: true } ? K : never
  })[keyof PD];

  type OptionalPropNames<PD extends RecordPropsDefinition<any>> = {
    [K in keyof PD]: PD[K] extends { required: true } ? never : K
  }[keyof PD];

  type OuterProps<
    PropDefs extends RecordPropsDefinition<any>
  > = PropDefs extends RecordPropsDefinition<infer P>
    ? { [K in RequiredPropNames<PropDefs> & keyof P]: P[K] } &
        { [K in OptionalPropNames<PropDefs> & keyof P]?: P[K] }
    : never;
}
