import { useState } from 'react'
import { api } from '../api'
import { emptyForm, formToItem, isFilled, itemToForm } from '../lib/formValues'
import { Field } from './fields'

// Create (item = null) or edit one item of a section
export default function ItemForm({ section, item, onSaved, onCancel, onError }) {
  const [form, setForm] = useState(() => (item ? itemToForm(section.fields, item) : emptyForm(section.fields)))
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const set = (name) => (value) => setForm((f) => ({ ...f, [name]: value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    const missing = section.fields.filter((f) => f.required && !isFilled(f, form[f.name]))
    if (missing.length) return setMessage(`Please fill in: ${missing.map((f) => f.label).join(', ')}`)

    setSaving(true)
    setMessage('')
    try {
      const data = formToItem(section.fields, form)
      if (item) await api.update(section.key, item._id, { ...data, slug: item.slug, order: item.order })
      else await api.create(section.key, data)
      onSaved()
    } catch (err) {
      onError(err)
      setMessage(err.message)
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="nb-box p-5 sm:p-7">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="m-0 font-display font-bold uppercase text-[28px] leading-none">
          {item ? `Edit ${section.noun}` : `New ${section.noun}`}
        </h2>
        {item?.slug && <span className="nb-chip bg-(--color-sunken)">/{item.slug}</span>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6">
        {section.fields.map((field) => (
          <Field key={field.name} field={field} value={form[field.name]} onChange={set(field.name)} />
        ))}
      </div>

      {message && <p className="mt-6 mb-0 font-semibold text-(--color-red)">{message}</p>}

      <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t-[3px] border-(--color-ink)">
        <button type="submit" className="nb-btn nb-btn-yellow nb-press" disabled={saving}>
          {saving ? 'Saving…' : item ? 'Save changes' : `Add ${section.noun}`}
        </button>
        <button type="button" className="nb-btn nb-press" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  )
}
