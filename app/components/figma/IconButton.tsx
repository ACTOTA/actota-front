export default function IconButton({children, icon}: {children: React.ReactNode, icon: React.ReactNode}) { 

    return (
        <div className="flex items-center gap-2">
            {children}
        </div>
    )
    
}