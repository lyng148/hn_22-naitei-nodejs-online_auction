const Caption = ({ children, className }) => (
  <p className={`${className} text-[15px] font-[500] text-gray_100`}>
    {children}
  </p>
);

export default Caption;