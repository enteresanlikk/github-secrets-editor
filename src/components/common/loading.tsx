import { Loader2 } from "lucide-react";
import { cn } from "@/utils/shadcn";

type LoadingProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: number;
}

const Loading = ({ className, size = 16, ...props }: LoadingProps) => {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <Loader2 className="animate-spin" size={size} />
    </div>
  );
};

Loading.displayName = "Loading";

export { Loading, type LoadingProps };
