import { Secret } from "@/types/github";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SecretItemProps = {
    secret: Secret;
    index: number;
    isEditing: boolean;
    onDelete?: (id: string) => void;
    onUpdate?: (id: string, field: "name" | "value", value: string) => void;
};

const SecretItem = ({
    secret,
    index,
    isEditing,
    onDelete,
    onUpdate
}: SecretItemProps) => {
    if (isEditing) {
        return (
            <div className="flex items-end gap-2">
                <div className="flex-1">
                    <Label htmlFor={`name-${index}`} className="text-xs">NAME</Label>
                    <Input
                        id={`name-${index}`}
                        type="text"
                        defaultValue={secret.name}
                        onChange={(e) => onUpdate?.(secret.id, "name", e.target.value)}
                    />
                </div>
                <div className="flex-1 relative">
                    <Label htmlFor={`value-${index}`} className="text-xs">VALUE</Label>
                    <Input
                        id={`value-${index}`}
                        type="password"
                        defaultValue={secret.value}
                        onChange={(e) => onUpdate?.(secret.id, "value", e.target.value)}
                    />
                </div>
                <Button
                    onClick={() => onDelete?.(secret.id)}
                    size={"icon"}
                    variant={"destructive"}
                >
                    <Trash2 />
                </Button>
            </div>
        );
    }

    return (
        <div>
            <Input
                type="text"
                defaultValue={secret.name}
                readOnly
            />
        </div>
    );
};
SecretItem.displayName = "SecretItem";

export { SecretItem, type SecretItemProps }; 