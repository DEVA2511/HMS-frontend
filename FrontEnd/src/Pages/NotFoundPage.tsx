import { Button, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4">
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        {/* 404 Number */}
        <h1 className="text-[120px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 leading-none">
          404
        </h1>

        {/* Title */}
        <Title order={2} className="mt-4 text-gray-800">
          Page Not Found
        </Title>

        {/* Description */}
        <Text size="md" c="dimmed" className="mt-3">
          Sorry, the page you are looking for doesn’t exist or has been moved.
        </Text>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="md"
            radius="md"
            onClick={() => navigate("/admin/dashboard")}
          >
            Go Home
          </Button>

          <Button
            size="md"
            radius="md"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
