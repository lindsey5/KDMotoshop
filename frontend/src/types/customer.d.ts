type Customer = {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  image: UploadedImage | string | ArrayBuffer;
  addresses?: Address[]
}

type Address = {
    street: string;
    barangay: string;
    city: string;
    region: string;
    firstname: string;
    lastname: string;
    phone: string;
    isDefault?: boolean;
}

type NewCustomer = {
    email: string;
    firstname: string;
    lastname: string;
    password: string;
    confirmPassword: string;
}