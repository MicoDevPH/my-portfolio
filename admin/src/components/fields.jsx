import { useId, useState } from 'react'
import { uploadFile } from '../api'
import { thumb } from '../lib/thumb'

// Label + hint wrapper shared by every input
function FieldShell({ field, htmlFor, children }) {
  return (
    <div className={field.half ? 'sm:col-span-1' : 'sm:col-span-2'}>
      <label htmlFor={htmlFor} className="nb-eyebrow block mb-2 text-(--color-text)">
        {field.label}
        {field.required && <span className="text-(--color-red)"> *</span>}
      </label>
      {children}
      {field.hint && <p className="m-0 mt-1.5 text-[13px] text-(--color-muted)">{field.hint}</p>}
    </div>
  )
}

// Upload a file to Cloudinary, or paste a URL. Shows a preview of what's set.
function MediaInput({ value, onChange, kind, folder, id }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploading(true)
    setError('')
    try {
      onChange(await uploadFile(file, folder))
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2.5">
      {value && kind === 'image' && (
        <img src={thumb(value, 320)} alt="" className="w-40 aspect-square object-cover border-[3px] border-(--color-ink) bg-(--color-sunken)" />
      )}
      {value && kind === 'audio' && <audio src={value} controls preload="none" className="w-full max-w-md" />}
      <div className="flex gap-2">
        <input
          id={id}
          className="nb-input flex-1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Upload a file or paste a URL"
        />
        <label className={`nb-btn nb-btn-yellow nb-press shrink-0 ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
          {uploading ? 'Uploading…' : 'Upload'}
          <input
            type="file"
            accept={kind === 'image' ? 'image/*' : 'audio/*'}
            className="hidden"
            onChange={onFile}
            disabled={uploading}
          />
        </label>
      </div>
      {error && <p className="m-0 text-[13px] font-semibold text-(--color-red)">Upload failed: {error}</p>}
    </div>
  )
}

function CreditsInput({ value, onChange, roles }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {roles.map((role) => (
        <label key={role} className="flex flex-col gap-1">
          <span className="text-[13px] font-semibold capitalize">{role}</span>
          <textarea
            className="nb-input resize-y"
            rows={Math.max(2, value[role].split('\n').length)}
            value={value[role]}
            onChange={(e) => onChange({ ...value, [role]: e.target.value })}
          />
        </label>
      ))}
    </div>
  )
}

// Editable list of rows; `renderRow` draws the inputs for one row
function RowList({ rows, onChange, blank, addLabel, renderRow }) {
  const update = (i, patch) => onChange(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)))
  const move = (i, to) => {
    const next = [...rows]
    ;[next[i], next[to]] = [next[to], next[i]]
    onChange(next)
  }
  return (
    <div className="flex flex-col gap-3">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-3 items-start p-3 border-2 border-(--color-ink) bg-(--color-sunken)">
          <div className="flex-1 min-w-0 flex flex-col gap-2">{renderRow(row, (patch) => update(i, patch))}</div>
          <div className="flex flex-col gap-1.5 shrink-0">
            <button type="button" className="nb-btn nb-btn-sm" disabled={i === 0} onClick={() => move(i, i - 1)} aria-label="Move up">▲</button>
            <button type="button" className="nb-btn nb-btn-sm" disabled={i === rows.length - 1} onClick={() => move(i, i + 1)} aria-label="Move down">▼</button>
            <button type="button" className="nb-btn nb-btn-sm nb-btn-red" onClick={() => onChange(rows.filter((_, j) => j !== i))} aria-label="Remove">✕</button>
          </div>
        </div>
      ))}
      <button type="button" className="nb-btn nb-press self-start" onClick={() => onChange([...rows, blank])}>
        + {addLabel}
      </button>
    </div>
  )
}

export function Field({ field, value, onChange }) {
  const id = useId()

  let input
  switch (field.type) {
    case 'textarea':
    case 'lines':
      input = <textarea id={id} className="nb-input resize-y" rows={field.rows ?? 3} value={value} onChange={(e) => onChange(e.target.value)} />
      break
    case 'select':
      input = (
        <select id={id} className="nb-input" value={value} onChange={(e) => onChange(e.target.value)}>
          {!field.options.some((o) => o.value === '') && <option value="">Choose…</option>}
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      )
      break
    case 'checkbox':
      return (
        <label className="sm:col-span-2 flex items-center gap-3 font-semibold cursor-pointer">
          <input type="checkbox" className="w-5 h-5 accent-(--color-ink)" checked={value} onChange={(e) => onChange(e.target.checked)} />
          {field.label}
        </label>
      )
    case 'month':
      input = <input id={id} type="month" className="nb-input" value={value} onChange={(e) => onChange(e.target.value)} />
      break
    case 'image':
    case 'audio':
      input = <MediaInput id={id} value={value} onChange={onChange} kind={field.type} folder={field.folder} />
      break
    case 'credits':
      input = <CreditsInput value={value} onChange={onChange} roles={field.roles} />
      break
    case 'links':
      input = (
        <RowList
          rows={value}
          onChange={onChange}
          blank={{ label: '', url: '' }}
          addLabel="Add link"
          renderRow={(row, set) => (
            <div className="flex flex-col sm:flex-row gap-2">
              <input className="nb-input sm:w-40" placeholder="Label" value={row.label} onChange={(e) => set({ label: e.target.value })} />
              <input className="nb-input flex-1" placeholder="https://…" value={row.url} onChange={(e) => set({ url: e.target.value })} />
            </div>
          )}
        />
      )
      break
    case 'gallery':
      input = (
        <RowList
          rows={value}
          onChange={onChange}
          blank={{ src: '', caption: '' }}
          addLabel="Add screenshot"
          renderRow={(row, set) => (
            <>
              <MediaInput value={row.src} onChange={(src) => set({ src })} kind="image" folder={field.folder} />
              <input className="nb-input" placeholder="Caption" value={row.caption} onChange={(e) => set({ caption: e.target.value })} />
            </>
          )}
        />
      )
      break
    default:
      input = (
        <div className="flex gap-3 items-center">
          {field.preview && value && <img src={value} alt="" className="w-11 h-11 p-1.5 bg-white border-[3px] border-(--color-ink) shrink-0" />}
          <input id={id} type={field.type === 'url' ? 'url' : 'text'} className="nb-input" value={value} onChange={(e) => onChange(e.target.value)} />
        </div>
      )
  }

  return (
    <FieldShell field={field} htmlFor={id}>
      {input}
    </FieldShell>
  )
}
