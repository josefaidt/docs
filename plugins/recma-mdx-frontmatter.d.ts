import type { Plugin } from 'unified';
import type { Program } from 'estree';

export interface RecmaMdxFrontmatterPluginOptions {
  name?: string;
  /**
   * Path to pages directory
   * @default {"src/pages"}
   */
  pagesPath?: string;
}

export const recmaMdxFrontmatter: (
  options?: RecmaMdxFrontmatterPluginOptions
) => Plugin<[RecmaMdxFrontmatterPluginOptions], Program>;

export default recmaMdxFrontmatter;
