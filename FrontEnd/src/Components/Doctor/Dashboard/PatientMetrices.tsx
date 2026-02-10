import { AreaChart } from "@mantine/charts";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAppointmentCountByDoctor } from "../../../Service/AppointmentService";

const PatientMetrices = () => {
  const user = useSelector((state: any) => state.user);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        try {
          const counts = await getAppointmentCountByDoctor(user.id);
          setData(counts);
        } catch (error) {
          console.error("Error fetching patient metrics for doctor:", error);
        }
      }
    };
    fetchData();
  }, [user?.id]);

  const getSum = (data: any[], key: string) => {
    return data && data.length > 0
      ? data.reduce((sum: number, item: any) => sum + (item[key] || 0), 0)
      : 0;
  };
  return (
    <div className="bg-orange-50 rounded-xl border">
      <div className="flex justify-between items-center p-5">
        <div>
          <div className="font-semibold ">Patients</div>
          <div className="text-xs text-gray-500">
            {new Date().getFullYear()}
          </div>
        </div>
        <div className="text-2xl font-bold text-orange-500">
          {getSum(data, "visitCount")}
        </div>
      </div>
      <AreaChart
        h={280}
        data={
          data && data.length > 0 ? data : [{ month: "No Data", visitCount: 0 }]
        }
        dataKey="month"
        series={[{ name: "visitCount", color: "orange" }]}
        curveType="bump"
        tickLine="none"
        gridAxis="none"
        withXAxis={false}
        withYAxis={false}
        withDots={false}
        fillOpacity={0.3}
        strokeWidth={2}
      />
    </div>
  );
};

export default PatientMetrices;
