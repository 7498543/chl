import { SITE_NAME } from "@/lib/constants";

interface SeoProps {
  title?: string;
  description?: string;
}

export default function Seo({ title, description }: SeoProps) {
  const pageTitle = title ? `${title} - ${SITE_NAME}` : SITE_NAME;

  return (
    <>
      <title>{pageTitle}</title>
      {description && <meta name="description" content={description} />}
    </>
  );
}
