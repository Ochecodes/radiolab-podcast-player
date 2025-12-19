<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { FwbCard } from 'flowbite-vue'
import { FwbDropdown, FwbListGroup, FwbListGroupItem } from 'flowbite-vue'
// import defaultArtwork from '@/assets/src\assets\wilfried-vowoto-9-VxSBJz6F8-unsplash.jpg'

// Import a default image if you have one, or use a placeholder string
const defaultArtwork = 'https://via.placeholder.com/400x225?text=No+Image'

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

// --- FETCH LOGIC ---
const fetchEpisode = async (id) => {
  if (!id) return
  isLoading.value = true
  try {
    // 1. Fetch the post
    const response = await fetch(
      `https://admin.karahousemedia.com/wp-json/wp/v2/posts/${id}?_embed`,
    )
    const data = await response.json()

    let finalAudio = data.acf?.audio_file_url

    // 2. If it's just a number, fetch the media URL specifically
    if (finalAudio && !isNaN(finalAudio)) {
      const mediaRes = await fetch(
        `https://admin.karahousemedia.com/wp-json/wp/v2/media/${finalAudio}`,
      )
      const mediaData = await mediaRes.json()
      finalAudio = mediaData.source_url // This turns '19' into 'https://...mp3'
    }

    episode.value = {
      id: data.id,
      title: data.title?.rendered,
      description: data.acf?.short_description,
      releaseDate: data.date,
      audioUrl: finalAudio,
      artworkUrl:
        typeof data.acf?.episode_image === 'string'
          ? data.acf.episode_image
          : data._embedded?.['wp:featuredmedia']?.[0]?.source_url || defaultArtwork,
    }

    console.log('Audio URL finally fixed in Vue:', episode.value.audioUrl)
  } catch (err) {
    console.error('Fetch failed', err)
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
const spotifyLink = computed(() => episode.value?.spotifyUrl || '#')
const appleMusicLink = computed(() => episode.value?.appleUrl || '#')
const soundcloudLink = computed(() => episode.value?.soundcloudUrl || '#')
const youtubeLink = computed(() => episode.value?.youtubeUrl || '#')
const downloadLink = computed(() => episode.value?.audioUrl || '#')
</script>

<template>
  <div class="w-full px-4 py-8 flex justify-center items-center">
    <FwbCard v-if="isLoading || error || !episode" class="text-center p-8 w-full max-w-sm">
      <div v-if="isLoading" class="text-gray-500">Loading episode...</div>
      <div v-else-if="error" class="text-red-500 font-bold">{{ error }}</div>
      <div v-else class="text-gray-500">Episode data not available.</div>
    </FwbCard>

    <div
      v-else
      class="w-full max-w-[340px] shadow-2xl rounded-2xl overflow-visible bg-white poppins-font transition-all duration-300 hover:shadow-3xl"
    >
      <div class="w-full aspect-video overflow-hidden rounded-t-2xl">
        <img
          :src="profileImage"
          :alt="profileAlt"
          class="w-full h-full object-cover block transition-transform duration-500 hover:scale-105"
        />
      </div>

      <div class="bg-gray-50 p-5 sm:p-7 rounded-b-2xl overflow-visible">
        <p class="text-[10px] text-gray-400 mb-1 tracking-widest uppercase font-semibold">
          {{ episodeDate }}
        </p>

        <h2 class="text-base sm:text-lg font-medium text-gray-900 mb-2 leading-tight min-h-[3rem]">
          {{ episodeTitle }}
        </h2>

        <p class="text-gray-500 text-xs leading-relaxed mb-6 line-clamp-2 font-light">
          {{ episodeDescription }}
        </p>

        <div class="mb-6">
          <div class="h-1.5 bg-gray-200 rounded-full mb-2">
            <div
              class="h-1.5 bg-indigo-600 rounded-full transition-all duration-200"
              :style="{ width: `${(props.currentTime / (props.duration || 1)) * 100}%` }"
            ></div>
          </div>
          <div class="flex justify-between text-[10px] font-medium text-gray-400 font-mono">
            <span>{{ formatTime(props.currentTime) }}</span>
            <span>{{ formatTime(props.duration) }}</span>
          </div>
        </div>

        <div class="flex items-center justify-between gap-2 pt-2">
          <div @click="togglePlay(episode)" class="listen-ghost-btn group shrink-0">
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
            <span class="text-xs sm:text-sm font-normal pr-1">
              {{ props.currentTrack?.id === episode.id && props.isPlaying ? 'Pause' : 'Listen' }}
            </span>
          </div>

          <div class="flex items-center space-x-1 sm:space-x-2">
            <a
              :href="spotifyLink"
              target="_blank"
              class="w-9 h-9 sm:w-10 sm:h-10 action-button text-[#1DB954] rounded-full"
            >
              <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 0C5.378 0 0 5.378 0 12s5.378 12 12 12 12-5.378 12-12S18.622 0 12 0zm5.504 17.31c-.22.359-.685.474-1.037.254-2.855-1.748-6.448-2.142-10.682-1.171-.41.092-.823-.16-.914-.572-.092-.411.16-.823.572-.914 4.639-1.06 8.604-.613 11.806 1.345.352.215.467.679.255 1.058zm1.47-3.26c-.277.45-.866.594-1.314.317-3.268-2.008-8.25-2.592-12.116-1.417-.508.154-1.04-.136-1.194-.645-.154-.509.136-1.04.646-1.194 4.414-1.34 9.907-.683 13.662 1.624.448.277.593.866.317 1.315zm.126-3.414c-3.92-2.327-10.38-2.542-14.137-1.403-.6.182-1.24-.163-1.423-.763-.182-.6.163-1.24.763-1.423 4.313-1.31 11.444-1.049 15.96 1.633.54.32.718 1.02.398 1.56-.32.538-1.02.718-1.561.4z"
                />
              </svg>
            </a>

            <fwb-dropdown placement="top" class="inline-block">
              <template #trigger>
                <div
                  class="w-9 h-9 sm:w-10 sm:h-10 action-button text-gray-400 rounded-full cursor-pointer"
                >
                  <svg
                    class="w-4 h-4 sm:w-5 sm:h-5"
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
                    alt=""
                  />
                  <span>Download episode</span>
                </fwb-list-group-item>
                <fwb-list-group-item component="a" :href="appleMusicLink" class="menu-item-clean">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                    class="w-4 h-4"
                    alt=""
                  />
                  <span>Apple podcasts</span>
                </fwb-list-group-item>
                <fwb-list-group-item component="a" :href="soundcloudLink" class="menu-item-clean">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/145/145809.png"
                    class="w-4 h-4"
                    alt=""
                  />
                  <span>Soundcloud</span>
                </fwb-list-group-item>
                <fwb-list-group-item component="a" :href="youtubeLink" class="menu-item-clean">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
                    class="w-4 h-4"
                    alt=""
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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

.poppins-font {
  font-family: 'Poppins', sans-serif !important;
}

.listen-ghost-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 14px 4px 4px;
  border-radius: 9999px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #111827;
  border: 1px solid transparent;
  user-select: none;
}

.play-icon-circle {
  width: 32px;
  height: 32px;
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

.action-button {
  background-color: transparent !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.action-button:hover {
  background-color: rgba(0, 0, 0, 0.05) !important;
}

.fwb-dropdown-menu {
  z-index: 9999 !important;
  border: none !important;
  background-color: transparent !important;
  box-shadow: none !important;
  margin-bottom: 12px !important;
}

.radiolab-popup-menu {
  width: 200px !important;
  background: white !important;
  border-radius: 12px !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
  padding: 8px 0 !important;
}

.menu-item-clean {
  border: none !important;
  background-color: white !important;
  color: #374151 !important;
  padding: 12px 20px !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  display: flex !important;
  align-items: center !important;
  gap: 14px !important;
}

.aspect-video {
  aspect-ratio: 16 / 9;
  width: 100%;
  display: block;
}

/* Ensure the image within it behaves */
.aspect-video img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 10px;
}
</style>
