<script setup>
import { ref, reactive } from 'vue'
import PodcastPlayer from './components/PodcastPlayer.vue'

// --- GLOBAL AUDIO STATE ---
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const currentTrack = ref(null)
const audioRef = ref(null) // This connects to the <audio> tag

const featuredEpisodes = [1]

// --- AUDIO METHODS ---
const handleTogglePlay = (episode) => {
  // 1. If we click a different track, load it
  if (!currentTrack.value || currentTrack.value.id !== episode.id) {
    currentTrack.value = episode
    // Wait for DOM to update the audio src, then play
    setTimeout(() => {
      audioRef.value.play()
      isPlaying.value = true
    }, 0)
    return
  }

  // 2. If it's the same track, just toggle play/pause
  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play()
  }
  isPlaying.value = !isPlaying.value
}

// Update the progress bar as the music plays
const onTimeUpdate = () => {
  currentTime.value = audioRef.value.currentTime
}

// Get the total length once the file loads
const onLoadedMetadata = () => {
  duration.value = audioRef.value.duration
}

const onAudioEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
}

const handleSeek = (time) => {
  if (audioRef.value) {
    audioRef.value.currentTime = time
  }
}
</script>

<template>
  <div class="min-h-screen bg-red-500 p-8">
    <audio
      ref="audioRef"
      :src="currentTrack?.audioUrl"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onAudioEnded"
    ></audio>

    <header class="text-center mb-8">
      <h1 class="text-3xl font-extrabold text-gray-800">Podcast Player</h1>
    </header>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <PodcastPlayer
        v-for="id in featuredEpisodes"
        :key="id"
        :episodeId="id"
        :is-playing="isPlaying"
        :current-time="currentTime"
        :duration="duration"
        :current-track="currentTrack"
        @toggle-play="handleTogglePlay"
        @seek="handleSeek"
      />
    </div>
  </div>
</template>
