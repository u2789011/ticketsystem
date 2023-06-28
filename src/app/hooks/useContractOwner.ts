import React from "react";
import { nfTixBooth } from "../../../contracts/abis/nfTixBooth";
import { useAccount, useContractRead } from "wagmi";

const useContractOwner = () => {
  const { address } = useAccount();
  // Check connect account is contract owner or not
  const { data } = useContractRead({
    address: `${process.env.NEXT_PUBLIC_CONTRACT_ID}` as `0x${string}`,
    abi: nfTixBooth,
    functionName: "owner",
  });
  return data ? (data as unknown === address) : false;
};

export default useContractOwner;
