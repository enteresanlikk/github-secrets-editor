import { Secret } from "@/types/github";
import { Edit2, Save, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SecretItem } from "@/components/secret/secret-item";
import { Loading } from "@/components/common/loading";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
  onBulkAdd: (secrets: Secret[]) => void;
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
  onCancelEdit,
  onBulkAdd
}: SecretListProps) => {
  const handleEnvPaste = (content: string) => {
    const newSecrets: Secret[] = [];
    const lines = content.split('\n');

    lines.forEach(line => {
      if (!line.trim() || line.trim().startsWith('#')) return;

      const match = line.match(/^([^=]+)=(?:"([^"]*)"|(.*))$/);
      if (match) {
        const [, name, quotedValue, simpleValue] = match;
        const value = quotedValue || simpleValue;
        if (name && value) {
          newSecrets.push({
            id: Date.now().toString() + Math.random(),
            name: name.trim(),
            value: value.trim()
          });
        }
      }
    });

    if (newSecrets.length > 0) {
      onBulkAdd(newSecrets);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Secrets</h2>
        {!isEditing ? (
          <Button
            onClick={onEdit}
            variant="outline"
            disabled={loading}
          >
            <Edit2 />
            Edit
          </Button>
        ) : (
          <Button
            onClick={onCancelEdit}
            variant="outline"
            disabled={loading}
          >
            <X />
            Exit Edit
          </Button>
        )}
      </div>

      {isEditing && (
        <div className="space-y-2">
          <Label>Paste .env content</Label>
          <Textarea
            className="font-mono text-sm"
            onChange={(e) => handleEnvPaste(e.target.value)}
          />
        </div>
      )}

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
              disabled={loading}
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
