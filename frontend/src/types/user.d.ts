export interface User {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phone: string;
  image: UploadedImage;
  role: string
}