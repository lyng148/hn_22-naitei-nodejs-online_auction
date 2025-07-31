const ProfileCard = ({ children, className }) => {
  return (
    <div
      className={`${className} w-12 h-12 bg-green_100 flex items-center justify-center rounded-full`}
    >
      {children}
    </div>
  );
};

export default ProfileCard;