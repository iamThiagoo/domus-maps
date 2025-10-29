import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', {
  state: () => ({
    search: '',
    bairroSearch: '',
  }),
  actions: {
    setSearch(value: string) {
      this.search = value
    },
    clearSearch() {
      this.search = ''
    },
    setBairroSearch(value: string) {
      this.bairroSearch = value
    },
    clearBairroSearch() {
      this.bairroSearch = ''
    },
  },
})
