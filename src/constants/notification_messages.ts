import { UserRole } from "./user.role";

export const NotifyMessage = {
    ADDED_TO_PROJECT: 
        (project: string, organization: string) => `You Have Been Added To (${project}) Of Organizaton ${organization}`,
    REMOVED_FROM_PROJECT: 
    (project: string, organization: string) => `You Have Been Removed From (${project}) Of Organizaton ${organization}`,
}