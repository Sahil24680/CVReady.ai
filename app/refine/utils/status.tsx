import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

export type Status = "accepted" | "rejected" | "pending";
export type Impact = "High" | "Medium" | "Low";

export const getStatusIcon = (status: Status) => {
  switch (status) {
    case "accepted":
      return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
    case "rejected":
      return <XCircleIcon className="w-5 h-5 text-red-600" />;
    case "pending":
    default:
      return <ClockIcon className="w-5 h-5 text-yellow-600" />;
  }
};

export const getStatusColor = (status: Status) => {
  switch (status) {
    case "accepted":
      return "bg-green-50 border-green-200";
    case "rejected":
      return "bg-red-50 border-red-200";
    case "pending":
    default:
      return "bg-yellow-50 border-yellow-200";
  }
};

export const getImpactColor = (impact: Impact) => {
  switch (impact) {
    case "High":
      return "bg-red-100 text-red-800";
    case "Medium":
      return "bg-yellow-100 text-yellow-800";
    case "Low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
