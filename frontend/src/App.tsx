import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { AlertCircle, ArrowDownWideNarrow, Check, CheckCircle2, ClipboardList, Clock3, Filter, LoaderCircle, Plus, RefreshCw, Send, X } from 'lucide-react'
import { solicitationApi, type Category, type Priority, type Solicitation, type Status } from './api'

const categories: Category[] = ['INFRAESTRUTURA_TI', 'RH', 'VENDAS', 'MARKETING', 'GERAL']
const priorities: Priority[] = ['BAIXA', 'MEDIA', 'ALTA']
const statuses: Status[] = ['ABERTA', 'EM_ANDAMENTO', 'CONCLUIDA']
const categoryLabels: Record<Category, string> = { INFRAESTRUTURA_TI: 'INFRAESTRUTURA/TI', RH: 'RH', VENDAS: 'VENDAS', MARKETING: 'MARKETING', GERAL: 'GERAL' }
const statusLabel: Record<Status, string> = { ABERTA: 'Aberta', EM_ANDAMENTO: 'Em andamento', CONCLUIDA: 'Concluída' }
const priorityLabel: Record<Priority, string> = { BAIXA: 'Baixa', MEDIA: 'Média', ALTA: 'Alta' }

function formatTimestamp(value: string): string {
  const instant = new Date(value)
  if (Number.isNaN(instant.getTime())) return value
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(instant)
}

