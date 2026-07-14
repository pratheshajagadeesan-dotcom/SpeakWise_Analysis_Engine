import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../services/api.js'
import Card from '../components/Card.jsx'
import ScoreBadge from '../components/ScoreBadge.jsx'
import Button from '../components/Button.jsx'

export default function Report() {
    const { id } = useParams()
    const [report, setReport] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        api.get(`/sessions/${id}/report`)
            .then((res) => setReport(res.data))
            .catch(() => setError('Could not load this report.'))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return <div className="container">Loading report...</div>
    if (error) return <div className="container"><p className="error-text">{error}</p></div>

    return (
        <div className="container">
            <h2>Speech Report</h2>
            <Card>
                <p style={{ fontWeight: 600, marginBottom: 8 }}>{report.questionText}</p>
                <ScoreBadge score={report.relevanceScore} />
            </Card>

            <Card>
                <h3>Delivery</h3>
                <p><strong>Pace:</strong> {report.wpm} WPM</p>
                <p><strong>Long pauses (&gt;2s):</strong> {report.pauseCount}</p>
                <p><strong>Filler words used:</strong> {report.fillerCount}</p>
            </Card>

            <Card>
                <h3>Content Relevance</h3>
                <p><strong>Relevance score:</strong> {report.relevanceScore}%</p>
                <p><strong>Missing key points:</strong> {report.missingKeyPoints || 'None — nice coverage!'}</p>
            </Card>

            <Card>
                <h3>Tip</h3>
                <p>{report.tipMessage}</p>
            </Card>

            <Card>
                <h3>Transcript</h3>
                <p style={{ color: '#4b5563' }}>{report.transcript}</p>
            </Card>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <Button onClick={() => navigate(`/practice?questionId=${report.questionId}`)}>
                    🔁 Re-record this question
                </Button>
                <Link to="/practice" style={{ alignSelf: 'center' }}>Practice a different question</Link>
            </div>
        </div>
    )
}