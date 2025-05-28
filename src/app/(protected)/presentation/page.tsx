import { redirect } from "next/navigation";
import React from "react";

type Props = {};

const Page = (props: Props) => {
  redirect("/dahsboard");
};

export default Page;
