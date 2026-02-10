import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPatient } from "../../Service/PatientProfileService";
import { getDoctor } from "../../Service/DoctorProfileService";
import { setuser } from "../../Slice/UserSlice";

const UserSync = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const jwt = useSelector((state: any) => state.jwt);

  useEffect(() => {
    if (jwt && user?.profileId && !user.isSynced) {
      if (user.role === "PATIENT") {
        getPatient(user.profileId)
          .then((data: any) => {
            dispatch(setuser({ ...user, ...data, isSynced: true }));
          })
          .catch(console.error);
      } else if (user.role === "DOCTOR") {
        getDoctor(user.profileId)
          .then((data: any) => {
            dispatch(setuser({ ...user, ...data, isSynced: true }));
          })
          .catch(console.error);
      }
    }
  }, [jwt, user?.profileId, user?.isSynced, dispatch, user]);

  return null;
};

export default UserSync;
