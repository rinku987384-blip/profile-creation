import { useEffect, useState } from 'react'
import RouteLayout from '../components/RouteLayout.jsx'
import { getAdminUsers } from '../services/api.js'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    getAdminUsers().then(({ users: result }) => { if (active) setUsers(result) })
      .catch((requestError) => { if (active) setError(requestError.message) })
    return () => { active = false }
  }, [])
  return <RouteLayout><section className="route-page admin-page"><span className="eyebrow">ACCOUNTS</span><h1>All users</h1>{error && <p className="route-error">{error}</p>}<div className="admin-table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead><tbody>{users.map((user) => <tr key={user._id}><td>{user.name}</td><td>{user.email}</td><td>{user.role}</td><td>{new Date(user.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></div></section></RouteLayout>
}
