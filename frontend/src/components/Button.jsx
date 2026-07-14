export default function Button({ children, onClick, type = 'button', variant = 'primary', disabled = false }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={variant === 'secondary' ? 'btn btn-secondary' : 'btn'}
        >
            {children}
        </button>
    )
}