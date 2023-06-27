import React from "react";
import { nfTixBooth } from "../../../contracts/abis/nfTixBooth";
import { useContractRead } from "wagmi";

const useContractOwner = () => {
  // Check if sale is open
  const { data: owner } = useContractRead({
    address: `${process.env.NEXT_PUBLIC_CONTRACT_ID}` as `0x${string}`,
    abi: nfTixBooth,
    functionName: "owner",
  });
  return owner ? (owner as unknown as `0x${string}`) : false;
};

export default useContractOwner;
