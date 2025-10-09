import { useUserStore } from "@/stores/userStore";
import { useEffect } from "react";

export default function Home() {
  const { decodedData, userId, userData, setUserFromToken } = useUserStore();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && !decodedData) {
      setUserFromToken(token);
    }
  }, [decodedData, setUserFromToken]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome {userData?.username}</h1>
      {decodedData ? (
        <div className="bg-white p-4 rounded shadow max-w-md">
          <p><strong>User ID:</strong> {userId}</p>
          <p><strong>Admin:</strong> {decodedData.is_admin ? "Yes" : "No"}</p>
          <p><strong>Token expires:</strong> {decodedData.exp ? new Date(decodedData.exp * 1000).toLocaleString() : "-"}</p>
        </div>
      ) : (
        <p className="text-gray-500">User data not loaded yet.</p>
      )}
    </div>
  );
}
