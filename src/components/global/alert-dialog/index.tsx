import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Props = {
  children?: React.ReactNode;
  className?: string; // Bu satırı ekleyin
  description: string;
  loading?: boolean;
  onClick?: () => void;
  open: boolean;
  handleOpen: () => void;
};

const AlertDialogBox = ({
  children,
  className,
  description,
  loading = false,
  onClick,
  handleOpen,
  open,
}: Props) => {
  return (
    <AlertDialog open={open} onOpenChange={handleOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Emin misin ?</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          <Button
            variant={"destructive"}
            className={`${className}`}
            onClick={onClick}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Loading...
              </>
            ) : (
              "Onayla"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default AlertDialogBox;
