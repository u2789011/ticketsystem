import React from "react";
import { nfTixBooth } from "../../../contracts/abis/nfTixBooth";
import { useContractRead } from "wagmi";

const useSaleIsActive = () => {
  // Get sale is open or not
  const { data: saleIsActive } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ID as `0x${string}`,
    abi: nfTixBooth,
    functionName: "saleIsActive",
  });
  return Boolean(saleIsActive);
};

export default useSaleIsActive;
