import React, { useEffect, useState } from "react";
import { AreaChart } from "@mantine/charts";
import { ThemeIcon } from "@mantine/core";
import {
  IconCalendarCheck,
  IconStethoscope,
  IconUsers,
} from "@tabler/icons-react";
import { getVisitCount } from "../../../Service/AppointmentService";
import { getRegistrationCounts } from "../../../Service/UserService";

const TopCards = () => {
  const [visitData, setVisitData] = useState<any[]>([]);
  const [roleData, setRoleData] = useState<any>({
    doctorCounts: [],
    patientCounts: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const visits = await getVisitCount();
        console.log("Visit data:", visits);
        setVisitData(visits);

        const registrations = await getRegistrationCounts();
        console.log("Registration data:", registrations);
        setRoleData(registrations);
      } catch (error) {
        console.error("Error fetching dashboard counts:", error);
      }
    };
    fetchData();
  }, []);

  const getSum = (data: any[], key: string) => {
    return data && data.length > 0
      ? data.reduce((sum: number, item: any) => sum + (item[key] || 0), 0)
      : 0;
  };

  const cards = [
    {
      id: "appointments",
      name: "Total Appointments",
      value: getSum(visitData, "visitCount"),
      data: visitData,
      dataKey: "visitCount",
      monthKey: "month",
      icon: <IconCalendarCheck size={28} />,
      color: "blue",
      bg: "bg-blue-600",
    },
    {
      id: "doctors",
      name: "Total Doctors",
      value: getSum(roleData.doctorCounts, "count"),
      data: roleData.doctorCounts,
      dataKey: "count",
      monthKey: "month",
      icon: <IconStethoscope size={28} />,
      color: "teal",
      bg: "bg-teal-600",
    },
    {
      id: "patients",
      name: "Total Patients",
      value: getSum(roleData.patientCounts, "count"),
      data: roleData.patientCounts,
      dataKey: "count",
      monthKey: "month",
      icon: <IconUsers size={28} />,
      color: "indigo",
      bg: "bg-indigo-600",
    },
  ];

  const card = (app: any) => {
    return (
      <div
        key={app.id}
        className={`${app.bg} rounded-xl shadow-md transition-all duration-300 hover:shadow-lg overflow-hidden flex flex-col`}
      >
        <div className="flex justify-between p-5 items-center">
          <ThemeIcon
            className="shadow-inner"
            size="xl"
            radius="md"
            color="white"
            variant="light"
          >
            {app.icon}
          </ThemeIcon>
          <div className="flex flex-col items-end">
            <p className="text-white text-3xl font-bold leading-tight">
              {app.value.toLocaleString()}
            </p>
            <p className="text-white/90 text-sm font-medium">{app.name}</p>
          </div>
        </div>
        <div className="h-[120px] w-full mt-auto">
          <AreaChart
            h={120}
            data={
              app.data && app.data.length > 0
                ? app.data
                : [{ month: "No Data", [app.dataKey]: 0 }]
            }
            dataKey={app.monthKey || "month"}
            series={[{ name: app.dataKey, color: "white" }]}
            curveType="bump"
            tickLine="none"
            gridAxis="none"
            withXAxis={false}
            withYAxis={false}
            withDots={false}
            fillOpacity={0.6}
            strokeWidth={2}
            withGradient
          />
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {cards.map((cardData) => card(cardData))}
    </div>
  );
};

export default TopCards;
