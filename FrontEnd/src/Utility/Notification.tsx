import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

const SUCCESS_NOTIFICATION = (message: string) => {
  notifications.show({
    title: "Success",
    message: message,
    color: "green",
    icon: <IconCheck />,
    withCloseButton: true,
    autoClose: 5000,
    withBorder: true,
    className: "border-green-500",
    radius: "md",
  });
};

const ERROR_NOTIFICATION = (message: string) => {
  notifications.show({
    title: "Error",
    message: message,
    color: "red",
    icon: <IconX />,
    withCloseButton: true,
    autoClose: 2000,
    withBorder: true,
    className: "border-red-500",
    radius: "md",
  });
};

export { SUCCESS_NOTIFICATION, ERROR_NOTIFICATION };
