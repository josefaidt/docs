import type { GetStaticPathsResult } from 'next';

/**
 * Helper function to return list of paths to be statically generated.
 * Used inside "getStaticPaths"
 */
export const getCustomStaticPath = (
  platforms: string[]
): GetStaticPathsResult => {
  return {
    paths: platforms.map((platform) => ({ params: { platform } })),
    fallback: false
  };
};
