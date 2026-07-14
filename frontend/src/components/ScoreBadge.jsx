export default function ScoreBadge({ score }) {
    let cls = 'badge-bad'
    if (score >= 70) cls = 'badge-good'
    else if (score >= 40) cls = 'badge-mid'

    return <span className={`badge ${cls}`}>{score}% relevant</span>
}