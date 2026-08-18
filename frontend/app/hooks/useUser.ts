import { fetchData, updateData } from "@/lib/fetchUtil";
import type { ChangePasswordFormData, ProfileFormData } from "@/routes/user/profile";
import { useMutation, useQuery, type QueryKey } from "@tanstack/react-query";

const queryKey: QueryKey = ["user"];

export const useUserProfileQuery = () => {
    return useQuery({
        queryKey,
        queryFn: async () => fetchData("/users/profile"),
    });
};

export const useChangePasswordMutation = () => {
    return useMutation({
        mutationFn: async (data: ChangePasswordFormData) => 
            updateData("/users/change-password", data),
    });
};

export const useUpdateUserProfileMutation = () => {
    return useMutation({
        mutationFn: async (data: ProfileFormData) => 
            updateData("/users/profile", data),
    });
}
