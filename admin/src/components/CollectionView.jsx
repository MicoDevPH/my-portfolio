import { useCallback, useEffect, useState } from 'react'
import { api } from '../api'
import ItemForm from './ItemForm'
import { thumb } from '../lib/thumb'

// List, reorder, delete and open the editor for one section
export default function CollectionView({ section, onError }) {
  const [items, setItems] = useState(null)
  const [editing, setEditing] = useState(null) // null | 'new' | item
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  const load = useCallback(async () => {
    try {
      setItems(await api.list(section.key))
    } catch (err) {
      onError(err)
    }
  }, [section.key, onError])

  useEffect(() => {
    let cancelled = false
    api
      .list(section.key)
      .then((data) => !cancelled && setItems(data))
      .catch(onError)
    return () => {
      cancelled = true
    }
  }, [section.key, onError])

  const flash = (text) => {
    setNotice(text)
    setTimeout(() => setNotice(''), 4000)
  }

  // Switch between the list and the editor, starting at the top of the page
  const open = (target) => {
    setEditing(target)
    window.scrollTo(0, 0)
  }

  const onSaved = () => {
    open(null)
    flash('Saved. The live site updates within about 30 seconds.')
    load()
  }

  const onDelete = async (item) => {
    if (!window.confirm(`Delete "${section.title(item)}"? This can't be undone.`)) return
    setBusy(true)
    try {
      await api.remove(section.key, item._id)
      flash('Deleted.')
      await load()
    } catch (err) {
      onError(err)
    } finally {
      setBusy(false)
    }
  }

  // Swap two items, then save `order` = position for anything that moved
  const move = async (from, to) => {
    const next = [...items]
    ;[next[from], next[to]] = [next[to], next[from]]
    setItems(next)
    setBusy(true)
    try {
      await Promise.all(
        next.map((item, order) => (item.order === order ? null : api.update(section.key, item._id, { ...item, order }))),
      )
      await load()
    } catch (err) {
      onError(err)
      await load()
    } finally {
      setBusy(false)
    }
  }

  if (editing) {
    return (
      <ItemForm
        key={editing === 'new' ? 'new' : editing._id}
        section={section}
        item={editing === 'new' ? null : editing}
        onSaved={onSaved}
        onCancel={() => open(null)}
        onError={onError}
      />
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <p className="m-0 nb-eyebrow">
          {items ? `${items.length} ${items.length === 1 ? section.noun : section.plural}` : 'Loading…'}
        </p>
        <button className="nb-btn nb-btn-yellow nb-press" onClick={() => open('new')}>
          + New {section.noun}
        </button>
      </div>

      {section.note && <p className="m-0 mb-5 text-[14px] text-(--color-muted)">{section.note}</p>}
      {notice && <p className="nb-box m-0 mb-5 px-4 py-3 font-semibold bg-(--color-green)! text-white">{notice}</p>}

      <ul className={`list-none m-0 p-0 flex flex-col gap-3 ${busy ? 'opacity-60 pointer-events-none' : ''}`}>
        {items?.map((item, i) => (
          <li key={item._id} className="nb-box flex items-center gap-4 p-3">
            {section.thumb && (
              <span className="w-14 h-14 shrink-0 border-[3px] border-(--color-ink) bg-white flex items-center justify-center overflow-hidden">
                {item[section.thumb] ? (
                  <img
                    src={thumb(item[section.thumb], 112)}
                    alt=""
                    className={section.thumb === 'icon' ? 'w-9 h-9' : 'w-full h-full object-cover'}
                    loading="lazy"
                  />
                ) : (
                  <span className="font-pixel text-[14px]">♪</span>
                )}
              </span>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display font-bold uppercase text-[19px] leading-tight">{section.title(item)}</span>
                {section.badge?.(item) && <span className="nb-chip bg-(--color-yellow)">{section.badge(item)}</span>}
              </div>
              <p className="m-0 mt-1 text-[14px] text-(--color-muted) truncate">{section.subtitle(item)}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden sm:flex flex-col gap-1">
                <button className="nb-btn nb-btn-sm" disabled={i === 0} onClick={() => move(i, i - 1)} aria-label="Move up">▲</button>
                <button className="nb-btn nb-btn-sm" disabled={i === items.length - 1} onClick={() => move(i, i + 1)} aria-label="Move down">▼</button>
              </div>
              <button className="nb-btn nb-btn-sm nb-press" onClick={() => open(item)}>Edit</button>
              <button className="nb-btn nb-btn-sm nb-btn-red nb-press" onClick={() => onDelete(item)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
