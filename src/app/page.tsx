"use client";

import { useState } from "react";
import { Github, User, Building2 } from "lucide-react";
import { SecretList } from "@/components/secret/secret-list";
import { RepoType, Repository, Organization, Secret } from "@/types/github";
import { ApiError } from "@/types/api";
import { fetchOrganizationRepos, fetchOrganizations, fetchPersonalRepos, fetchSecrets, updateSecrets } from "@/services/github";
import { setGithubToken } from "@/lib/github";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/shadcn";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/common/loading";

export default function Home() {
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<string>("");
  const [repoType, setRepoType] = useState<RepoType>("personal");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [hasLoadedSecrets, setHasLoadedSecrets] = useState<boolean>(false);

  const handleError = (err: unknown) => {
    if (err instanceof Error) {
      setError(err.message);
    } else if (typeof err === 'object' && err !== null && 'message' in err) {
      setError((err as ApiError).message);
    } else {
      setError('An unexpected error occurred');
    }
    setLoading(false);
  };

  const handleTokenChange = async (newToken: string) => {
    setToken(newToken);
    setGithubToken(newToken);
    if (newToken) {
      try {
        setLoading(true);
        setError("");

        const [orgs, repos] = await Promise.all([
          fetchOrganizations(),
          fetchPersonalRepos()
        ]);

        setOrganizations(orgs);
        setRepositories(repos);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    } else {
      setSelectedRepo(null);
      setSelectedOrg("");
      setRepoType("personal");
      setOrganizations([]);
      setRepositories([]);
      setSecrets([]);
      setIsEditing(false);
      setHasLoadedSecrets(false);
    }
  };

  const handleRepoTypeChange = async (type: RepoType) => {
    setRepoType(type);
    setSelectedRepo(null);
    setSelectedOrg("");
    setSecrets([]);
    setIsEditing(false);
    setHasLoadedSecrets(false);

    if (token) {
      try {
        setLoading(true);
        setError("");

        if (type === "personal") {
          const repos = await fetchPersonalRepos();
          setRepositories(repos);
        } else {
          setRepositories([]);
        }
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOrganizationChange = async (orgName: string) => {
    setSelectedOrg(orgName);
    setSelectedRepo(null);
    setSecrets([]);
    setIsEditing(false);
    setHasLoadedSecrets(false);

    if (orgName) {
      try {
        setLoading(true);
        setError("");
        const repos = await fetchOrganizationRepos(orgName);
        setRepositories(repos);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    } else {
      setRepositories([]);
    }
  };

  const handleRepositoryChange = async (repo: Repository | null) => {
    setSelectedRepo(repo);
    setSecrets([]);
    setIsEditing(false);
    setHasLoadedSecrets(false);

    if (repo) {
      try {
        setLoading(true);
        setError("");
        const secrets = await fetchSecrets(repo.full_name);
        setSecrets(secrets);
        setHasLoadedSecrets(true);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateSecrets = async () => {
    if (!selectedRepo) return;

    try {
      setLoading(true);
      setError("");
      await updateSecrets(selectedRepo.full_name, secrets);
      const updatedSecrets = await fetchSecrets(selectedRepo.full_name);
      setSecrets(updatedSecrets);
      setIsEditing(false);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const addNewSecret = () => {
    const newId = Date.now().toString();
    setSecrets([...secrets, { id: newId, name: "", value: "" }]);
  };

  const deleteSecret = (id: string) => {
    setSecrets(secrets.filter(secret => secret.id !== id));
  };

  const updateSecret = (id: string, field: "name" | "value", newValue: string) => {
    setSecrets(secrets.map(secret =>
      secret.id === id ? { ...secret, [field]: newValue } : secret
    ));
  };

  const handleCancelEdit = async () => {
    if (selectedRepo) {
      setIsEditing(false);

      const updatedSecrets = await fetchSecrets(selectedRepo.full_name);
      setSecrets(updatedSecrets);
    }
  };

  const handleBulkAddSecrets = (newSecrets: Secret[]) => {
    const existingNames = new Set(secrets.map(s => s.name));
    const uniqueNewSecrets = newSecrets.filter(s => !existingNames.has(s.name));
    
    setSecrets([...secrets, ...uniqueNewSecrets]);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-2 mb-8">
          <Github />
          <h1 className="text-2xl font-bold">GitHub Secrets Editor</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border relative">
          {loading && (
            <div className="absolute z-50 inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
              <Loading />
            </div>
          )}
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium mb-2" htmlFor="github-token">GitHub Token</Label>
              <div className="flex space-x-2">
                <Input
                  id="github-token"
                  type="password"
                  defaultValue={token}
                  onChange={(e) => handleTokenChange(e.target.value)}
                  placeholder="Enter your GitHub token"
                  className="flex-1 px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {token && (
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleRepoTypeChange("personal")}
                    className={cn(`flex items-center space-x-2 px-4 py-2 border-b-2 border-transparent`, repoType === "personal" && "border-primary-foreground")}
                  >
                    <User />
                    Personal Repositories
                  </Button>
                  <Button
                    onClick={() => handleRepoTypeChange("organization")}
                    className={cn(`flex items-center space-x-2 px-4 py-2 border-b-2 border-transparent`, repoType === "organization" && "border-primary-foreground")}
                  >
                    <Building2 />
                    Organization Repositories
                  </Button>
                </div>

                {repoType === "organization" && (
                  <div>
                    <Label className="block text-sm font-medium mb-2">Select Organization</Label>
                    <div className="flex space-x-2">
                      <Select
                        onValueChange={(value) => handleOrganizationChange(value)}
                        defaultValue={selectedOrg}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an organization" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizations.map((org) => (
                            <SelectItem key={org.login} value={org.login}>
                              {org.login}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {repositories.length > 0 && (
                  <div>
                    <Label className="block text-sm font-medium mb-2">Select Repository</Label>
                    <div className="flex space-x-2">
                      <Select
                        onValueChange={(value) => {
                          const repo = repositories.find(r => r.full_name === value);
                          handleRepositoryChange(repo || null);
                        }}
                        defaultValue={selectedRepo?.full_name || ""}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a repository" />
                        </SelectTrigger>
                        <SelectContent>
                          {repositories.map((repo) => (
                            <SelectItem key={repo.full_name} value={repo.full_name}>
                              {repo.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {hasLoadedSecrets && selectedRepo && (
                  <SecretList
                    secrets={secrets}
                    isEditing={isEditing}
                    loading={loading}
                    onEdit={() => setIsEditing(true)}
                    onSave={handleUpdateSecrets}
                    onAdd={addNewSecret}
                    onDelete={deleteSecret}
                    onUpdate={updateSecret}
                    onCancelEdit={handleCancelEdit}
                    onBulkAdd={handleBulkAddSecrets}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 