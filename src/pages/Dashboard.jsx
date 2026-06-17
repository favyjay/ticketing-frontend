import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Import our new API helper

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    fetchTickets(token);
  }, [navigate]);

  const fetchTickets = async (token) => {
    try {
      const res = await api.get('/tickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch tickets.');
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const token = localStorage.getItem('token');

    try {
      await api.post(
        '/tickets',
        { title, description, priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Ticket created successfully!');
      setTitle('');
      setDescription('');
      setPriority('medium');
      fetchTickets(token);
    } catch (err) {
      setError('Failed to create ticket.');
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    setError('');
    const token = localStorage.getItem('token');

    try {
      await api.put(
        `/tickets/${ticketId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTickets(token);
    } catch (err) {
      setError('Failed to update ticket status.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isAgent = user && user.role === 'agent';

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>Ticketing System ({isAgent ? 'Agent' : 'Customer'})</h1>
        <div style={styles.userInfo}>
          <span style={styles.userEmail}>{user ? user.email : 'Loading...'}</span>
          <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
        </div>
      </header>

      <main style={styles.main}>
        {error && <div style={styles.errorAlert}>{error}</div>}
        {success && <div style={styles.successAlert}>{success}</div>}

        <div style={isAgent ? styles.singleColumn : styles.grid}>
          
          {!isAgent && (
            <section style={styles.formSection}>
              <h2 style={styles.sectionTitle}>Create a New Ticket</h2>
              <form onSubmit={handleCreateTicket} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Ticket Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Priority Level</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)} style={styles.select}>
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Issue Description</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={styles.textarea}
                    rows="5"
                    required
                  />
                </div>

                <button type="submit" style={styles.submitButton}>Submit Ticket</button>
              </form>
            </section>
          )}

          <section style={styles.listSection}>
            <h2 style={styles.sectionTitle}>
              {isAgent ? 'All Incoming Customer Tickets' : 'Your Support Tickets'} ({tickets.length})
            </h2>
            
            {tickets.length === 0 ? (
              <p style={styles.noTickets}>No tickets found.</p>
            ) : (
              <div style={styles.ticketList}>
                {tickets.map((ticket) => (
                  <div key={ticket.id} style={styles.ticketCard}>
                    <div style={styles.ticketHeader}>
                      <h3 style={styles.ticketTitle}>{ticket.title}</h3>
                      <span style={{
                        ...styles.badge,
                        backgroundColor: 
                          ticket.status === 'open' ? '#3b82f633' : 
                          ticket.status === 'in_progress' ? '#eab30833' : '#22c55e33',
                        color: 
                          ticket.status === 'open' ? '#60a5fa' : 
                          ticket.status === 'in_progress' ? '#fde047' : '#86efac'
                      }}>
                        {ticket.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <p style={styles.ticketDescription}>{ticket.description}</p>
                    
                    <div style={styles.ticketFooter}>
                      <span style={styles.ticketPriority}>Priority: {ticket.priority}</span>
                      <span style={styles.ticketDate}>
                        Created: {new Date(ticket.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {isAgent && (
                      <div style={styles.agentActionBox}>
                        <label style={styles.agentLabel}>Change Status:</label>
                        <select 
                          value={ticket.status} 
                          onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                          style={styles.agentSelect}
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved (Closed)</option>
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    fontFamily: 'system-ui, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    backgroundColor: '#1e293b',
    borderBottom: '1px solid #334155'
  },
  logo: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#3b82f6'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  userEmail: {
    fontSize: '14px',
    color: '#cbd5e1'
  },
  logoutButton: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #ef4444',
    backgroundColor: 'transparent',
    color: '#fca5a5',
    cursor: 'pointer',
    fontSize: '14px'
  },
  main: {
    padding: '40px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    alignItems: 'start'
  },
  singleColumn: {
    display: 'block',
    maxWidth: '800px',
    margin: '0 auto'
  },
  sectionTitle: {
    fontSize: '20px',
    margin: '0 0 20px 0',
    color: '#f8fafc',
    borderBottom: '1px solid #334155',
    paddingBottom: '10px'
  },
  form: {
    backgroundColor: '#1e293b',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#94a3b8'
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #475569',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #475569',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #475569',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  ticketList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxHeight: '600px',
    overflowY: 'auto',
    paddingRight: '10px'
  },
  ticketCard: {
    backgroundColor: '#1e293b',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #334155'
  },
  ticketHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  ticketTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 'bold'
  },
  badge: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 'bold'
  },
  ticketDescription: {
    margin: '0 0 15px 0',
    fontSize: '14px',
    color: '#cbd5e1',
    lineHeight: '1.5'
  },
  ticketFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#94a3b8',
    marginBottom: '15px'
  },
  agentActionBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    borderTop: '1px solid #334155',
    paddingTop: '15px',
    marginTop: '10px'
  },
  agentLabel: {
    fontSize: '13px',
    color: '#cbd5e1'
  },
  agentSelect: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #475569',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    fontSize: '13px',
    cursor: 'pointer'
  },
  noTickets: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: '40px'
  },
  errorAlert: {
    backgroundColor: '#ef444422',
    border: '1px solid #ef4444',
    color: '#fca5a5',
    padding: '12px 20px',
    borderRadius: '6px',
    marginBottom: '25px'
  },
  successAlert: {
    backgroundColor: '#22c55e22',
    border: '1px solid #22c55e',
    color: '#86efac',
    padding: '12px 20px',
    borderRadius: '6px',
    marginBottom: '25px'
  }
};