import { BackButton } from "@/components/back-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { useChangePasswordMutation, useUpdateUserProfileMutation, useUserProfileQuery } from "@/hooks/useUser";
import { changePasswordSchema, profileSchema } from "@/lib/schema";
import { useAuth } from "@/provider/authContext";
import type { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export type ProfileFormData = z.infer<typeof profileSchema>;

const Profile = () => {

    const { data: user, isPending } = useUserProfileQuery() as {
        data: User;
        isPending: boolean;
    };

    const { logout } = useAuth();
    const navigate = useNavigate();

    const form = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const profileForm = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || "",
            profilePicture: user?.profilePicture || "",
        },
        values: {
            name: user?.name || "",
            profilePicture: user?.profilePicture || "",
        },
    });

    const { mutate: updateUserProfile, isPending: isUpdatingUserProfile } = useUpdateUserProfileMutation();

    const { mutate: changePassword, isPending: isChangingPassword, error } = useChangePasswordMutation();

    const handlePasswordChange = (values: ChangePasswordFormData) => {
        changePassword(values, {
            onSuccess: () => {
                toast.success("Password updated successfully. You will be logged out. Please log in again.");
                form.reset();

                setTimeout(() => {
                    logout();
                    navigate("/sign-in");
                }, 3000);
            },
            onError: (error: any) => {
                const errorMessage = error?.response?.data?.message || "Failed to update password.";
                toast.error(errorMessage);
                console.log(error);
            },
        });
    };

    const handleProfileFormSubmit = (values: ProfileFormData) => {
        updateUserProfile({ name: values.name, profilePicture: values.profilePicture || "" }, {
            onSuccess: () => {
                toast.success("Profile updated successfully.");
            },
            onError: (error: any) => {
                const errorMessage = error?.response?.data?.message || "Failed to update profile";
                toast.error(errorMessage);
                console.log(error);
            },
        });
    };

    if (isPending) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="px-4 md:px-0 space-y-1">
                <BackButton />
                <h3 className="text-lg font-medium">
                    Profile Information
                </h3>
                <p className="text-sm text-muted-foreground">
                    Manage your account settings and preferences
                </p>
            </div>

            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={profileForm.handleSubmit(handleProfileFormSubmit)} className="grid gap-4">
                        <div className="flex items-center space-x-4 mb-6">
                            <Avatar className="h-20 w-20 bg-gray-600">
                                <AvatarImage src={profileForm.watch("profilePicture") || user?.profilePicture} alt={user?.name} />
                                <AvatarFallback className="text-xl">
                                    {user?.name?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <Input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    // onChange={handleAvatarChange}
                                    // disabled={uploading || isUpdatingUserProfile}
                                    style={{ display: "none" }}
                                />
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => document.getElementById("avatar-upload")?.click()}
                                // disabled={uploading || isUpdatingUserProfile}
                                >
                                    Change Avatar
                                </Button>
                            </div>
                        </div>
                        <Controller
                            name="name"
                            control={profileForm.control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Full Name</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            {...field}
                                        />
                                    </FieldContent>
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                defaultValue={user?.email}
                                disabled
                            />
                            <p className="text-xs text-muted-foreground">
                                Your email address cannot be changed
                            </p>
                        </div>
                        <Button type="submit" className="w-fit" disabled={isUpdatingUserProfile || isPending}>
                            {isUpdatingUserProfile ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Update your password</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={form.handleSubmit(handlePasswordChange)} className="grid gap-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error.message}</AlertDescription>
                            </Alert>
                        )}

                        <div className="grid gap-2">
                            <Controller
                                name="currentPassword"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Current Password</FieldLabel>
                                        <FieldContent>
                                            <Input
                                                {...field}
                                                id="current-password"
                                                type="password"
                                                placeholder="********"
                                            />
                                        </FieldContent>
                                        <FieldError errors={[fieldState.error]} />
                                    </Field>
                                )}
                            />
                            <Controller
                                name="newPassword"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>New Password</FieldLabel>
                                        <FieldContent>
                                            <Input
                                                {...field}
                                                id="new-password"
                                                type="password"
                                                placeholder="********"
                                            />
                                        </FieldContent>
                                        <FieldError errors={[fieldState.error]} />
                                    </Field>
                                )}
                            />
                            <Controller
                                name="confirmPassword"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Confirm Password</FieldLabel>
                                        <FieldContent>
                                            <Input
                                                {...field}
                                                id="confirm-password"
                                                type="password"
                                                placeholder="********"
                                            />
                                        </FieldContent>
                                        <FieldError errors={[fieldState.error]} />
                                    </Field>
                                )}
                            />
                        </div>

                        <Button type="submit" className="mt-2 w-fit" disabled={isChangingPassword || isPending}>
                            {isChangingPassword ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Password"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;