"use client";

import { Provider } from "react-redux";

import { store } from "./redux/store";

type AppProp = {
  children: React.ReactNode;
};

export default function App({ children }: AppProp) {
  return <Provider store={store}>{children}</Provider>;
}
