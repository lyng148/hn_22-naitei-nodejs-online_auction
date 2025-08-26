export const PrimaryButton = ({ children, className, disabled, onClick, onMouseEnter, onMouseLeave }) => (
  <button
    type="submit"
    className={`${className} text-white bg-green font-medium rounded-full text-lg px-16 py-3 hover:bg-primary transition ease-in-out`}
    disabled={disabled}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {children}
  </button>
);

export default PrimaryButton;
