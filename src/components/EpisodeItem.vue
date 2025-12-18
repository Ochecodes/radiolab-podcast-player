<script setup>
defineProps({
  episode: Object,
  isActive: Boolean,
  isPlaying: Boolean,
})
</script>

<template>
  <div
    class="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition"
    :class="{ 'bg-blue-50': isActive }"
    @click="$emit('play', episode)"
  >
    <div class="relative w-12 h-12 mr-4">
      <img :src="episode.cover" class="w-full h-full rounded object-cover" alt="Art" />
      <div
        v-if="isActive && isPlaying"
        class="absolute inset-0 bg-black/30 flex items-center justify-center rounded"
      >
        <span class="text-white text-xs">Playing</span>
      </div>
    </div>

    <div class="flex-1">
      <h4 class="text-sm font-bold text-gray-800" :class="{ 'text-blue-600': isActive }">
        {{ episode.title }}
      </h4>
      <p class="text-xs text-gray-500">{{ episode.date }} • {{ episode.duration }}</p>
    </div>

    <button class="text-gray-400 hover:text-blue-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
        />
      </svg>
    </button>
  </div>
</template>
