export interface Repository {
  full_name: string;
  name: string;
  owner: {
    login: string;
  };
}

export interface Organization {
  login: string;
  avatar_url: string;
}

export interface GitHubSecret {
  name: string;
  value?: string;
}

export interface Secret {
  id: string;
  name: string;
  value: string;
}

export interface PublicKey {
  key_id: string;
  key: string;
}

export type RepoType = "personal" | "organization";
