import {IconType} from "react-icons";

interface AuthSocialButtonProps {
  icon: IconType;
  onClick: () => void;
}

const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({icon: Icon, onClick}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex justify-center w-full px-4 py-4 border-[2px] rounded-md shadow-sm bg-light_shadow text-dark hover:bg-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 border-light"
    >
      <Icon />
    </button>
  );
};

export default AuthSocialButton;
