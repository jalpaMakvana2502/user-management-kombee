import { Button, ButtonProps, CircularProgress } from '@mui/material';

interface ILoadingButtonProps {
   loading?: boolean;
}

const LoadingButton = (props: ButtonProps & ILoadingButtonProps) => {
   const { loading = false, children, disabled, ...buttonProps } = props;
   return (
      <Button {...buttonProps} disabled={disabled || loading}>
         {loading ? <CircularProgress size={24} /> : children}
      </Button>
   );
};

export default LoadingButton;
