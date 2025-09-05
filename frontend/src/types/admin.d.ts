type Admin = {
  _id?: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  firstname: string;
  lastname: string;
  phone: string;
  image: UploadedImage | string | ArrayBuffer,
  role: 'Admin' | 'Super Admin';
  createdAt?: Date;
}
