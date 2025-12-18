<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { FwbCard } from 'flowbite-vue'
// Ensure this import path is correct for your project
import defaultArtwork from '@/assets/wilfried-vowoto-9-VxSBJz6F8-unsplash.jpg'
import felaAudio from '@/assets/SpotiDown.App - Stuck On You - Lionel Richie.mp3'
import { FwbDropdown, FwbListGroup, FwbListGroupItem } from 'flowbite-vue'

const props = defineProps({
  episodeId: [String, Number],
  isPlaying: Boolean,
  currentTime: Number,
  duration: Number,
  currentTrack: Object,
  audioVolume: Number,
})

const emit = defineEmits(['togglePlay', 'seek', 'setVolume'])

// --- STATE ---
const isLoading = ref(false)
const error = ref(null)
const episode = ref(null)

// --- AUDIO HANDLERS ---
const togglePlay = (ep) => emit('togglePlay', ep)
const seek = (time) => emit('seek', time)
const setVolume = (volume) => emit('setVolume', volume)

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
}

// --- MOCK DATA ---
const MOCK_EPISODES = {
  1: {
    id: 1,
    title: 'Fela Kuti: Enter the Shrine',
    date: 'Nov 28, 2025',
    duration: 250,
    audioUrl: felaAudio,
    cover: defaultArtwork,
    description: 'Can music actually create a political movement?',
  },
}

// --- FETCH LOGIC ---
const fetchEpisode = async (id) => {
  if (!id) return
  isLoading.value = true
  error.value = null
  episode.value = null

  try {
    const fetchedEpisode = MOCK_EPISODES[id]
    if (!fetchedEpisode) {
      throw new Error(`Episode with ID ${id} not found in mock data.`)
    }

    episode.value = {
      id: fetchedEpisode.id,
      title: fetchedEpisode.title,
      releaseDate: new Date(fetchedEpisode.date).toISOString(),
      duration: fetchedEpisode.duration,
      audioUrl: fetchedEpisode.audioUrl,
      artworkUrl: fetchedEpisode.cover,
      description: fetchedEpisode.description,
      spotifyUrl: 'http://googleusercontent.com/spotify-link-for-' + id,
    }

    if (episode.value) {
      togglePlay(episode.value)
      if (props.isPlaying) togglePlay(episode.value)
    }
  } catch (err) {
    error.value = `Error loading episode ${id}: ${err.message}`
    console.error(error.value)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchEpisode(props.episodeId)
})

watch(
  () => props.episodeId,
  (newId) => fetchEpisode(newId),
)

