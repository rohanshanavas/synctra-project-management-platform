import type { Comment, User } from "@/types";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useAddCommentMutation, useGetCommentsByTaskIdQuery } from "@/hooks/useTask";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";

export const CommentSection = ({ taskId, members }: { taskId: string; members: User[] }) => {

    const [newComment, setNewComment] = useState("");

    const { mutate, isPending } = useAddCommentMutation();
    const { data: comments, isLoading } = useGetCommentsByTaskIdQuery(taskId) as { data: Comment[], isLoading: boolean };

    const handleAddComment = () => {

        if (!newComment.trim()) {
            return;
        }

        mutate({ taskId, text: newComment }, {
            onSuccess: () => {
                toast.success("Comment added successfully");
                setNewComment("");
            },
            onError: (error: any) => {
                const errorMessage = error?.response?.data?.message;
                toast.error(errorMessage);
                console.error("Error adding comment:", error);
            }
        });
    }

    return (
        <div className="bg-card shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">
                Comments
            </h3>
            <ScrollArea className="h-75 mb-4">
                {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment._id} className="flex gap-4 py-2">
                            <Avatar className="size-8">
                                <AvatarImage src={comment.author.profilePicture} />
                                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-sm">{comment.author.name}</span>
                                    <span className="text-xs text-muted-foreground">{formatDistanceToNow(comment.createdAt, { addSuffix: true })}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{comment.text}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-sm text-muted-foreground">No comments yet</p>
                    </div>
                )}
            </ScrollArea>

            <Separator className="my-4" />

            <div className="mt-4">
                <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />

                <div className="flex justify-end mt-4">
                    <Button disabled={!newComment.trim() || isPending} onClick={handleAddComment}>
                        Post Comment
                    </Button>
                </div>
            </div>
        </div>
    )
};