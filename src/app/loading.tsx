"use client";

import React from "react";
import { CircularProgress } from "@chakra-ui/react";

function Loading() {
  return (
    <CircularProgress
      capIsRound
      isIndeterminate
      color="green.300"
      size="120px"
    />
  );
}

export default Loading;
