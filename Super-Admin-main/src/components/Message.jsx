import React from "react";

import { Alert } from "flowbite-react";
//
function Message({ color = "failure", children }) {
  return <Alert color={color}>{children}</Alert>;
}

export default Message;
