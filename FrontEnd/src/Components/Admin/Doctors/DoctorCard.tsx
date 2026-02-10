import { Avatar, Divider } from "@mantine/core";
import { formatDate } from "../../../Utility/FormateDate";
import {
  IconBriefcase,
  IconGenderAgender,
  IconGenderTransgender,
  IconMail,
  IconManFilled,
  IconPhone,
  IconPin,
} from "@tabler/icons-react";

import { getMediaUrl } from "../../../Service/MediaService";

const DoctorCard = ({
  name,
  email,
  phoneNumber,
  gender,
  dateOfBirth,
  specialization,
  address,
  department,
  totalExperience,
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

        <div>
          <div className="text-sm font-semibold">{name}</div>
          <div className="text-sm">
            {specialization || "-"}-{department || "-"}
          </div>
        </div>
      </div>
      <Divider />
      <div className="flex flex-col gap-2">
        <div className="flex items-center text-sm gap-2">
          <IconMail
            className="text-primary-700 bg-primary-100 p-1 rounded-full"
            size={24}
          />
          <div>{email}</div>
        </div>
        {/* <div className="flex items-center justify-between text-sm gap-2">
          <div className="text-gray-500">Date of Birth:</div>
          <div>{formatDate(dateOfBirth)}</div>
        </div> */}
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
        {/* <div className="flex items-center justify-between text-sm gap-2">
          <div className="text-gray-500">Specialization:</div>
          <div>{specialization}</div>
        </div>
        <div className="flex items-center justify-between text-sm gap-2">
          <div className="text-gray-500">Department:</div>
          <div>{department}</div>
        </div> */}
        <div className="flex items-center text-sm gap-2">
          <IconBriefcase
            className="text-primary-700 bg-primary-100 p-1 rounded-full"
            size={24}
          />
          <div>{totalExperience || 0}</div>
        </div>
        <div className="flex items-center text-sm gap-2">
          <IconPin
            className="text-primary-700 bg-primary-100 p-1 rounded-full"
            size={24}
          />
          <div>{address}</div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
