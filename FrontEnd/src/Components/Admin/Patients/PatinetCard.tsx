import React from "react";
import { Avatar, Divider } from "@mantine/core";
import { bloodGroupMap } from "../../../Data/DropDownData";
import { formatDate } from "../../../Utility/FormateDate";
import {
  IconCalendar,
  IconDroplet,
  IconMail,
  IconManFilled,
  IconPhone,
  IconPin,
} from "@tabler/icons-react";

import { getMediaUrl } from "../../../Service/MediaService";

const PatinetCard = ({
  name,
  email,
  phoneNumber,
  id,
  aadharNo,
  gender,
  dateOfBirth,
  bloodGroup,
  address,
  emergencyContact,
  medicalHistory,
  profilePictureId,
}: any) => {
  return (
    <div className="border flex flex-col gap-2 hover:bg-primary-50 transition duration-300 p-3 rounded-lg shadow-xl hover:shadow-lg transition-shadow duration-300 cursor-pointer space-y-2  ">
      <div className="flex items-center gap-2">
        <Avatar
          src={getMediaUrl(profilePictureId)}
          name={name}
          color="initials"
          variant="filled"
          radius="lg"
        />
        <div className="text-sm font-semibold">{name}</div>
      </div>
      <Divider />
      <div className="flex flex-col gap-2">
        <div className="flex items-center text-sm gap-2">
          <IconMail
            className="text-primary-700 bg-primary-100 p-1 rounded-full"
            size={24}
          />
          <div className="truncate">{email}</div>
        </div>

        <div className="flex items-center text-sm gap-2">
          <IconCalendar
            className="text-primary-700 bg-primary-100 p-1 rounded-full"
            size={24}
          />
          <div>{formatDate(dateOfBirth)}</div>
        </div>

        <div className="flex items-center text-sm gap-2">
          <IconPhone
            className="text-primary-700 bg-primary-100 p-1 rounded-full"
            size={24}
          />
          <div>{phoneNumber}</div>
        </div>

        <div className="flex items-center text-sm gap-2">
          <IconManFilled
            className="text-primary-700 bg-primary-100 p-1 rounded-full"
            size={24}
          />
          <div>{gender}</div>
        </div>

        <div className="flex items-center text-sm gap-2">
          <IconDroplet
            className="text-primary-700 bg-primary-100 p-1 rounded-full"
            size={24}
          />
          <div>{bloodGroupMap[bloodGroup]}</div>
        </div>

        <div className="flex items-center text-sm gap-2">
          <IconPin
            className="text-primary-700 bg-primary-100 p-1 rounded-full"
            size={24}
          />
          <div className="truncate">{address}</div>
        </div>
      </div>
    </div>
  );
};

export default PatinetCard;
