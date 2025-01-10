export type Repository = {
  full_name: string;
  name: string;
  owner: {
    login: string;
  };
};

export type Organization = {
  login: string;
  avatar_url: string;
};

export type GitHubSecret = {
  name: string;
  value?: string;
};

export type Secret = {
  id: string;
  name: string;
  value: string;
};

export type PublicKey = {
  key_id: string;
  key: string;
};

export type RepoType = "personal" | "organization";
