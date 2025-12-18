// src/composables/useAudio.js - UPDATED for Volume Control
import { ref } from 'vue'

// The actual HTML5 Audio element instance is now exposed internally
const audio = new Audio()
const isPlaying = ref(false)
const duration = ref(0)
const currentTime = ref(0)
const currentTrack = ref(null)
const audioVolume = ref(audio.volume) // Initialize with current audio volume (usually 1.0)

export function useAudio() {
  // Set up event listeners on the audio element
  audio.ontimeupdate = () => {
    currentTime.value = audio.currentTime
  }
  audio.onloadedmetadata = () => {
    duration.value = audio.duration
  }
  audio.onended = () => {
    isPlaying.value = false
    currentTime.value = 0
  }
  audio.onvolumechange = () => {
    audioVolume.value = audio.volume
  }

  const playTrack = (track) => {
    if (currentTrack.value?.id !== track.id) {
      audio.src = track.audioUrl
      currentTrack.value = track
      audio.load()
    }
    audio.play()
    isPlaying.value = true
  }

  const pauseTrack = () => {
    audio.pause()
    isPlaying.value = false
  }

  const togglePlay = (track) => {
    if (currentTrack.value?.id === track.id && isPlaying.value) {
      pauseTrack()
    } else {
      playTrack(track)
    }
  }

  const seek = (time) => {
    audio.currentTime = time
    currentTime.value = time
  }

  // NEW: Function to set the volume
  const setVolume = (level) => {
    // Clamping level between 0.0 and 1.0
    audio.volume = Math.min(1, Math.max(0, level))
    audioVolume.value = audio.volume
  }

  return {
    // Reactive State
    isPlaying,
    duration,
    currentTime,
    currentTrack,
    audioVolume, // NEW: Expose volume state
    // Methods
    togglePlay,
    seek,
    setVolume, // NEW: Expose volume control method
  }
}
