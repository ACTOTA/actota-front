import { Switch } from "@headlessui/react";
import React from "react";

const Toggle = ({
  enabled,
  setEnabled,
}: {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}) => {
  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`group relative flex h-7 w-14 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white ${
        enabled ? "bg-[#215CBA]" : "bg-primary-gray"
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block size-5 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out ${
          enabled ? "translate-x-7" : "translate-x-0"
        }`}
      />
    </Switch>
  );
};

export default Toggle;
