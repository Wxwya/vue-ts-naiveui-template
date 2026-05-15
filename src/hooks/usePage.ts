import { ref, reactive } from 'vue'
/***
 * 
 * @param pageSize  条数
 * 
 * @returns {page: {pageSize, pageNum}, total: number,loading: boolean,data:T[], reset: Function}
 */
const usePage = <T>(pageSize: number=10) => { 
  const page = reactive({
    pageSize,
    pageNum: 1,
  })
  const data = ref<T[]>([])
  const total = ref<number>(0)
  const loading = ref<boolean>(false)
  const reset = () => {
    page.pageNum = 1
    page.pageSize = pageSize
    data.value = []
    total.value = 0
  }
  return {
    page,
    total,
    loading,
    data,
    reset
  }
}
export default usePage