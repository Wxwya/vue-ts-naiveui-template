<template>
  <div class="p-4">
    <div class="border-0 border-l-4 border-solid border-green-400 text-2xl font-bold pl-4 ">查询示例</div>
    <XwyaForm class="my-10 mx-2" label-placement="left" :item-list="queryFormItem" v-model="queryFormData" :row="7">
      <template #default="{ change, state }">
        <n-button :type="!state ? 'primary' : 'error'" @click="search(state, change)">
          {{ state ? '取消' : '搜索' }}
        </n-button>
      </template>
    </XwyaForm>
    <div class="border-0 border-l-4 border-solid border-green-400 text-2xl font-bold pl-4 ">正常表单示例</div>
    <div class="max-w-[700px] my-10 mx-2" >
      <XwyaForm :rules="rules" label-width="auto" label-placement="left" :item-list="queryFormItem2"
        v-model="queryFormData">
        <template #default="{ validate, reset }">
          <div class="w-full flex justify-center gap-4">
            <n-button type="primary" @click="submit(validate)"> 提交</n-button>
            <n-button @click="onReset(reset)">重置</n-button>
          </div>

        </template>
      </XwyaForm>
    </div>
    <div class="border-0 border-l-4 border-solid border-green-400 text-2xl font-bold pl-4 ">动态表单示例</div>
    <div class="my-10 mx-2" >
      <XwyaForm  row-flex :rules="rules" label-width="120px" label-placement="left" :item-list="queryFormItem3"
        v-model="queryFormData" >
        <template #default="{ validate, reset }">
          <div class="flex justify-center items-center gap-2 w-full">
            <n-button type="primary" @click="submit(validate)"> 提交</n-button>
            <n-button @click="onReset(reset)">重置</n-button>
          </div>
        </template>
      </XwyaForm>
    </div>
    <div class="my-10 pb-10 mx-2" >
      <XwyaForm  :rules="rules" label-width="100px" label-placement="left" :item-list="queryFormItem3"
        v-model="queryFormData" :row="3" :col="2" >
        <template #default="{ validate, reset }">
          <div class="flex justify-center gap-2 items-center w-full">
            <n-button type="primary" @click="submit(validate)"> 提交</n-button>
            <n-button @click="onReset(reset)">重置</n-button>
          </div>
        </template>
      </XwyaForm>
    </div>
  </div>
</template>

<script setup >
import { ref, computed } from 'vue'
import {NButton} from 'naive-ui'
import XwyaForm from '@/components/XwyaForm/index.vue'
class QueryFormData {
  remarks = ''
  address = ""
  remarks221214222 = ""
  a1 = ""
  b1 = ""
  b2 = ""
  b3 = ""
  a18 = void 0
}
const queryFormData = ref(new QueryFormData())
const defaultOptions= [{ label: "选项1", value: 1 }, { label: "选项2", value: 2 }]
const oo = computed(() => {
  return ['@gmail.com', '@163.com', '@qq.com'].map((suffix) => {
    const prefix = queryFormData.value.remarks221214222.split('@')[0]
    return {
      label: prefix + suffix,
      value: prefix + suffix
    }
  })
})
const queryFormItem = [
  { type: 'input', item: { label: '地址:', path: 'address111' }, content: {placeholder: '请输入地址'}   },
  { type: 'select', item: { label: '备注:', path: 'remarks222', }, content: {placeholder: '请输入备注',options: defaultOptions}     },
  { type: 'input', item: {label: '备注:', path: 'remarks1',},content: {placeholder: '请输入地址'}  },
  { type: 'input',item: {label: '备注:', path: 'remarks2',}, content: {placeholder: '请输入地址'}  },
]
//  如果要使用auto输入框 必须是ref包裹 
const queryFormItem2 = ref([
  { type: 'input', item: { label: 'input输入框:', path: 'a1' }, content: {placeholder: '请输入地址'}},
  { type: 'input', item: {label: 'textarea文本框:', path: 'a2'}, content:{type:"textarea",placeholder: '请输入地址'}   },
  { type: 'auto', item: { path: 'a3',label: 'auto输入框:'  }, content: {options: oo.value} },
  { type: 'select', item: { label: 'select多选:', path: 'a5' }, content: {placeholder: '请输入备注',multiple: true,options:defaultOptions}},
  { type: 'select', item: { label: 'select单选:', path: 'a5' }, content: {placeholder: '请输入备注',options:defaultOptions}},
  { type: 'date', item: { label: 'date日期:', path: 'a6' }, content: {placeholder: '请输入备注'}},
  { type: 'date', item: { label: 'datetime日期加时间:', path: 'a7' }, content: {type:"datetime",placeholder: '请输入备注'}},
  { type: 'date', item: { label: 'daterange日期范围:', path: 'a8', },content: {type: "daterange",placeholder: '请输入备注'} ,  },
  { type: 'check', item: { label: 'check多选复选框:', path: 'a9' }, content:{options: defaultOptions}},
  { type: 'radio', item: { label: 'radio单选按钮:', path: 'a10', },content: {options:defaultOptions}},
  { type: 'tags', item: {label: 'tags标签:', path: 'a11', }},
  { type: 'number', item: {label: 'number计数器:', path: 'a12',} },
  { type: 'switch', item: {label: 'switch开关:', path: 'a13'}},
  { type: 'cascader', item: { label: 'cascader级联选择器:', path: 'a14', }, content: {options:defaultOptions}   },
  { type: 'transfer', item: { label: 'transfer穿梭框:', path: 'a15', },content: {options: defaultOptions}  },
  { type: 'upload', item: { label: '图片上传:', path: 'a16' } },
])
const rules= computed(() => {
  return queryFormItem2.value.reduce((acc, cur) => {
    acc[cur.item.path] = [{ required: true, trigger: ['blur'], }]
    return acc
  }, {})
})

const queryFormItem3 = computed(() => { 
  return [
    { type: 'input', item: { label: '动态input:', path: 'b1' }, content: {placeholder: '请输入123'}},
    { type: 'select', item: { label: '123显示下拉:', path: 'b2', isShow: !(queryFormData.value.b1=='123') }, content: { placeholder: '请选择选项2',options:defaultOptions }},
    { type: 'input', item: { label: 'abc:', path: 'b3',isShow: !(queryFormData.value.b2 == 2) }, content: {placeholder: '请输入456',}},
    { type: 'date', item: { label: 'datetime日期加时间:', path: 'a18',isShow: !(queryFormData.value.b3 == '456' )}, content: {type:"datetime",placeholder: '请输入备注'}    },
  ]
})
const submit = (validate) => {
  console.log(queryFormData.value);
  validate()(err => {
    if (!err) {
      window.$msg.success('校验通过')
    } else {
      window.$msg.error('失败')
    }
  })
}
const onReset = (f) => {
  queryFormData.value = new QueryFormData()
  f()
}
const search = (state, change) => {
  if (state) {
    window.$msg.success('搜索')
  } else {
    queryFormData.value = new QueryFormData()
    window.$msg.success('取消搜索')
  }
  change()
}


</script>

<style lang="css" scoped></style>
