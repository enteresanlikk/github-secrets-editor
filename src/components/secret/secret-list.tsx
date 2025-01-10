import { Secret } from "@/types/github";
import { Edit2, Save, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SecretItem } from "@/components/secret/secret-item";

type SecretListProps = {
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

const SecretList = ({
  secrets,
  isEditing,
  loading,
  onEdit,
  onSave,
  onAdd,
  onDelete,
  onUpdate,
  onCancelEdit
}: SecretListProps) => {
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
            Edit
          </Button>
        ) : (
          <Button
            onClick={onCancelEdit}
            variant="outline"
          >
            <X />
            Exit Edit
          </Button>
        )}
      </div>

      {secrets.length === 0 && !isEditing && (
        <div className="text-center py-8 text-gray-500">
          No secrets found. Click Edit to add new secrets.
        </div>
      )}

      <div className="space-y-2">
        {secrets.map((secret, index) => (
          <div key={index}>
            <SecretItem
              key={secret.id}
              secret={secret}
              index={index}
              isEditing={isEditing}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
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
              Add
            </Button>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={onSave}
              disabled={loading}
            >
              <Save />
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

SecretList.displayName = "SecretList";

export { SecretList, type SecretListProps };
