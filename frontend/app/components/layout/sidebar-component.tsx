import { cn } from '@/lib/utils';
import { useAuth } from '@/provider/authContext';
import type { WorkSpace } from '@/types';
import { CheckCircle2, ChevronsLeft, ChevronsRight, LayoutDashboard, ListCheck, LogOut, Settings, Users, Wrench } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { SidebarNav } from './sidebar-nav';

export const SidebarComponent = ({ currentWorkSpace }: { currentWorkSpace: WorkSpace | null }) => {

    const { user, logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Workspaces', href: '/workspaces', icon: Users },
        { name: 'My Tasks', href: '/my-tasks', icon: ListCheck },
        { name: 'Members', href: '/members', icon: Users },
        { name: 'Archived', href: '/archived', icon: CheckCircle2 },
        { name: 'Settings', href: '/settings', icon: Settings }
    ];

    return (
        <div className={cn("flex flex-col border-r bg-sidebar transition-all duration-300", isCollapsed ? "w-16 md:w-20" : "w-16 md:w-60")}>
            <div className="flex h-14 items-center border-b px-4 mb-4">
                <Link to="/dashboard" className="flex items-center">
                    {
                        !isCollapsed && (
                            <div className="flex items-center gap-2">
                                <Wrench className="size-6 text-blue-600" />
                                <span className="text-lg font-semibold hidden md:block">Synctra</span>
                            </div>
                        )
                    }
                    {
                        isCollapsed && (
                            <Wrench className="size-6 text-blue-600" />
                        )
                    }
                </Link>
                <Button variant="ghost" size="icon" className="ml-auto hidden md:block pl-2" onClick={() => setIsCollapsed(!isCollapsed)}>
                    {
                        isCollapsed ? (
                            <ChevronsRight className="size-4" />
                        ) : (
                            <ChevronsLeft className="size-4" />
                        )
                    }
                </Button>
            </div>

            <ScrollArea className="flex-1 px-3 py-2">
                <SidebarNav items={navItems} isCollapsed={isCollapsed} className={cn(isCollapsed && "items-center space-y-2")} currentWorkspace={currentWorkSpace} />
            </ScrollArea>

            <div>
                <Button variant="ghost" size={isCollapsed ? "icon" : "default"} onClick={logout}>
                    <LogOut className={cn("size-4", isCollapsed && "mr-2")} />
                    <span className="hidden md:block">Logout</span>
                </Button>
            </div>

        </div>
    );
};