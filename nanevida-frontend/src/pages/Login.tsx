
import { useState } from 'react'
import { api, setToken } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()

  async function onSubmit(e: React.FormEvent){
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/token/', { username, password })
      setToken(data.access)
      nav('/')
    } catch {
      setError('Credenciales inválidas o servidor caído.')
    }
  }

  return (
    <div>
      <h2>Iniciar sesión</h2>
      <p style={{color:'#64748b', marginTop:0}}>Usa la cuenta que creaste en el backend con <code>createsuperuser</code>.</p>
      <form className="form" onSubmit={onSubmit}>
        <div>
          <label>Usuario</label>
          <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="tu_usuario" />
        </div>
        <div>
          <label>Contraseña</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="********" />
        </div>
        <div style={{display:'flex', gap:12}}>
          <button className="btn btn--primary">Entrar</button>
          <button className="btn" type="button" onClick={()=>{setUsername(''); setPassword(''); setError('')}}>Limpiar</button>
        </div>
        {error && <p style={{color:'crimson', margin:0}}>{error}</p>}
      </form>
    </div>
  )
}
