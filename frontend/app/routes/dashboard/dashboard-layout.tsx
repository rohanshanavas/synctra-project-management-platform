import { Header } from '@/components/layout/header';
import { SidebarComponent } from '@/components/layout/sidebar-component';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { CreateWorkSpace } from '@/components/workspace/create-workspace';
import { fetchData } from '@/lib/fetchUtil';
import { useAuth } from '@/provider/authContext'
import type { WorkSpace } from '@/types';
import React, { useState } from 'react'
import { Navigate, Outlet } from 'react-router';

export const clientLoader = async () => {

    try {
        const [workspaces] = await Promise.all([
            fetchData("/workspaces")
        ]);

        return { workspaces };
    } 
    catch (error) {
        console.log(error);
    }
};

const DashboardLayout = () => {

    const { isAuthenticated, isLoading } = useAuth();
    const [isCreatingWorkSpace, setIsCreatingWorkSpace] = useState(false);
    const [currentWorkSpace, setCurrentWorkSpace] = useState<WorkSpace | null>(null);

    if (isLoading) {
        return <Loader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/sign-in" />;
    }

    const handleWorkspaceSelected = (workspace: WorkSpace) => {
        setCurrentWorkSpace(workspace);
    }

    return (
        <div className="flex h-screen w-full">
            <SidebarComponent currentWorkSpace={currentWorkSpace} />
            <div className="flex flex-1 flex-col h-full">
                <Header
                    onWorkSpaceSelected={handleWorkspaceSelected}
                    selectedWorkSpace={currentWorkSpace}
                    onCreateWorkSpace={() => setIsCreatingWorkSpace(true)}
                />
                <main className="flex-1 overflow-y-auto h-full w-full">
                    <div className="mx-auto container px-2 sm:px-6 lg:px-8 py-0 md:py-8 w-full h-full">
                        <Outlet />
                    </div>
                </main>
            </div>

            <CreateWorkSpace isCreatingWorkSpace={isCreatingWorkSpace} setIsCreatingWorkSpace={setIsCreatingWorkSpace} />

        </div>
    );
};

export default DashboardLayout