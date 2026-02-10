import { DonutChart } from "@mantine/charts";
import React, { useEffect, useState } from "react";
import { getReasonCount } from "../../../Service/AppointmentService";

const DiseasesChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [colors] = useState([
    "#4facfe",
    "#00f2fe",
    "#0575e6",
    "#48c6ef",
    "#6a11cb",
    "#2575fc",
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reasons = await getReasonCount();
        const mappedData = reasons.map((item: any, index: number) => ({
          name: item.reason,
          value: item.count,
          color: colors[index % colors.length],
        }));
        setData(mappedData);
      } catch (error) {
        console.error("Error fetching disease distribution:", error);
      }
    };
    fetchData();
  }, [colors]);

  return (
    <div className="p-3 border rounded-xl bg-white shadow-md flex flex-col gap-3">
      <div className="font-semibold text-lg text-gray-800">
        Disease Distribution
      </div>
      <div className="flex justify-center items-center min-h-[250px]">
        {data.length > 0 ? (
          <DonutChart
            data={data}
            withLabels
            labelsType="percent"
            withLabelsLine
            chartLabel="Diseases"
            thickness={25}
            strokeWidth={2}
            paddingAngle={5}
          />
        ) : (
          <p className="text-gray-400 italic">
            No data available for the current year
          </p>
        )}
      </div>
    </div>
  );
};

export default DiseasesChart;
