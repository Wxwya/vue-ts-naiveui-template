import type {
  FormItemRowProps, UploadProps, InputProps, SelectProps, DatePickerProps, RadioGroupProps,
  CheckboxGroupProps, SwitchProps, CascaderProps, TransferProps, AutoCompleteProps, TreeSelectProps,
  InputNumberProps, DynamicTagsProps, FormValidationError, RuleType } from "naive-ui";

export { }
declare global {
  type IconType = "ali" | "iconify" | "local"
  interface Mitt  {
    on: (event: string, handler: Function) => void;
    off: (event: string, handler: Function) => void;
    emit: (event: string, payload?: unknown) => void;
  };
  interface TableCheckMeta<T> {
    row: T | undefined,
    action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll'
  }
  interface GlobalOptions<T = string> {
    label: string,
    value: T,
  }
  interface DefaultOptions  extends GlobalOptions {
    type:string
  }
  interface DecryptBody<T=unknown>  {
    code: number;
    data: T | null;
    message: string;
  }
  interface TreeOptions {
    title: string;
    value: number;
    children: TreeOptions[];
  }
  type FormValidateFunc = () => import('naive-ui').FormInst['validate']
 
 
  // type FormItemContentStruct = typeof import('naive-ui')['NInput'] & typeof import('naive-ui')['NSelect'] & typeof import('naive-ui')["NInputNumber"] & typeof import('naive-ui')['NCheckbox']
  //   & typeof import('naive-ui')['NCheckboxGroup'] & typeof import('naive-ui')['NRadioGroup'] & typeof import('naive-ui')['NRadio'] & typeof import('naive-ui')['NSwitch'] & typeof import('naive-ui')['NTreeSelect']
  //   & typeof import('naive-ui')['NTabs'] & typeof import('naive-ui')['NTransfer'] & typeof import('naive-ui')['NCascader']
  //   & typeof import("naive-ui")['NDatePicker'] & typeof import('naive-ui')['NUpload'] & typeof import('naive-ui')['NAutoComplete'] & {options?:GlobalOptions[]}
  type FormItemRowStateStruct = FormItemRowProps & {
    isShow?: boolean,
    ruleType?:RuleType
  }
  type FormItemContentMap = {
    input: InputProps & {comment?: string,placeholder?:string}
    select: SelectProps & { comment?: string,placeholder?:string }
    date: DatePickerProps& {comment?: string,placeholder?:string}
    radio: RadioGroupProps & { options?: GlobalOptions[],comment?: string,placeholder?:string }
    check: CheckboxGroupProps & { options?: GlobalOptions[],comment?: string ,placeholder?:string}
    tags: DynamicTagsProps& {comment?: string,placeholder?:string}
    number: InputNumberProps& {comment?: string,placeholder?:string}
    switch: SwitchProps& {comment?: string,placeholder?:string}
    cascader:  CascaderProps& {comment?: string,placeholder?:string}
    transfer:TransferProps& {comment?: string,placeholder?:string}
    auto:AutoCompleteProps& {comment?: string,placeholder?:string}
    upload: UploadProps& {comment?: string,placeholder?:string}
    tree:  TreeSelectProps& {comment?: string,placeholder?:string}
  }
  type FormTypeKey = keyof FormItemContentMap

  type FormItemRowMapStruct={
    [K in FormTypeKey]: {
      type:K;
      itemWidth?: string;
      item:  FormItemRowStateStruct;
      content?: FormItemContentMap[K] | {comment?: string,placeholder?:string};
    }
  }
  type FormItemRowStruct = FormItemRowMapStruct[keyof FormItemRowMapStruct]
  interface ComponentMap {
    [key:FormTypeKey]: DefineComponent<{}, {}, any>;
  }
}
