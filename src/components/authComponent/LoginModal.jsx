"use client";

import Login from "./Login";

export default function LoginModal({ open, onClose }) {
  // This is a simple client wrapper that forwards props to the Login component.
  // Parent controls `open` state and `onClose` handler.
  return <Login open={open} onClose={onClose} />;
}
