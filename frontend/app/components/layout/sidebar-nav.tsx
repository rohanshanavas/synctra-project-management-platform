import React from 'react';
import type { WorkSpace } from '@/types';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useLocation, useNavigate } from 'react-router';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    items: { name: string; href: string; icon: LucideIcon }[];
    isCollapsed: boolean;
    className?: string;
    currentWorkspace: WorkSpace | null;
}

export const SidebarNav = ({ items, isCollapsed, className, currentWorkspace, ...props }: SidebarNavProps) => {

    const location = useLocation();
    const navigate = useNavigate();

    return (
        <nav className={cn("flex flex-col gap-y-2", className)} {...props}>
            {items.map((item) => {

                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                const handleClick = () => {
                    if (item.href === "/workspaces") {
                        navigate(item.href);
                    }
                    else if (currentWorkspace && currentWorkspace.id) {
                        navigate(`${item.href}?workspaceId=${currentWorkspace.id}`);
                    }
                    else {
                        navigate(item.href);
                    }
                };

                return (
                    <Button
                        key={item.href}
                        variant={isActive ? "outline" : "ghost"}
                        className={cn("justify-start", isActive && "bg-blue-800/20 text-blue-600 font-medium")}
                        onClick={handleClick}
                    >
                        <Icon className="size-4 mr-2" />
                        {
                            isCollapsed ? (
                                <span className="sr-only">{item.name}</span>
                            ) : (
                                item.name
                            )
                        }
                    </Button>
                )
            })}
        </nav>
    );
};