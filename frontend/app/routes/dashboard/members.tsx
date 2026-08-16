import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/loader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetWorkspaceDetailsQuery } from '@/hooks/useWorkspace';
import type { WorkSpace } from '@/types';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

const Members = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const initialSearch = searchParams.get("search") || "";
    const workspaceId = searchParams.get("workspaceId");
    const hasWorkspaceSelected = Boolean(workspaceId);

    const [search, setSearch] = useState<string>(initialSearch);

    useEffect(() => {

        const params: Record<string, string> = {};

        searchParams.forEach((value, key) => {

            params[key] = value;
        });

        params.search = search;

        setSearchParams(params, { replace: true });

    }, [search]);

    useEffect(() => {

        const urlSearch = searchParams.get("search") || "";

        if (urlSearch !== search) setSearch(urlSearch);

    }, [searchParams]);

    const { data, isLoading } = useGetWorkspaceDetailsQuery(workspaceId || "") as {
        data: WorkSpace;
        isLoading: boolean;
    };

    if (!hasWorkspaceSelected) {
        return (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed p-8 text-center">
                <div>
                    <h2 className="text-xl font-semibold">No workspace selected</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Select a workspace from the header to view the members

                    </p>
                </div>
            </div>
        );
    }

    const filteredMembers = data?.members?.filter((member) =>
        member.user.name.toLowerCase().includes(search.toLowerCase()) ||
        member.user.email.toLowerCase().includes(search.toLowerCase()) ||
        member.role?.toLowerCase().includes(search.toLowerCase())
    );


    if (isLoading) {
        return (
            <div>
                <Loader />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start md:items-center justify-between">
                <h1 className="text-2xl font-bold">Workspace Members</h1>
            </div>

            <Input className="max-w-md" placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} />

            <Tabs defaultValue="list">
                <TabsList>
                    <TabsTrigger value="list">List View</TabsTrigger>
                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                    <Card className="mb-4">
                        <CardHeader>
                            <CardTitle>Members</CardTitle>
                            <CardDescription>{filteredMembers?.length} members in this workspace</CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="divide-y">
                                {filteredMembers?.map((member) => (
                                    <div key={member.user._id} className="flex flex-col md:flex-row items-center justify-between p-4 gap-3">
                                        <div className="flex items-center space-x-4">
                                            <Avatar className="bg-gray-500">
                                                <AvatarImage src={member.user.profilePicture} />
                                                <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{member.user.name}</p>
                                                <p className="text-sm text-gray-500">{member.user.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-1 ml-11 md:ml-0">
                                            <Badge className="capitalize" variant={["admin", "owner"].includes(member.role) ? "destructive" : "secondary"}>
                                                {member.role}
                                            </Badge>
                                            <Badge variant="outline">
                                                {data.name}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="grid">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredMembers?.map((member) => (
                            <Card key={member.user._id}>
                                <CardContent className="p-6 flex flex-col items-center text-center">
                                    <Avatar className="bg-gray-500 size-20 mb-4">
                                        <AvatarImage src={member.user.profilePicture} />
                                        <AvatarFallback className="uppercase">
                                            {member.user.name.substring(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <h3 className="text-lg font-medium">
                                        {member.user.name}
                                    </h3>

                                    <p className="text-sm text-gray-500 mb-4">
                                        {member.user.email}
                                    </p>

                                    <div className="flex items-center flex-col gap-4">
                                        <Badge className="capitalize" variant={["admin", "owner"].includes(member.role) ? "destructive" : "secondary"}>
                                            {member.role}
                                        </Badge>
                                        <Badge variant="outline">
                                            {data.name}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Members;