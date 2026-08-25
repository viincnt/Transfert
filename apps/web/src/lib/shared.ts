export const appName = "Transfert";
export const docsRoute = "/docs";
export const docsImageRoute = "/og/docs";
export const docsContentRoute = "/llms.mdx/docs";

// Transfert is hosted on GitLab, not GitHub — used to build the "view
// source" / "edit this page" links on doc pages and the repo link in nav.
export const repo = {
  url: "https://gitlab.com/viincnt/transfert",
  branch: "dev",
};

export function docsSourceUrl(path: string) {
  return `${repo.url}/-/blob/${repo.branch}/apps/web/content/docs/${path}`;
}
