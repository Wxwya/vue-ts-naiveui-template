import { ref, onMounted} from 'vue'
const useAudioToText = () => {
  const isRecognizing = ref(false)
  const transcript = ref('')
  let recognition: any = null
  const initRecognition = () => {
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognitionClass) {
      recognition = new SpeechRecognitionClass()
    } else {
      alert('Your browser does not support Speech Recognition')
    }
  }
  const startRecognition = () => {
    if (!recognition) return
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'zh-Hans-CN'
    recognition.onstart = () => {
      isRecognizing.value = true
    }
    recognition.onresult = (event) => {
      let interimTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          transcript.value += event.results[i][0].transcript
        } else {
          interimTranscript += event.results[i][0].transcript
        }
      }
    }
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event)
    }
    recognition.onend = () => {
      isRecognizing.value = false
    }
    recognition.start()
  }
  const stopRecognition = () => {
    if (recognition && recognition.state !== 'inactive') {
      recognition.stop()
    }
  }
  onMounted(() => {
    initRecognition()
  })
  return {
    startRecognition,
    stopRecognition,
    transcript,
    isRecognizing,
  }
}
export default useAudioToText
