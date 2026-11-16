export type Priority = 'BAIXA' | 'MEDIA' | 'ALTA'
export type Status = 'ABERTA' | 'EM_ANDAMENTO' | 'CONCLUIDA'
export type Category = 'INFRAESTRUTURA_TI' | 'RH' | 'VENDAS' | 'MARKETING' | 'GERAL'

export interface Solicitation {
  solicitationId: string
  title: string
  description: string
  status: Status
  category: Category
  priority: Priority
  startedAt: string | null
  completedAt: string | null
}

export interface CreateSolicitation {
  title: string
  description: string
  category: Category
  priority: Priority
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/loading/central-solicitacoes').replace(/\/$/, '')

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { ...(init?.body ? { 'Content-Type': 'application/json' } : {}), ...init?.headers },
    })
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está ativo e se a origem do frontend está liberada por CORS.')
  }

  const text = await response.text()
  let body: unknown = text
  if (text) {
    try { body = JSON.parse(text) as unknown } catch { /* Respostas textuais são válidas, inclusive no cadastro. */ }
  }
  if (!response.ok) {
    const detail = body && typeof body === 'object' ? body as Record<string, unknown> : undefined
    const message = typeof detail?.error === 'string'
      ? detail.error
      : typeof detail?.message === 'string'
        ? detail.message
        : typeof body === 'string' && body.trim() ? body : `A solicitação falhou (HTTP ${response.status}).`
    throw new Error(message)
  }
  return body as T
}

export const solicitationApi = {
  list: () => request<Solicitation[]>('/consultar'),
  filter: (status: Status, priority: Priority) => request<Solicitation[]>(`/filtros?status=${encodeURIComponent(status)}&priority=${encodeURIComponent(priority)}`),
  create: (data: CreateSolicitation) => request<string>('/registrar', { method: 'POST', body: JSON.stringify(data) }),
  accept: (solicitationId: string) => request<string>('/aceitar', { method: 'POST', body: JSON.stringify({ solicitationId }) }),
  complete: (solicitationId: string) => request<string>('/concluir', { method: 'POST', body: JSON.stringify({ solicitationId }) }),
}
