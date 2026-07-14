import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../services/api.js'
import QuestionCard from '../components/QuestionCard.jsx'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import AudioRecorder from '../components/AudioRecorder.jsx'

export default function Practice() {
    const [questions, setQuestions] = useState([])
    const [loadingQuestions, setLoadingQuestions] = useState(true)
    const [selectedQuestion, setSelectedQuestion] = useState(null)
    const [mode, setMode] = useState('upload')
    const [file, setFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        api.get('/questions')
            .then((res) => {
                setQuestions(res.data)
                const preselectId = searchParams.get('questionId')
                if (preselectId) {
                    const match = res.data.find((q) => String(q.id) === preselectId)
                    if (match) setSelectedQuestion(match)
                }
            })
            .catch(() => setError('Could not load questions from the server.'))
            .finally(() => setLoadingQuestions(false))
    }, [searchParams])

    const switchMode = (newMode) => {
        setMode(newMode)
        setFile(null)
        setError('')
    }

    const handleFileChange = (e) => {
        const selected = e.target.files[0]
        if (!selected) return
        const ext = selected.name.split('.').pop().toLowerCase()
        if (!['mp3', 'wav', 'm4a'].includes(ext)) {
            setError('Only mp3, wav, or m4a files are allowed.')
            setFile(null)
            return
        }
        setError('')
        setFile(selected)
    }

    const handleSubmit = async () => {
        if (!selectedQuestion) { setError('Select a question first.'); return }
        if (!file) { setError(mode === 'record' ? 'Record your answer first.' : 'Choose an audio file first.'); return }

        setUploading(true)
        setError('')

        const formData = new FormData()
        formData.append('questionId', selectedQuestion.id)
        formData.append('audio', file)

        try {
            const res = await api.post('/sessions', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            navigate(`/report/${res.data.sessionId}`)
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed. Try again.')
        } finally {
            setUploading(false)
        }
    }

    if (loadingQuestions) return <div className="container">Loading questions...</div>

    return (
        <div className="container">
            <h2>Practice</h2>
            {error && <p className="error-text">{error}</p>}

            <h3>1. Pick a question</h3>
            {questions.map((q) => (
                <QuestionCard
                    key={q.id}
                    question={q}
                    selected={selectedQuestion?.id === q.id}
                    onSelect={setSelectedQuestion}
                />
            ))}

            <h3>2. Provide your answer</h3>
            <Card>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    <Button
                        variant={mode === 'upload' ? 'primary' : 'secondary'}
                        onClick={() => switchMode('upload')}
                    >
                        📁 Upload a file
                    </Button>
                    <Button
                        variant={mode === 'record' ? 'primary' : 'secondary'}
                        onClick={() => switchMode('record')}
                    >
                        🎙️ Record now
                    </Button>
                </div>

                {mode === 'upload' ? (
                    <input type="file" accept=".mp3,.wav,.m4a" onChange={handleFileChange} />
                ) : (
                    <AudioRecorder onRecordingReady={(recordedFile) => setFile(recordedFile)} />
                )}

                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Button onClick={handleSubmit} disabled={uploading || !file}>
                        {uploading ? 'Analyzing your answer...' : 'Submit for Analysis'}
                    </Button>
                    {uploading && (
                        <div style={{
                            width: 20, height: 20, borderRadius: '50%',
                            border: '3px solid #dbeafe', borderTopColor: '#1e3a8a',
                            animation: 'spin 0.8s linear infinite',
                        }} />
                    )}
                </div>
            </Card>
        </div>
    )
}