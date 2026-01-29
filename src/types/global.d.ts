export { };
declare global {
  interface Window {
    /** 将naive常用组件挂在至window */
    $dialog: import('naive-ui').DialogProviderInst;
    $notice: import('naive-ui').NotificationProviderInst;
    $bar: import('naive-ui').LoadingBarProviderInst;
    $msg: import('naive-ui').MessageProviderInst;
    $modal: import('naive-ui').ModalProviderInst
    SpeechRecognition: typeof SpeechRecognition 
  };
}

