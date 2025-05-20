export interface IntegrationProvider {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const integrationProviders: IntegrationProvider[] = [
  {
    id: "adobe",
    name: "Adobe Creative Cloud",
    icon: "ri-adobe-line",
    description: "Connect with Adobe Creative Cloud apps like Photoshop, Illustrator, and more."
  },
  {
    id: "figma",
    name: "Figma",
    icon: "ri-figma-line",
    description: "Design, prototype, and collaborate with Figma integration."
  },
  {
    id: "sketch",
    name: "Sketch",
    icon: "ri-pencil-ruler-2-line",
    description: "Seamlessly connect with your Sketch design files."
  },
  {
    id: "dropbox",
    name: "Dropbox",
    icon: "ri-dropbox-line",
    description: "Store and manage your creative files with Dropbox."
  },
  {
    id: "google-drive",
    name: "Google Drive",
    icon: "ri-google-drive-line",
    description: "Access and manage your files from Google Drive."
  },
  {
    id: "slack",
    name: "Slack",
    icon: "ri-slack-line", 
    description: "Get notifications and share updates via Slack."
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "ri-instagram-line",
    description: "Post and schedule content directly to Instagram."
  },
  {
    id: "asana",
    name: "Asana",
    icon: "ri-task-line",
    description: "Track project tasks and manage creative workflows."
  },
  {
    id: "trello",
    name: "Trello",
    icon: "ri-trello-line",
    description: "Organize creative projects with Trello boards and cards."
  }
];
