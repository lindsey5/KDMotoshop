type NotificationType = {
    _id: string;
    from?: string | Customer;
    refund_id?: string;
    to: string;
    order_id:  string;
    isViewed: boolean;
    content: string;
    createdAt: Date;
}

interface NotificationState {
  notifications: NotificationType[];
  loading?: boolean;
  total: number;
  unread: number;
  page: number;
}

interface NotificationState {
  notifications: NotificationType[];
  loading?: boolean;
  total: number;
  unread: number;
  page: number;
}