function App() {
  const [items, setItems] = useState<Solicitation[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [filterStatus, setFilterStatus] = useState<Status | ''>('')
  const [filterPriority, setFilterPriority] = useState<Priority | ''>('')
  const [filtered, setFiltered] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<Category>('GERAL')
  const [priority, setPriority] = useState<Priority | ''>('')
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const loadItems = useCallback(async (useFilter = filtered) => {
    setLoading(true); setError('')
    try {
      const data = useFilter && filterStatus && filterPriority
        ? await solicitationApi.filter(filterStatus, filterPriority)
        : await solicitationApi.list()
      setItems(data)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível carregar as solicitações.') }
    finally { setLoading(false) }
  }, [filtered, filterStatus, filterPriority])

  useEffect(() => { void loadItems(false) }, []) // Initial view always starts with GET /consultar.

  async function applyFilters(event: FormEvent) {
    event.preventDefault()
    if (!filterStatus || !filterPriority) { setError('Selecione status e prioridade para filtrar.'); return }
    setFiltered(true)
    setLoading(true); setError('')
    try { setItems(await solicitationApi.filter(filterStatus, filterPriority)) }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível aplicar os filtros.') }
    finally { setLoading(false) }
  }

  async function clearFilters() {
    setFilterStatus(''); setFilterPriority(''); setFiltered(false)
    setLoading(true); setError('')
    try { setItems(await solicitationApi.list()) }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível carregar as solicitações.') }
    finally { setLoading(false) }
  }

  async function createSolicitation(event: FormEvent) {
    event.preventDefault(); setFormError(''); setNotice('')
    if (!title.trim() || !description.trim() || !category || !priority) {
      setFormError('Preencha título, descrição, categoria e prioridade.'); return
    }
    setSaving(true)
    try {
      await solicitationApi.create({ title: title.trim(), description: description.trim(), category, priority })
      setTitle(''); setDescription(''); setCategory('GERAL'); setPriority('')
      setFiltered(false); setFilterStatus(''); setFilterPriority('')
      setNotice('Solicitação registrada com sucesso.')
      setLoading(true)
      try { setItems(await solicitationApi.list()); setError('') }
      catch (cause) { setError(cause instanceof Error ? cause.message : 'Cadastro realizado, mas não foi possível atualizar a lista.') }
      finally { setLoading(false) }
    } catch (cause) { setFormError(cause instanceof Error ? cause.message : 'Não foi possível registrar a solicitação.') }
    finally { setSaving(false) }
  }

  async function transition(item: Solicitation, action: 'accept' | 'complete') {
    setBusyId(item.solicitationId); setError(''); setNotice('')
    try {
      if (action === 'accept' && item.status === 'ABERTA') await solicitationApi.accept(item.solicitationId)
      else if (action === 'complete' && item.status === 'EM_ANDAMENTO') await solicitationApi.complete(item.solicitationId)
      else return
      setNotice(action === 'accept' ? 'Solicitação aceita.' : 'Solicitação concluída.')
      await loadItems()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível atualizar a solicitação.') }
    finally { setBusyId(null) }
  }

  return <main className="page-shell">
    <header className="topbar">
      <button className="theme-button" type="button" aria-label="Alternar tema claro ou escuro" aria-pressed="false" onClick={event => {
        const root = document.documentElement
        const current = root.dataset.theme ? root.dataset.theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
        const next = current ? 'light' : 'dark'
        root.dataset.theme = next
        event.currentTarget.setAttribute('aria-pressed', String(next === 'dark'))
        event.currentTarget.setAttribute('aria-label', next === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro')
      }}><span className="theme-glyph" aria-hidden="true">◐</span><span className="theme-label">Tema</span></button>
      <div className="brand"><span className="brand-mark"><ClipboardList size={20} /></span><span>Central<span className="brand-light"> de solicitações</span></span></div>
      <span className="topbar-caption">Organização e acompanhamento em um só lugar</span>
    </header>

    <section className="hero" id="inicio">
      <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot" /> CENTRAL DE SOLICITAÇÕES</div><h1>Pedidos claros.<br />Progresso visível.</h1><p>Acompanhe cada etapa e mantenha o trabalho em movimento.</p></div>
      <div className="hero-summary" aria-label="Resumo da lista atual">
        <span className="summary-caption">NA LISTA ATUAL</span>
        <div className="summary-grid">
          <div className="summary-item"><span className="summary-value">{items.filter(item => item.status === 'ABERTA').length}</span><span className="summary-label">Abertas</span></div>
          <div className="summary-item"><span className="summary-value">{items.filter(item => item.status === 'EM_ANDAMENTO').length}</span><span className="summary-label">Em andamento</span></div>
          <div className="summary-item"><span className="summary-value">{items.filter(item => item.status === 'CONCLUIDA').length}</span><span className="summary-label">Concluídas</span></div>
        </div>
      </div>
    </section>

    <div className="content-grid">
      <section className="form-panel panel" aria-labelledby="form-title">
        <div className="section-heading"><div><span className="section-kicker">NOVA SOLICITAÇÃO</span><h2 id="form-title">Abrir um ticket</h2></div><span className="heading-icon"><Plus size={19} /></span></div>
        <p className="form-intro">Descreva o que precisa e encaminhe para a equipe certa.</p>
        <form onSubmit={createSolicitation} noValidate>
          <label className="field-label" htmlFor="title">Título <span>*</span></label>
          <input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex.: Acesso ao sistema" maxLength={180} required />
          <label className="field-label" htmlFor="description">Descrição <span>*</span></label>
          <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Descreva o que está acontecendo e inclua detalhes úteis..." rows={4} required />
          <div className="field-row">
          <div><label className="field-label" htmlFor="category">Categoria <span>*</span></label><select id="category" value={category} onChange={e => setCategory(e.target.value as Category)} required>{categories.map(value => <option key={value} value={value}>{categoryLabels[value]}</option>)}</select></div>
            <div><label className="field-label" htmlFor="priority">Prioridade <span>*</span></label><select id="priority" value={priority} onChange={e => setPriority(e.target.value as Priority | '')} required><option value="" disabled>Selecione</option>{priorities.map(value => <option key={value} value={value}>{priorityLabel[value]}</option>)}</select></div>
          </div>
          {formError && <div className="inline-alert error" role="alert"><AlertCircle size={16} />{formError}</div>}
          <button className="primary-button submit-button" type="submit" disabled={saving}>{saving ? <LoaderCircle className="spin" size={17} /> : <Send size={16} />}{saving ? 'Enviando...' : 'Registrar solicitação'}</button>
          <p className="required-note">* Campos obrigatórios</p>
        </form>
      </section>

      <section className="list-column" aria-labelledby="list-title">
        <div className="list-heading"><div><span className="section-kicker">ACOMPANHAMENTO</span><h2 id="list-title">Seus tickets</h2></div><span className="count-pill" aria-label={`${items.length} solicitações na lista atual`}>{items.length}</span></div>
        <form className="filter-bar" onSubmit={applyFilters}>
          <div className="filter-title"><Filter size={16} /><span>Filtrar</span></div>
          <label className="sr-only" htmlFor="filter-status">Status</label><select id="filter-status" value={filterStatus} onChange={e => setFilterStatus(e.target.value as Status | '')}><option value="">Status</option>{statuses.map(value => <option key={value} value={value}>{statusLabel[value]}</option>)}</select>
          <label className="sr-only" htmlFor="filter-priority">Prioridade</label><select id="filter-priority" value={filterPriority} onChange={e => setFilterPriority(e.target.value as Priority | '')}><option value="">Prioridade</option>{priorities.map(value => <option key={value} value={value}>{priorityLabel[value]}</option>)}</select>
          <div className="filter-actions"><button className="filter-button" type="submit"><ArrowDownWideNarrow size={15} /><span>Filtrar</span></button>
          {filtered && <button className="clear-filter" type="button" onClick={() => void clearFilters()}><X size={15} /><span>Limpar</span></button>}</div>
        </form>
        {notice && <div className="inline-alert success" role="status"><CheckCircle2 size={17} />{notice}<button type="button" onClick={() => setNotice('')} aria-label="Fechar aviso"><X size={15} /></button></div>}
        {error && <div className="inline-alert error list-error" role="alert"><AlertCircle size={17} /><span>{error}</span><button type="button" onClick={() => void loadItems()} aria-label="Tentar novamente"><RefreshCw size={15} /></button></div>}
        {loading ? <div className="state-card" role="status"><LoaderCircle className="spin" size={23} /><span>Carregando solicitações...</span></div>
          : items.length === 0 ? <div className="state-card empty-state"><div className="empty-icon"><ClipboardList size={23} /></div><strong>{filtered ? 'Nenhum resultado encontrado' : 'Tudo começa com uma solicitação'}</strong><span>{filtered ? 'Tente alterar os filtros selecionados.' : 'Quando houver solicitações, elas aparecerão aqui.'}</span></div>
          : <div className="request-list">{items.map(item => <article className={`request-card priority-${item.priority.toLowerCase()}`} key={item.solicitationId}>
              <div className="ticket-main">
                <div className="request-top"><span className={`status-badge status-${item.status.toLowerCase()}`}><i />{statusLabel[item.status]}</span><span className={`priority-tag priority-${item.priority.toLowerCase()}`}><span className="priority-flag" aria-hidden="true">⚑</span>Prioridade {priorityLabel[item.priority]}</span></div>
                <h3>{item.title}</h3><p className="request-description">{item.description}</p>
                <div className="ticket-progress" role="img" aria-label={`Etapa atual: ${statusLabel[item.status]}`}>
                  <div className="progress-segments" aria-hidden="true">{statuses.map((step, index) => <span className={`progress-segment${index <= statuses.indexOf(item.status) ? item.status === 'CONCLUIDA' ? ' is-complete' : ' is-active' : ''}`} key={step} />)}</div>
                  <div className="progress-labels">{statuses.map(step => <span className={`progress-label${step === item.status ? ' is-current' : statuses.indexOf(step) < statuses.indexOf(item.status) ? ' is-reached' : ''}${item.status === 'CONCLUIDA' ? ' is-complete' : ''}`} key={step}>{statusLabel[step]}</span>)}</div>
                </div>
              </div>
              <div className="ticket-stub">
                <div className="request-footer">{item.category && <span className="category-tag">{categoryLabels[item.category] ?? item.category}</span>}<span className="request-id">#{item.solicitationId.slice(0, 8)}</span></div>
                <div className="ticket-timeline" aria-label="Linha do tempo da solicitação">
                  <div className="timeline-event"><span className="timeline-icon"><Clock3 size={14} /></span><div className="timeline-copy"><span className="time-label">Início</span><time dateTime={item.startedAt ?? undefined}>{item.startedAt ? formatTimestamp(item.startedAt) : 'Ainda n\u00e3o iniciado'}</time></div></div>
                  <div className={`timeline-event${item.status === 'CONCLUIDA' && item.completedAt ? ' is-complete' : ''}`}><span className="timeline-icon"><CheckCircle2 size={14} /></span><div className="timeline-copy"><span className="time-label">Conclusão</span><time dateTime={item.completedAt ?? undefined}>{item.completedAt ? formatTimestamp(item.completedAt) : 'Em aberto'}</time></div></div>
                </div>
                <div className="ticket-action">
                  {item.status === 'ABERTA' && <button className="action-button" type="button" disabled={busyId === item.solicitationId} onClick={() => void transition(item, 'accept')}>{busyId === item.solicitationId ? <LoaderCircle className="spin" size={15} /> : <Check size={15} />}Aceitar</button>}
                  {item.status === 'EM_ANDAMENTO' && <button className="action-button complete-action" type="button" disabled={busyId === item.solicitationId} onClick={() => void transition(item, 'complete')}>{busyId === item.solicitationId ? <LoaderCircle className="spin" size={15} /> : <CheckCircle2 size={15} />}Concluir</button>}
                  {item.status === 'CONCLUIDA' && <span className="ticket-attended"><CheckCircle2 size={16} />Atendida</span>}
                </div>
              </div>
            </article>)}</div>}
        {!loading && items.length > 0 && <div className="list-endnote"><span />Fim da lista<span /></div>}
      </section>
    </div>
    <footer className="footer"><span>Central de solicitações</span><span>Feito para dar andamento ao que importa.</span></footer>
  </main>
}

export default App
