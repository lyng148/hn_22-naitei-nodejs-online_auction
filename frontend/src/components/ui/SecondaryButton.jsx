const SecondaryButton = ({ children, className, disabled, onClick, onMouseEnter, onMouseLeave, type = "button" }) => (
  <button
    type={type}
    className={`${className} text-gray-700 bg-white border border-gray-300 font-medium rounded-lg text-sm px-4 py-2 hover:bg-gray-50 transition ease-in-out`}
    disabled={disabled}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {children}
  </button>
);

export default SecondaryButton;
