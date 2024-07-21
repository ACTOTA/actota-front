export default function Button({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
      <>
        <button
          type="button"
          className={`rounded-[200px] ${className}`}
        >
          {children}
        </button>
      </>
    )
  }