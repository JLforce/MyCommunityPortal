"use client";
import { useState, useMemo } from 'react';

export default function UsersPanel(){
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState([
    { id: 1, name: 'Jane Doe', email: 'jane.doe@example.com', role: 'Resident', status: 'active' },
    { id: 2, name: 'John Smith', email: 'john.smith@example.com', role: 'City Official', status: 'active' },
    { id: 3, name: 'Alice Park', email: 'alice.park@example.com', role: 'Resident', status: 'inactive' },
    { id: 4, name: 'Carlos Tan', email: 'carlos.tan@example.com', role: 'City Official', status: 'active' }
  ]);

  const filtered = useMemo(()=>{
    return users.filter(u => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
    });
  },[users, query, roleFilter]);

  function addUser(){
    const id = Math.max(0, ...users.map(u=>u.id)) + 1;
    const demo = { id, name: `New User ${id}`, email: `user${id}@example.com`, role: 'Resident', status: 'active' };
    setUsers([demo,...users]);
  }

  function removeUser(id){
    if (!confirm('Delete this user?')) return;
    setUsers(users.filter(u=>u.id!==id));
  }

  function editUser(u){
    const name = prompt('Edit user name', u.name);
    if (name == null) return;
    setUsers(users.map(x => x.id === u.id ? {...x, name} : x));
  }

  return (
    <div style={{paddingTop:8}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,marginBottom:18}}>
        <div>
          <h1 style={{margin:0,fontSize:28,fontWeight:800,color:'#064e3b'}}>Users</h1>
          <p style={{margin:0,color:'#6b7280'}}>Manage user accounts and roles</p>
        </div>

        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <select value={roleFilter} onChange={(e)=>setRoleFilter(e.target.value)} style={{padding:'8px 10px',borderRadius:8,border:'1px solid #E6F6EE'}}>
            <option value="all">All roles</option>
            <option value="Resident">Resident</option>
            <option value="City Official">City Official</option>
          </select>
          <button onClick={addUser} style={{background:'#065f46',color:'#fff',border:'none',padding:'10px 14px',borderRadius:8,fontWeight:700}}>Add User</button>
        </div>
      </div>

      <div style={{background:'#fff',borderRadius:12,padding:16,boxShadow:'0 8px 20px rgba(2,6,23,0.04)'}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search users..." style={{flex:1,padding:'10px 12px',borderRadius:8,border:'1px solid #E6F6EE'}} />
          <div style={{minWidth:120,textAlign:'right',color:'#6b7280'}}>{filtered.length} result{filtered.length!==1 ? 's' : ''}</div>
        </div>

        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',minWidth:800}}>
            <thead>
              <tr style={{textAlign:'left',color:'#6b7280'}}>
                <th style={{padding:'12px 12px'}}>Name</th>
                <th style={{padding:'12px 12px'}}>Email</th>
                <th style={{padding:'12px 12px'}}>Role</th>
                <th style={{padding:'12px 12px'}}>Status</th>
                <th style={{padding:'12px 12px',textAlign:'right'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} style={{borderTop:'1px solid #F1F5F9'}}>
                  <td style={{padding:'14px 12px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:12}}>
                      <div style={{width:40,height:40,display:'grid',placeItems:'center',borderRadius:8,background:'#F3F9F6'}}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                          <circle cx="12" cy="8" r="3" fill="#064e3b" />
                          <path d="M4 20c1.5-4 7-4 8-4s6.5 0 8 4" fill="#064e3b" />
                        </svg>
                      </div>
                      <div>
                        <div style={{fontWeight:700,color:'#0f172a'}}>{u.name}</div>
                        <div style={{fontSize:13,color:'#6b7280'}}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding:'14px 12px'}}>{u.email}</td>
                  <td style={{padding:'14px 12px'}}>{u.role}</td>
                  <td style={{padding:'14px 12px'}}>
                    <span style={{padding:'6px 10px',borderRadius:999,background: u.status==='active' ? '#ECFDF5' : '#FEF3F2',color: u.status==='active' ? '#065f46' : '#B91C1C',fontWeight:700,fontSize:12}}>{u.status}</span>
                  </td>
                  <td style={{padding:'14px 12px',textAlign:'right'}}>
                    <button onClick={()=>editUser(u)} style={{background:'transparent',border:'1px solid #E6F6EE',padding:'8px 10px',borderRadius:8,marginRight:8}}>Edit</button>
                    <button onClick={()=>removeUser(u.id)} style={{background:'#fff',border:'1px solid #FECACA',color:'#B91C1C',padding:'8px 10px',borderRadius:8}}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
