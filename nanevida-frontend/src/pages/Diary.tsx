import { useEffect, useState } from 'react'
import { api } from '../api'
import { useNavigate } from 'react-router-dom'
import EntryForm from '../components/EntryForm'
import EntryList from '../components/EntryList'

type Entry = { id:number; title:string; content:string; emoji?:string; created_at:string }

export default function Diary(){
  const [items, setItems] = useState<Entry[]>([])
  const [error, setError] = useState('')
  const nav = useNavigate()

  async function load(){
    try{
      const { data } = await api.get('/entries/')
      setItems(data)
      setError('')
    }catch(e:any){
      if (e?.response?.status === 401) { nav('/login'); return }
      setError('Error al cargar tu diario.')
    }
  }

  useEffect(()=>{ load() }, [])

  async function save(entry:{title:string;content:string;emoji?:string}){
    try{
      const { data } = await api.post('/entries/', entry)
      setItems([data, ...items])
      setError('')
    }catch(e:any){
      if (e?.response?.status === 401) { nav('/login'); return }
      setError('Error al guardar la entrada.')
    }
  }

  async function del(id:number){
    try{
      await api.delete(`/entries/${id}/`)
      setItems(items.filter(i=>i.id!==id))
      setError('')
    }catch(e:any){
      if (e?.response?.status === 401) { nav('/login'); return }
      setError('No se pudo eliminar la entrada.')
    }
  }

  return (
    <div>
      <h2>Diario personal</h2>
      <EntryForm onSave={save}/>
      {error && <p style={{color:'crimson'}}>{error}</p>}
      <EntryList items={items} onDelete={del}/>
    </div>
  )
}
