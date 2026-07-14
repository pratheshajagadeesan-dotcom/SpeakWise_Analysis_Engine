import Card from './Card.jsx'
import Button from './Button.jsx'

const categoryColors = {
    Technical: { bg: '#dbeafe', text: '#1e3a8a', border: '#93c5fd' },
    Behavioral: { bg: '#ccfbf1', text: '#134e4a', border: '#5eead4' },
}

export default function QuestionCard({ question, onSelect, selected }) {
    const colors = categoryColors[question.category] || { bg: '#e2e8f0', text: '#334155', border: '#cbd5e1' };

    return (
        <Card>
            <p style={{ fontWeight: 700, marginBottom: 8, fontSize: 16 }}>{question.text}</p>
            <span style={{
                display: 'inline-block', padding: '4px 12px', borderRadius: 999,
                fontSize: 12, fontWeight: 700, background: colors.bg, color: colors.text,
                border: `1.5px solid ${colors.border}`,
                marginBottom: 14,
            }}>
        {question.category}
      </span>
            <div>
                <Button variant={selected ? 'primary' : 'secondary'} onClick={() => onSelect(question)}>
                    {selected ? '✓ Selected' : 'Select Question'}
                </Button>
            </div>
        </Card>
    )
}