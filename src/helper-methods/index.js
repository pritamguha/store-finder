import * as _deepClone from "clone-deep";
import { ToastsStore } from "react-toasts";

export const deepClone = data => {
    return _deepClone(data);
  };

  export const showToast = (message, type = "error", duration = 4000) => {
    ToastsStore[type](message, duration);
  };