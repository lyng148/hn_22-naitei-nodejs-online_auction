const Title = ({ level = 6, children, className }) => {
  const Heading = `h${level}`;
  const classes = `$${
    level === 1
      ? "text-[45px] font-[700]"
      : level === 2
        ? "text-[40px] font-[700]"
        : level === 3
          ? "text-[35px] font-[700]"
          : level === 4
            ? "text-[30px] font-[600]"
            : level === 5
              ? "text-[25px] font-[600]"
              : "text-[18px] font-[500]"
  }`;

  return <Heading className={`${className} ${classes}`}>{children}</Heading>;
};

export default Title;