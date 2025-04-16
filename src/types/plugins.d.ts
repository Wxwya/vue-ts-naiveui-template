import type {
  FormItemRowProps, UploadProps, InputProps, SelectProps, DatePickerProps, RadioGroupProps, RadioProps,
  CheckboxGroupProps, CheckboxProps, SwitchProps, CascaderProps, TransferProps, AutoCompleteProps, TreeSelectProps,
  InputNumberProps,DynamicTagsProps} from "naive-ui";

export { }
declare global {
  type IconType = "ali" | "iconify" | "local"
  interface Mitt  {
    on: (event: string, handler: Function) => void;
    off: (event: string, handler: Function) => void;
    emit: (event: string, payload?: any) => void;
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
    msg: string;
  }
  interface TreeOptions {
    title: string;
    value: number;
    children: TreeOptions[];
  }
  type FormValidateFunc = ()=>((error:any)=> void)
 
  // type FormItemContentStruct = typeof import('naive-ui')['NInput'] & typeof import('naive-ui')['NSelect'] & typeof import('naive-ui')["NInputNumber"] & typeof import('naive-ui')['NCheckbox']
  //   & typeof import('naive-ui')['NCheckboxGroup'] & typeof import('naive-ui')['NRadioGroup'] & typeof import('naive-ui')['NRadio'] & typeof import('naive-ui')['NSwitch'] & typeof import('naive-ui')['NTreeSelect']
  //   & typeof import('naive-ui')['NTabs'] & typeof import('naive-ui')['NTransfer'] & typeof import('naive-ui')['NCascader']
  //   & typeof import("naive-ui")['NDatePicker'] & typeof import('naive-ui')['NUpload'] & typeof import('naive-ui')['NAutoComplete'] & {options?:GlobalOptions[]}
  type FormItemRowStateStruct = FormItemRowProps & {
    isShow?: boolean,
    ruleType?:string
  }
  type FormItemContentMap = {
    input: InputProps
    select: SelectProps & { options?: GlobalOptions[] }
    date: DatePickerProps
    radio: RadioGroupProps&RadioProps& { options?: GlobalOptions[] }
    check: CheckboxGroupProps& CheckboxProps& { options?: GlobalOptions[] }
    tags: DynamicTagsProps
    number: InputNumberProps
    switch: SwitchProps
    cascader:  CascaderProps
    transfer:TransferProps
    auto:AutoCompleteProps
    upload: UploadProps
    tree:  TreeSelectProps
  }
  type FormTypeKey = keyof FormContentMap

  type FormItemRowMapStruct={
    [K in FormTypeKey]: {
      type:K;
      itemWidth?: string;
      item:  FormItemRowStateStruct;
      content?: FormItemContentMap[K];
    }
  }
  type FormItemRowStruct = FormItemRowMapStruct[keyof FormItemRowMapStruct]
  interface ComponentMap {
    [key:FormTypeKey]: DefineComponent<{}, {}, any>;
  }
  
}
