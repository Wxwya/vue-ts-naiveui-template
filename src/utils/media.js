import { createApp } from "vue"
import XwyaWave from "@/components/XwyaWave/index.vue"
let app = null
let thea = null
let el = document.createElement('div')
class Media {
  mediaRecorder = null;
  errorHandle = null;
  successHandle = null;
  audioChunks = [];
  audioContext = null;
  analyser = null;
  source = null;
  isVisualizing = false; // 添加标志
  falg = false
  constructor() {
    thea=this
    this.initStream();
  }

  async initStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.onDataAvailable();
      this.setupAudioProcessing(stream);
      document.body.appendChild(el);
    } catch (err) {
      if (this.errorHandle) {
        this.errorHandle(err);
      }
    }
  }

  setupAudioProcessing(stream) {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.source = this.audioContext.createMediaStreamSource(stream);
    this.analyser = this.audioContext.createAnalyser();
    this.source.connect(this.analyser);
    this.analyser.fftSize = 2048;
    this.isVisualizing = true; // 启动可视化
  }

  onDataAvailable() {
    this.mediaRecorder?.addEventListener('dataavailable', (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
        this.generateAudioBlob();
      }
    });
  }

  start() {
    this.mediaRecorder?.start();
    this.isVisualizing = true; // 停止可视化
    app = createApp(XwyaWave, {
      isVisualizing: this.isVisualizing,
      analyser: this.analyser,
      v:thea
    })
    this.createWave()
  }

  stop(f) {
    this.falg = f
    this.mediaRecorder?.stop();
    this.isVisualizing = false; // 停止可视化
    app && app.unmount()
  }
  generateAudioBlob() {
    if (this.audioChunks.length > 0) {
      if (this.falg){
        const blob = new Blob(this.audioChunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        
      if (this.successHandle) {
        this.successHandle(blob, url);
      }
      }
      
    }
  }

  onSuccess(handle) {
    this.successHandle = handle;
  }

  onError(handle) {
    this.errorHandle = handle;
  }

  createWave() { 
    app?.mount(el)
  }
}
export default Media;
