"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Login from "./Login";

export default function LoginWrapper() {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
    router.push("/");
  };

  return <Login open={open} onClose={handleClose} />;
}
