import { useState } from 'react'

type Props = { onSave: (data:{title:string;content:string;emoji?:string})=>void }

export default function EntryForm({ onSave }: Props){
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [emoji, setEmoji] = useState('🙂')

  return (
    <form onSubmit={e=>{e.preventDefault(); if(!content.trim()){alert('Contenido requerido');return;} onSave({title,content,emoji}); setTitle(''); setContent('')}}>
      <label>Título</label>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Mi día..."/>
      <label>Contenido</label>
      <textarea rows={4} value={content} onChange={e=>setContent(e.target.value)} placeholder="Escribe cómo te sientes..."/>
      <label>Emoji</label>
      <select value={emoji} onChange={e=>setEmoji(e.target.value)}>
        <option>🙂</option><option>😢</option><option>😡</option><option>😴</option><option>🤩</option>
      </select>
      <button>Guardar</button>
    </form>
  )
}
