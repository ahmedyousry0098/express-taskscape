export interface IImage {
    public_id: string;
    secure_url: string
}

export interface IImageFile {
    filename: string,
    fieldname: string,
    encoding: string,
    mimetype: string,
    path: string,
    originalname: string,
    destination: string,
    size: number
}