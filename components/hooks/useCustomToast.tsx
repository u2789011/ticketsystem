import { useToast } from "@chakra-ui/react";
import React from "react";

const useCustomToast = () => {
  const toast = useToast();

  const showSuccessToast = (title: string, description: string) => {
    toast({
      title: title,
      description: description,
      status: "success",
      variant: "subtle",
    });
  };

  const showSuccessToastWithReactNode = (
    title: string,
    description: React.ReactNode
  ) => {
    toast({
      title: title,
      description: description,
      status: "success",
      variant: "subtle",
    });
  };

  const showErrorToast = (title: string, description: string) => {
    toast({
      title: title,
      description: description,
      status: "error",
      variant: "subtle",
    });
  };

  const showWarningToast = (title: string, description: string) => {
    toast({
      title: title,
      description: description,
      status: "warning",
      variant: "subtle",
    });
  };
  return { showSuccessToast, showSuccessToastWithReactNode, showErrorToast, showWarningToast };
};

export default useCustomToast;
