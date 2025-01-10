import { Secret } from "@/types/github";
import { Edit2, Save, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SecretsListProps = {
  secrets: Secret[];
  isEditing: boolean;
  loading: boolean;
  onEdit: () => void;
  onSave: () => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, field: "name" | "value", value: string) => void;
  onCancelEdit: () => void;
};

const SecretsList = ({
  secrets,
  isEditing,
  loading,
  onEdit,
  onSave,
  onAdd,
  onDelete,
  onUpdate,
  onCancelEdit
}: SecretsListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Secrets</h2>
        {!isEditing ? (
          <Button
            onClick={onEdit}
            variant="outline"
          >
            <Edit2 />
            <span>Edit</span>
          </Button>
        ) : (
          <Button
            onClick={onCancelEdit}
            variant="outline"
          >
            <X />
            <span>Exit Edit</span>
          </Button>
        )}
      </div>

      {secrets.length === 0 && !isEditing && (
        <div className="text-center py-8 text-gray-500">
          No secrets found. Click Edit to add new secrets.
        </div>
      )}

      <div className="space-y-3">
        {secrets.map((secret, secretIndex) => (
          <div key={secret.id} className="flex items-end gap-2">
            <div className="flex-1">
              {isEditing && (
                <Label htmlFor={`name-${secretIndex}`} className="text-xs">NAME</Label>
                )}
              <Input
                id={`name-${secretIndex}`}
                type="text"
                value={secret.name}
                onChange={(e) => onUpdate(secret.id, "name", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            {isEditing && (
              <>
                <div className="flex-1 relative">
                  <Label htmlFor={`value-${secretIndex}`} className="text-xs">VALUE</Label>
                  <Input
                    id={`value-${secretIndex}`}
                    type="password"
                    value={secret.value}
                    onChange={(e) => onUpdate(secret.id, "value", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <Button
                  onClick={() => onDelete(secret.id)}
                  size={"icon"}
                  variant={"destructive"}
                >
                  <Trash2 />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={onAdd}
              variant="outline"
            >
              <Plus />
              <span>Add</span>
            </Button>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={onSave}
              disabled={loading}
            >
              <Save />
              <span>Save</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
SecretsList.displayName = "SecretsList";

export { SecretsList, type SecretsListProps };
