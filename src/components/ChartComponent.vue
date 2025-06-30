<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ title }}</h3>
    <div class="relative h-64">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

// Enregistrer les composants Chart.js
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface Props {
  title: string
  type: 'line' | 'bar' | 'doughnut' | 'pie'
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor?: string | string[]
      borderColor?: string
      borderWidth?: number
    }[]
  }
  options?: any
}

const props = defineProps<Props>()

const chartCanvas = ref<HTMLCanvasElement>()
let chartInstance: Chart | null = null

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: 'rgb(107, 114, 128)' // gray-500
      }
    },
    title: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgb(243, 244, 246)' // gray-100
      },
      ticks: {
        color: 'rgb(107, 114, 128)' // gray-500
      }
    },
    x: {
      grid: {
        color: 'rgb(243, 244, 246)' // gray-100
      },
      ticks: {
        color: 'rgb(107, 114, 128)' // gray-500
      }
    }
  }
}

const createChart = () => {
  if (!chartCanvas.value) return

  destroyChart()

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  const chartOptions = props.options ? { ...defaultOptions, ...props.options } : defaultOptions

  // Pour les graphiques en secteurs, on supprime les scales
  if (props.type === 'doughnut' || props.type === 'pie') {
    delete chartOptions.scales
  }

  chartInstance = new Chart(ctx, {
    type: props.type,
    data: props.data,
    options: chartOptions
  })
}

const destroyChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
}

onMounted(() => {
  createChart()
})

onBeforeUnmount(() => {
  destroyChart()
})

// Recréer le graphique quand les données changent
watch(() => props.data, () => {
  createChart()
}, { deep: true })

watch(() => props.type, () => {
  createChart()
})
</script>
