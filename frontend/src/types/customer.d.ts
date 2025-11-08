type Customer = {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  password: string;
  image: UploadedImage | string | ArrayBuffer;
  addresses?: Address[],
  pendingOrders?: number,
  completedOrders?: number,
  lastOrder?: Date,
  isOnline?: boolean,
  createdAt?: Date
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