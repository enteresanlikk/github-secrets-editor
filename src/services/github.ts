import { Organization, Repository, Secret, GitHubSecret, PublicKey } from "@/types/github";
import githubApi from "@/lib/github";
import { encryptSecret } from "@/utils/encryption";

const fetchOrganizations = async (): Promise<Organization[]> => {
    const response = await githubApi.get("/user/orgs");
    return response.data;
}

const fetchPersonalRepos = async (): Promise<Repository[]> => {
    const response = await githubApi.get("/user/repos", {
        params: {
            affiliation: "owner",
            sort: "updated",
            per_page: 100
        }
    });
    return response.data;
}

const fetchOrganizationRepos = async (orgName: string): Promise<Repository[]> => {
    const response = await githubApi.get(`/orgs/${orgName}/repos`);
    return response.data;
}

const fetchSecrets = async (repoFullName: string): Promise<Secret[]> => {
    const response = await githubApi.get<{ secrets: GitHubSecret[] }>(
        `/repos/${repoFullName}/actions/secrets`
    );
    return response.data.secrets.map((secret) => ({
        id: secret.name,
        name: secret.name,
        value: secret.value || ""
    }));
}

const updateSecrets = async (repoFullName: string, secrets: Secret[]): Promise<void> => {
    const response = await githubApi.get<{ secrets: GitHubSecret[] }>(
        `/repos/${repoFullName}/actions/secrets`
    );

    const existingSecrets = new Set(response.data.secrets.map(s => s.name));
    const newSecrets = new Set(secrets.map(s => s.name));

    for (const existingName of existingSecrets) {
        if (!newSecrets.has(existingName)) {
            await githubApi.delete(
                `/repos/${repoFullName}/actions/secrets/${existingName}`
            );
        }
    }

    const keyResponse = await githubApi.get<PublicKey>(
        `/repos/${repoFullName}/actions/secrets/public-key`
    );

    for (const secret of secrets) {
        if (!secret.name.trim() || !secret.value.trim()) continue;

        const encryptedValue = encryptSecret(secret.value, keyResponse.data.key);

        await githubApi.put(
            `/repos/${repoFullName}/actions/secrets/${secret.name}`,
            {
                encrypted_value: encryptedValue,
                key_id: keyResponse.data.key_id,
            }
        );
    }
}

export {
    fetchOrganizations,
    fetchPersonalRepos,
    fetchOrganizationRepos,
    fetchSecrets,
    updateSecrets,
};