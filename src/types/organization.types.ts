import { IImage } from "./image.types";

export interface IOrganization {
    organization_name: string
    company: string; // unique
    description?: string;
    industry: string // default field in db -> software development
    headQuarters: string;
    logo: IImage;
    isDeleted: boolean
    isVerified: boolean
}