# Radiolab-Style Podcast Player 

A sleek, responsive, and highly aesthetic podcast player component built with **Vue 3**, **Vite**, and **Tailwind CSS**. This player is inspired by the minimalist and sophisticated design language of [Radiolab.org](https://www.radiolab.org).

## Features

- **Radiolab Aesthetic:** Clean whitespace, elegant "Poppins" typography, and a very light grey (`bg-gray-50`) body contrast.
- **Dynamic Ghost Button:** Interactive "Listen" button that transitions from a ghost state to a solid black pill on hover.
- **Clean Overlapping Popup:** A custom-styled dropdown menu for platform links (Apple, SoundCloud, YouTube) and downloads that overlaps the card rather than pushing content down.
- **Progress Tracking:** A functional progress bar with real-time time stamps.
- **Fully Responsive:** Designed to look great on mobile and desktop.
- **Optimized Images:** Full-bleed image header with perfect object-fit scaling.

## Tech Stack

- **Framework:** [Vue.js 3](https://vuejs.org/) (SFC)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Flowbite Vue](https://flowbite-vue.com/)
- **Fonts:** [Poppins](https://fonts.google.com/specimen/Poppins) (Google Fonts)

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation

1. **Clone the repository:**

   ```bash
   git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)
   cd YOUR_REPO_NAME

   ```

2. **Install dependencies:**
   npm install

3. **Run the development server:**
   npm run dev

### Customization

The component is highly modular. To change the theme colors or card dimensions, you can modify the <style> section in PodcastPlayer.vue:

/_ Update the brand color here _/
.listen-ghost-btn:hover, .action-button:hover {
background-color: #6b21a8 !important; /_ Brand Purple _/
}

### License

Distributed under the MIT License. See LICENSE for more information.

Build with ❤️ and curiosity.