// --- COMPUTED PROPERTIES ---
const episodeDate = computed(() => {
  if (!episode.value?.releaseDate) return 'Date Not Available'
  try {
    return new Date(episode.value.releaseDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return 'Invalid Date'
  }
})

const episodeTitle = computed(() => episode.value?.title || 'Episode Title Loading...')
const episodeDescription = computed(() => episode.value?.description || 'No description provided.')
const profileImage = computed(() => episode.value?.artworkUrl || defaultArtwork)
const profileAlt = computed(() =>
  episode.value?.title ? `${episode.value.title} Artwork` : 'Podcast Artwork',
)
const spotifyLink = computed(() => episode.value?.spotifyUrl || '#spotify-link')
const downloadLink = computed(() => episode.value?.audioUrl || '#download-link')
</script>

<template>
  <div class="w-full">
    <FwbCard v-if="isLoading || error || !episode" class="text-center p-8 max-w-md mx-auto">
      <div v-if="isLoading" class="text-gray-500">Loading episode...</div>
      <div v-else-if="error" class="text-red-500 font-bold">{{ error }}</div>
      <div v-else class="text-gray-500">Episode data not available.</div>
    </FwbCard>

    <div
      v-else
      class="max-w-md mx-auto shadow-xl rounded-xl overflow-visible bg-white poppins-font"
    >
      <div class="w-full h-[200px] overflow-hidden rounded-t-xl">
        <img :src="profileImage" :alt="profileAlt" class="w-full h-full object-cover block" />
      </div>

      <div class="bg-gray-50 p-6 rounded-b-xl overflow-visible">
        <p class="text-[10px] text-gray-400 mb-1 tracking-widest uppercase font-medium">
          {{ episodeDate }}
        </p>

        <h2 class="text-lg font-medium text-gray-900 mb-2 leading-snug">
          {{ episodeTitle }}
        </h2>

        <p class="text-gray-600 text-xs leading-relaxed mb-6 line-clamp-2">
          {{ episodeDescription }}
        </p>

        <div class="mb-6">
          <div class="h-1 bg-gray-200 rounded-full mb-2">
            <div
              class="h-1 bg-indigo-600 rounded-full transition-all duration-150"
              :style="{ width: `${(props.currentTime / props.duration) * 100}%` }"
            ></div>
          </div>
          <div class="flex justify-between text-[10px] font-light text-gray-400">
            <span>{{ formatTime(props.currentTime) }}</span>
            <span>{{ formatTime(props.duration) }}</span>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2">
          <div @click="togglePlay(episode)" class="listen-ghost-btn group">
            <div class="play-icon-circle">
              <svg
                v-if="props.currentTrack?.id === episode.id && props.isPlaying"
                class="w-3 h-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6 4h2v12H6V4zm6 0h2v12h-2V4z" />
              </svg>
              <svg
                v-else
                class="w-3 h-3 translate-x-[0.5px]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8 5v10l8-5-8-5z" />
              </svg>
            </div>
            <span class="text-sm font-normal">
              {{ props.currentTrack?.id === episode.id && props.isPlaying ? 'Pause' : 'Listen' }}
            </span>
          </div>

          <div class="flex items-center space-x-2">
            <a
              :href="spotifyLink"
              target="_blank"
              class="w-8 h-8 action-button text-[#1DB954] rounded-full"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 0C5.378 0 0 5.378 0 12s5.378 12 12 12 12-5.378 12-12S18.622 0 12 0zm5.504 17.31c-.22.359-.685.474-1.037.254-2.855-1.748-6.448-2.142-10.682-1.171-.41.092-.823-.16-.914-.572-.092-.411.16-.823.572-.914 4.639-1.06 8.604-.613 11.806 1.345.352.215.467.679.255 1.058zm1.47-3.26c-.277.45-.866.594-1.314.317-3.268-2.008-8.25-2.592-12.116-1.417-.508.154-1.04-.136-1.194-.645-.154-.509.136-1.04.646-1.194 4.414-1.34 9.907-.683 13.662 1.624.448.277.593.866.317 1.315zm.126-3.414c-3.92-2.327-10.38-2.542-14.137-1.403-.6.182-1.24-.163-1.423-.763-.182-.6.163-1.24.763-1.423 4.313-1.31 11.444-1.049 15.96 1.633.54.32.718 1.02.398 1.56-.32.538-1.02.718-1.561.4z"
                />
              </svg>
            </a>

            <fwb-dropdown placement="top" class="inline-block">
              <template #trigger>
                <div class="w-8 h-8 action-button text-gray-500 rounded-full cursor-pointer">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    stroke-width="2.5"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </template>

              <fwb-list-group class="radiolab-popup-menu custom-scrollbar">
                <fwb-list-group-item
                  :href="downloadLink"
                  :download="episodeTitle + '.mp3'"
                  component="a"
                  class="menu-item-clean"
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/724/724933.png"
                    class="w-4 h-4"
                    alt="Download"
                  />
                  <span>Download episode</span>
                </fwb-list-group-item>

                <fwb-list-group-item component="a" :href="appleMusicLink" class="menu-item-clean">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                    class="w-4 h-4"
                    alt="Apple"
                  />
                  <span>Apple podcasts</span>
                </fwb-list-group-item>

                <fwb-list-group-item component="a" :href="soundcloudLink" class="menu-item-clean">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/145/145809.png"
                    class="w-4 h-4"
                    alt="SoundCloud"
                  />
                  <span>Soundcloud</span>
                </fwb-list-group-item>

                <fwb-list-group-item component="a" :href="youtubeLink" class="menu-item-clean">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
                    class="w-4 h-4"
                    alt="YouTube"
                  />
                  <span>Youtube</span>
                </fwb-list-group-item>
              </fwb-list-group>
            </fwb-dropdown>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap');

.poppins-font {
  font-family: 'Poppins', sans-serif !important;
}

/* 1. COMPACT CARD */
.max-w-md {
  max-width: 320px !important;
}

/* 2. RADIOLAB LISTEN BUTTON */
.listen-ghost-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 6px 16px 6px 6px;
  border-radius: 9999px;
  transition: all 0.3s ease;
  color: #1f2937;
}

.play-icon-circle {
  width: 28px;
  height: 28px;
  background: #111827;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.listen-ghost-btn:hover {
  background: #111827;
  color: white;
}

.listen-ghost-btn:hover .play-icon-circle {
  background: white;
  color: #111827;
}

/* 3. ACTION BUTTONS */
.action-button {
  background-color: transparent !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.action-button:hover {
  background-color: #f3f4f6 !important;
}

/* 4. POP-UP MENU */
.fwb-dropdown-menu {
  z-index: 9999 !important;
  border: none !important;
  background-color: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
  margin-bottom: 12px !important;
}

.radiolab-popup-menu {
  width: 185px !important;
  background: white !important;
  border: none !important;
  border-radius: 8px !important;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12) !important;
  padding: 6px 0 !important;
}

.menu-item-clean {
  border: none !important;
  background-color: white !important;
  color: #4b5563 !important;
  padding: 10px 16px !important;
  font-size: 13px !important;
  font-weight: 400 !important;
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  transition: all 0.2s;
}

.menu-item-clean:hover {
  background-color: #f9fafb !important;
  color: #111827 !important;
}

/* Platform Icons are now always visible (removed grayscale) */
.menu-item-clean img {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

/* Description handling - ensures it's readable and capped at 2 lines */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Force strip Flowbite selection backgrounds */
.fwb-list-group-item:first-child,
.fwb-list-group-item:focus,
.fwb-list-group-item:active {
  background-color: white !important;
  outline: none !important;
}

/* SCROLLBAR */
.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 10px;
}
</style>
