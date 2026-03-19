interface Props {
  classes?: string;
}

const LogoImage = ({ classes = "img-fluid" }: Props) => {
  return (
    <img
      src="/asset/local/img/penguin-inspection-logo-zip-file/logo-no-background.png"
      alt="Penguin Inspections Logo"
      className={classes}
    ></img>
  );
};

export default LogoImage;
