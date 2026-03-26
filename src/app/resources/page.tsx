import fs from "node:fs/promises";
import path from "node:path";
import SectionHeading from "@/components/ui/SectionHeading";
import { FiArrowUpRight, FiDownload } from "react-icons/fi";
import styles from "./resources.module.css";

type ResourceItem = {
  fileName: string;
  displayName: string;
  href: string;
};

function formatResourceName(fileName: string): string {
  const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "").trim();
  return nameWithoutExtension
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

async function getResources(): Promise<ResourceItem[]> {
  const resourcesDir = path.join(process.cwd(), "public", "resources");

  try {
    const files = await fs.readdir(resourcesDir);
    const supportedFiles = files.filter((file) => /\.(pdf|docx?|pptx?|xlsx?|csv|txt)$/i.test(file));

    const resources = await Promise.all(
      supportedFiles.map(async (fileName) => {
        const filePath = path.join(resourcesDir, fileName);
        await fs.stat(filePath);

        return {
          fileName,
          displayName: formatResourceName(fileName),
          href: `/resources/${encodeURIComponent(fileName)}`,
        };
      })
    );

    return resources.sort((a, b) => a.fileName.localeCompare(b.fileName));
  } catch {
    return [];
  }
}

export default async function ResourcesPage() {
  const resources = await getResources();

  return (
    <div className={styles.resourcesPage}>
      <div className={styles.resourcesContainer}>
        <SectionHeading
          title="Event"
          highlight="Resources"
          description="Browse and download official HackMol documents, campus guides, and participant references."
          className={styles.resourcesHeading}
        />

        {resources.length > 0 ? (
          <section className={styles.resourcesList} aria-label="Resources list">
            <div className={styles.listHead}>
              <span>Document</span>
              <span>Actions</span>
            </div>

            <div className={styles.listBody}>
              {resources.map((resource) => (
                <article className={styles.listRow} key={resource.fileName}>
                  <div className={styles.docCell}>
                    <h2 className={styles.resourceName}>{resource.displayName}</h2>
                  </div>

                  <div className={styles.resourceActions}>
                    <a className={styles.actionLink} href={resource.href} target="_blank" rel="noopener noreferrer">
                      <FiArrowUpRight className={styles.actionIcon} aria-hidden="true" />
                      Open
                    </a>
                    <a className={styles.actionLink} href={resource.href} download>
                      <FiDownload className={styles.actionIcon} aria-hidden="true" />
                      Download
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <div className={styles.emptyState}>No resources found in the public/resources folder yet.</div>
        )}
      </div>
    </div>
  );
}
