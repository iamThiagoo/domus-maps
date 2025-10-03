export const usePontosColetaApi = () => {
  // const baseURL = import.meta.env.VITE_API_BASE + '/pontos'

  const getAll = async () => {
    // const { data, error } = await useFetch(baseURL)
    // if (error.value) throw error.value
    // return data.value
  }

  const getById = async (_id: number | string) => {
    // const { data, error } = await useFetch(`${baseURL}/${id}`)
    // if (error.value) throw error.value
    // return data.value
  }

  return { getAll, getById }
}
