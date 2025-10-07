type Entry = { id:number; title:string; content:string; emoji?:string; created_at:string }
type Props = { items: Entry[], onDelete:(id:number)=>void }

export default function EntryList({ items, onDelete }: Props){
  return (
    <div className="list">
      {items.map(e => (
        <div className="card" key={e.id}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <strong>{e.emoji} {e.title || '(Sin título)'}</strong>
            <button onClick={()=>onDelete(e.id)}>Eliminar</button>
          </div>
          <div style={{opacity:.8, fontSize:12}}>{new Date(e.created_at).toLocaleString()}</div>
          <p>{e.content}</p>
        </div>
      ))}
    </div>
  )
}
