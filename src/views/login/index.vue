<template>
  <div class=" relative w-full h-[100vh]"
    :style="{ background: systemConfig.theme ? systemConfig.theme?.common?.bodyColor : '#fff' }">
    <div class=" absolute left-1/2 top-1/2 rounded-lg px-8 py-5 -translate-x-1/2 -translate-y-1/2 " :style="mainStyle">
      <h1 class=" text-4xl text-center"
        :style="{ color: `${handleColorReversal(systemConfig.theme ? systemConfig.theme!.common!.bodyColor : '#fff', 3)}` }">
        Login</h1>
      <n-form :model="info">
        <n-form-item path="username" label="账号:">
          <n-input placeholder="请输入账号" v-model:value="info.account">
            <template #prefix>
              <span class="iconify solar--user-bold text-xl"></span>
            </template>
          </n-input>
        </n-form-item>
        <n-form-item path="password" label="密码:">
          <n-input v-model:value="info.password"  :type="type" placeholder="请输入密码">
            <template #prefix>
              <span class="iconify  solar--password-bold text-xl"></span>
            </template>
            <template #suffix>
              <span  :class="`iconify cursor-pointer text-xl ${type==='password'?'solar--lock-password-bold-duotone':'solar--lock-password-unlocked-bold-duotone'}`" @click="type==='password'?type='text':type='password'"></span>
            </template>
          </n-input>
        </n-form-item>
         <n-form-item class="!grid-rows-none">
           <XwyaButton type="success"  text="登录" block @click="login" />
         </n-form-item>
      </n-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, inject } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import { NForm, NFormItem, NInput } from 'naive-ui';
import XwyaButton from '@/components/XwyaButton/index.vue'
import { TokenEnums } from '@/enums/cacheEnums';
import useSystemConfigStore from '@/store/systemConfigStore';
import { storeToRefs } from 'pinia';
import { handleColorReversal} from "@/utils/handleColor"
import cache from '@/utils/cache';
type InputType='text' | 'textarea' | 'password'
const { systemConfig} =  storeToRefs(useSystemConfigStore())
const { push } = useRouter()
const { query } = useRoute()
const api = inject('api') as Api
const info = reactive({
  account: 'admin',
  password: '123456'
})
const type = ref<InputType>("password")

const mainStyle = computed(() => ({
    width: `${systemConfig.value.isPc ? '350px' : '90%'}`,
    background:systemConfig.value.theme ? systemConfig.value.theme?.common?.cardColor : '#fff',
    boxShadow: systemConfig.value.theme ? '0 15px 25px rgba(0,0,0,.6)' : 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
  }))
const login = async () => {
  const m = window.$msg.loading('登录中...', { duration: 0 })
  const res = await api.system.login(info) as any
  if (res?.code === 200) { 
    // 单token
    cache.setLocalStorage(TokenEnums.TOKEN_KEY,res.token)
    // 双token
    // cache.setLocalStorage(TokenEnums.TOKEN_KEY, res.access_token)
    // cache.setLocalStorage(TokenEnums.REFRESH_KEY, res.refresh_token)
    console.log("跳转,",res);
    
    push({ path: (query.redirect ? query.redirect : '/') as string, })
  }
  m.destroy()
}
</script>

<style lang="css" scoped>
:deep(.n-form-item-label__text) {
  font-weight: bold;
  font-size:18px;
}
</style>
