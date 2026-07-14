import { useEffect, useState } from 'react'
import api from '../services/api.js'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'

export default function Admin() {
    const [questions, setQuestions] = useState([])
    const [loadingList, setLoadingList] = useState(true)

    const [editingId, setEditingId] = useState(null)
    const [text, setText] = useState('')
    const [category, setCategory] = useState('')
    const [keyPointsRaw, setKeyPointsRaw] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)

    const loadQuestions = () => {
        setLoadingList(true)
        api.get('/admin/questions')
            .then((res) => setQuestions(res.data))
            .catch(() => setError('Could not load questions.'))
            .finally(() => setLoadingList(false))
    }

    useEffect(() => { loadQuestions() }, [])

    const resetForm = () => {
        setEditingId(null)
        setText(''); setCategory(''); setKeyPointsRaw('')
    }

    const startEdit = (q) => {
        setEditingId(q.id)
        setText(q.text)
        setCategory(q.category || '')
        setKeyPointsRaw(q.expectedKeyPoints.join(', '))
        setMessage('')
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setMessage('')
        setSaving(true)

        const expectedKeyPoints = keyPointsRaw.split(',').map((k) => k.trim()).filter(Boolean)

        try {
            if (editingId) {
                await api.put(`/admin/questions/${editingId}`, { text, category, expectedKeyPoints })
                setMessage('Question updated successfully.')
            } else {
                await api.post('/admin/questions', { text, category, expectedKeyPoints })
                setMessage('Question added successfully.')
            }
            resetForm()
            loadQuestions()
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save question.')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this question? This cannot be undone.')) return
        try {
            await api.delete(`/admin/questions/${id}`)
            setMessage('Question deleted.')
            if (editingId === id) resetForm()
            loadQuestions()
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete question.')
        }
    }

    return (
        <div className="container">
            <h2>Admin — Manage Questions</h2>

            <Card>
                <h3 style={{ marginTop: 0 }}>{editingId ? 'Edit question' : 'Add a new question'}</h3>
                {message && <p style={{ color: '#166534', marginBottom: 12 }}>{message}</p>}
                {error && <p className="error-text">{error}</p>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <input
                        style={{ display: 'block', width: '100%', padding: '12px 14px', borderRadius: 10, border: '2px solid #e2e8f0' }}
                        placeholder="Question text" value={text} onChange={(e) => setText(e.target.value)} required
                    />
                    <input
                        style={{ display: 'block', width: '100%', padding: '12px 14px', borderRadius: 10, border: '2px solid #e2e8f0' }}
                        placeholder="Category (e.g. Technical, Behavioral)" value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                    <input
                        style={{ display: 'block', width: '100%', padding: '12px 14px', borderRadius: 10, border: '2px solid #e2e8f0' }}
                        placeholder="Expected key points, comma-separated"
                        value={keyPointsRaw} onChange={(e) => setKeyPointsRaw(e.target.value)} required
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Button type="submit" disabled={saving}>
                            {saving ? 'Saving...' : editingId ? 'Update question' : 'Add question'}
                        </Button>
                        {editingId && (
                            <Button type="button" variant="secondary" onClick={resetForm}>Cancel edit</Button>
                        )}
                    </div>
                </form>
            </Card>

            <h3>All questions</h3>
            {loadingList && <p>Loading questions...</p>}
            {!loadingList && questions.length === 0 && <p>No questions yet.</p>}

            {questions.map((q) => (
                <Card key={q.id}>
                    <p style={{ fontWeight: 600, marginBottom: 4 }}>{q.text}</p>
                    <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
                        {q.category} · Key points: {q.expectedKeyPoints.join(', ')}
                    </p>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Button variant="secondary" onClick={() => startEdit(q)}>Edit</Button>
                        <Button variant="secondary" onClick={() => handleDelete(q.id)}>Delete</Button>
                    </div>
                </Card>
            ))}
        </div>
    )
}