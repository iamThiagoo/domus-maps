export function getMapsLink(local: any): string {
  if (local.latitude && local.longitude) {
    return `https://www.google.com/maps?q=${local.latitude},${local.longitude}`
  }

  const address = [
    local.nome,
    local.endereco,
    local.numero_endereco,
    local.nome_bairro,
    local.nome_cidade,
    local.sigla_estado,
    local.cep,
  ].filter(Boolean)

  const query = encodeURIComponent(address.join(', '))
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}
