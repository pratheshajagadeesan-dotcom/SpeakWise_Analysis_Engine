import { useRef, useState } from 'react'
import Button from './Button.jsx'

export default function AudioRecorder({ onRecordingReady }) {
    const [recording, setRecording] = useState(false)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [error, setError] = useState('')
    const mediaRecorderRef = useRef(null)
    const chunksRef = useRef([])
    const streamRef = useRef(null)

    const startRecording = async () => {
        setError('')
        setPreviewUrl(null)
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            streamRef.current = stream
            chunksRef.current = []

            const recorder = new MediaRecorder(stream)
            mediaRecorderRef.current = recorder

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data)
            }

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
                const file = new File([blob], `recording-${Date.now()}.webm`, { type: 'audio/webm' })
                setPreviewUrl(URL.createObjectURL(blob))
                onRecordingReady(file)
                streamRef.current?.getTracks().forEach((t) => t.stop())
            }

            recorder.start()
            setRecording(true)
        } catch (err) {
            setError('Microphone access was denied or is unavailable. Check your browser permissions.')
        }
    }

    const stopRecording = () => {
        mediaRecorderRef.current?.stop()
        setRecording(false)
    }

    return (
        <div>
            {error && <p className="error-text">{error}</p>}

            {!recording ? (
                <Button onClick={startRecording}>🎙️ Start Recording</Button>
            ) : (
                <Button variant="secondary" onClick={stopRecording}>⏹ Stop Recording</Button>
            )}

            {recording && (
                <p style={{ color: '#dc2626', marginTop: 8, fontWeight: 500 }}>
                    ● Recording... speak your answer now
                </p>
            )}

            {previewUrl && !recording && (
                <div style={{ marginTop: 12 }}>
                    <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>Preview your recording:</p>
                    <audio controls src={previewUrl} style={{ width: '100%' }} />
                </div>
            )}
        </div>
    )
}