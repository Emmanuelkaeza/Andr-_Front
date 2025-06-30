import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useColorMode } from '@vueuse/core'

export const useThemeStore = defineStore('theme', () => {
  const colorMode = useColorMode({
    modes: {
      light: 'light',
      dark: 'dark'
    }
  })

  const isDark = ref(colorMode.value === 'dark')

  const toggleTheme = () => {
    isDark.value = !isDark.value
    colorMode.value = isDark.value ? 'dark' : 'light'
    
    // Apply theme to document
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const initTheme = () => {
    isDark.value = colorMode.value === 'dark'
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return {
    isDark,
    toggleTheme,
    initTheme
  }
})
