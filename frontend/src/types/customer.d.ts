type Customer = {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  image: UploadedImage;
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
}

type NewCustomer = {
    email: string;
    firstname: string;
    lastname: string;
    password: string;
    confirmPassword: string;
}