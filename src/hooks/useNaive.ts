import { useMessage, useDialog, useNotification, useLoadingBar, useModal } from 'naive-ui'
const useNaive = () => {
  const message = useMessage()
  const dialog = useDialog()
  const notification = useNotification()
  const loadingBar = useLoadingBar()
  const modal = useModal()
  window.$msg = message
  window.$dialog = dialog
  window.$notice = notification
  window.$bar = loadingBar
  window.$modal = modal
}
export default useNaive
