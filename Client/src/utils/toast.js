import { toast } from "sonner";

export const candidateToast = {
  success: (message) =>
    toast.success(message, {
      className: "!bg-red-600 !text-white",
    }),

  error: (message) =>
    toast.error(message, {
      className: "!bg-red-700 !text-white",
    }),
};

export const companyToast = {
  success: (message) =>
    toast.success(message, {
      className: "!bg-[#C98772] !text-white",
    }),

  error: (message) =>
    toast.error(message, {
      className: "!bg-[#B46A54] !text-white",
    }),
};