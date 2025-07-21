type Admin = {
  _id?: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  image: UploadedImage | string | ArrayBuffer | null | undefined,
  role: string;
}
