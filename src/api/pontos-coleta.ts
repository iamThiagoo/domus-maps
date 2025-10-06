export const usePontosColetaApi = () => {
  const baseURL = import.meta.env.VITE_API_BASE + '/pontos'

  const getAll = async () => {
    const response = await fetch(baseURL)
    return await response.json()
  }

  return { getAll }
}
