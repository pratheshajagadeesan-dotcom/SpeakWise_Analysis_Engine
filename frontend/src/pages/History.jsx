import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import api from '../services/api.js'
import Card from '../components/Card.jsx'

function StatCard({ label, value }) {
    return (
        <div style={{
            background: 'linear-gradient(135deg, #dbeafe, #ccfbf1)',
            borderRadius: 14, padding: '16px 20px', flex: 1, minWidth: 120,
            border: '1.5px solid #bfdbfe',
        }}>
            <p style={{ fontSize: 13, color: '#1e3a8a', marginBottom: 4, fontWeight: 600 }}>{label}</p>
            <p style={{ fontSize: 26, fontWeight: 700, color: '#0f172a' }}>{value}</p>
        </div>
    )
}

const PIE_COLORS = ['#22c55e', '#f59e0b', '#ef4444']

export default function History() {
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        api.get('/sessions')
            .then((res) => setSessions(res.data))
            .catch(() => setError('Could not load your history.'))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div className="container">Loading history...</div>

    const withScores = sessions.filter((s) => s.wpm != null && s.relevanceScore != null)
    const avgWpm = withScores.length
        ? Math.round(withScores.reduce((sum, s) => sum + s.wpm, 0) / withScores.length)
        : 0
    const avgRelevance = withScores.length
        ? Math.round(withScores.reduce((sum, s) => sum + s.relevanceScore, 0) / withScores.length)
        : 0
    const bestRelevance = withScores.length
        ? Math.max(...withScores.map((s) => s.relevanceScore))
        : 0

    // Chronological order (oldest first) for the trend line
    const chartData = [...withScores]
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map((s, i) => ({
            name: `#${i + 1}`,
            WPM: Math.round(s.wpm),
            Relevance: Math.round(s.relevanceScore),
        }))

    const goodCount = withScores.filter((s) => s.relevanceScore >= 70).length
    const midCount = withScores.filter((s) => s.relevanceScore >= 40 && s.relevanceScore < 70).length
    const badCount = withScores.filter((s) => s.relevanceScore < 40).length
    const pieData = [
        { name: 'Good (70%+)', value: goodCount },
        { name: 'Okay (40-69%)', value: midCount },
        { name: 'Needs work (<40%)', value: badCount },
    ].filter((d) => d.value > 0)

    return (
        <div className="container">
            <h2>Session History</h2>
            {error && <p className="error-text">{error}</p>}

            {sessions.length > 0 && (
                <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                    <StatCard label="Total sessions" value={sessions.length} />
                    <StatCard label="Average pace" value={`${avgWpm} WPM`} />
                    <StatCard label="Average relevance" value={`${avgRelevance}%`} />
                    <StatCard label="Best relevance" value={`${bestRelevance}%`} />
                </div>
            )}

            {chartData.length >= 2 && (
                <Card>
                    <h3 style={{ marginTop: 0 }}>Progress over time</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="WPM" stroke="#1e3a8a" strokeWidth={2} dot={{ r: 4 }} />
                            <Line type="monotone" dataKey="Relevance" stroke="#0f766e" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            )}

            {pieData.length > 0 && (
                <Card>
                    <h3 style={{ marginTop: 0 }}>Relevance score breakdown</h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                {pieData.map((entry, index) => (
                                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            )}

            {sessions.length === 0 && !error && <p>No sessions yet — go practice a question!</p>}

            {sessions.map((s) => (
                <Card key={s.sessionId}>
                    <p style={{ fontWeight: 600 }}>{s.questionText}</p>
                    <p style={{ fontSize: 13, color: '#6b7280' }}>{new Date(s.createdAt).toLocaleString()}</p>
                    <p>WPM: {s.wpm ?? '—'} &nbsp;|&nbsp; Relevance: {s.relevanceScore ?? '—'}%</p>
                    <Link to={`/report/${s.sessionId}`}>View Report</Link>
                </Card>
            ))}
        </div>
    )
}