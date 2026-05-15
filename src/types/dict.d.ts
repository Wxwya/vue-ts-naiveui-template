declare namespace Dict {
  interface DictTypeRow {
    id?: number;
    type_name: string;     
    username: string;      
    dict_name: string;    
    comment: string;
    is_default: string;
    create_time: string;  
  }
  interface DictRow {
    id?: number;
    dict_type_id: number;
    dict_label: string;
    order_num?: number;
    status: boolean 
    dict_value: string;
    username: string;
    create_time?: string; 
  }
  interface GetDictListStructApi {
    list: DictRow[];
    total: number;
  }
  interface GetDictTypeListStructApi {
    list: DictTypeRow[];
    total: number;
  }
  
}