<script setup>
import { ref, watch } from 'vue'
import PodcastPlayer from './components/PodcastPlayer.vue'

// --- GLOBAL AUDIO STATE ---
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const currentTrack = ref(null)
const audioRef = ref(null)

// IMPORTANT: Change this to your actual WordPress Post ID
const featuredEpisodes = [16]

// --- AUDIO METHODS ---
const handleTogglePlay = async (episode) => {
  if (!audioRef.value) return

  // 1. If switching to a NEW track
  if (!currentTrack.value || currentTrack.value.id !== episode.id) {
    // Stop any existing playback
    audioRef.value.pause()

    // Assign new track data
    currentTrack.value = episode

    // We MUST wait for Vue to update the :src on the <audio> tag
    // then tell the browser to fetch the new file.
    setTimeout(() => {
      audioRef.value.load() // This is the "Magic" line
      audioRef.value
        .play()
        .then(() => {
          isPlaying.value = true
        })
        .catch((err) => {
          console.error(
            'Playback failed. This usually happens if the URL is not a direct MP3 or if the browser blocks autoplay.',
            err,
          )
        })
    }, 50)
    return
  }

  // 2. Toggling the SAME track
  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    try {
      await audioRef.value.play()
    } catch (e) {
      console.error('Resume failed:', e)
    }
  }
  isPlaying.value = !isPlaying.value
}

const onTimeUpdate = () => {
  if (audioRef.value) currentTime.value = audioRef.value.currentTime
}

const onLoadedMetadata = () => {
  if (audioRef.value) duration.value = audioRef.value.duration
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
  <div class="min-h-screen bg-gray-100 p-8">
    <audio
      ref="audioRef"
      :src="currentTrack?.audioUrl"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onAudioEnded"
      preload="auto"
    ></audio>

    <header class="text-center mb-8">
      <h1 class="text-3xl font-extrabold text-gray-800">KARA House Media</h1>
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
