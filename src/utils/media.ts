import { createApp } from "vue"
import type { App } from "vue"
import XwyaWave from "@/components/XwyaWave/index.vue"
let app:App<Element> | null = null
let thea:Media | null = null
let el = document.createElement('div')
class Media {
  mediaRecorder: MediaRecorder | null = null;
  errorHandle: ((err: Error) => void) | null = null;
  successHandle: ((data: Blob, url: string) => void) | null = null;
  audioChunks: BlobPart[] = [];
  audioContext: AudioContext | null = null;
  analyser: AnalyserNode | null = null;
  source: MediaStreamAudioSourceNode | null = null;
  isVisualizing: boolean = false; // 添加标志
  falg : boolean = false
  constructor() {
    thea=this
    this.initStream();
  }

  async initStream() {
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.onDataAvailable();
      this.setupAudioProcessing(stream);
      document.body.appendChild(el);
    } catch (err:any) {
      if (this.errorHandle) {
        this.errorHandle(err);
      }
    }
  }

  setupAudioProcessing(stream: MediaStream): void {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
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

  onSuccess(handle: (data: Blob, url: string) => void) {
    this.successHandle = handle;
  }

  onError(handle: (err: any) => void): void {
    this.errorHandle = handle;
  }

  createWave() { 
    app?.mount(el)
  }
}
export default Media;
