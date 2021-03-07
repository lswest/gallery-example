import React from "react"

const Button = ({ status, action, name }) => (
  <button
    type="button"
    className={
      status === "active"
        ? "my-1 mx-2 capitalize bg-gray-400 text-black py-2 px-4 border border-gray-300 rounded hover:bg-gray-400 hover:text-black hover:border-transparent"
        : "my-1 mx-2 capitalize bg-transparent text-black py-2 px-4 border border-gray-300 rounded hover:bg-gray-400 hover:text-black hover:border-transparent"
    }
    onClick={action}
  >
    {name}
  </button>
)

export default Button
