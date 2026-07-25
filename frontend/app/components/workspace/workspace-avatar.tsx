export const WorkspaceAvatar = ({ color, name }: { color: string; name: string }) => {

    return (
        <div className="flex items-center justify-center w-6 h-6 rounded" style={{ backgroundColor: color }}>
            <span className="text-white font-medium text-xs">
                {name.charAt(0).toUpperCase()}
            </span>
        </div>
    )

}