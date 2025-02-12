// components/modals/ModalTwo.js
import React from "react";

export  function Success() {
  return (
    <div className="text-center">
      <h2 className="text-xl font-bold text-green-600">Success!</h2>
      <p className="text-gray-600 mt-2">Your action was completed successfully.</p>
      <div className="mt-4">
        <span className="text-4xl">✅</span>
      </div>
    </div>
  );
}
