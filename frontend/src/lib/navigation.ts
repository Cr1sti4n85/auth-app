import { NavigateFunction } from "react-router";

//this navigate fn is assigned in order to use it outside react components
export let navigate: NavigateFunction = () => {};

export const setNavigate = (fn: NavigateFunction) => {
  navigate = fn;
};
