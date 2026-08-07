import ArticlePage, { generateMetadata, generateStaticParams } from "../../[categoria]/[slug]/page";

export const dynamicParams = true;
export const revalidate = 60;

export { generateMetadata, generateStaticParams };
export default ArticlePage;
