import { sep, join } from 'node:path';
import { fromJs } from 'esast-util-from-js';
import { visit } from 'estree-util-visit';

/**
 * @typedef {Object} RecmaMdxFrontmatterPluginOptions
 * @property {string} [name='frontmatter'] - Name of the frontmatter variable
 */

/**
 * Extract route parameters from file path
 * @param {string} filePath - Path of the MDX file
 * @param {string} rootPath - Root path of the pages directory
 * @returns {Object.<string, unknown>} Map of parameter names to their default values
 */
function extractRouteParams(filePath, rootPath) {
  const params = {};
  const segments = filePath.replace(rootPath, '').split(sep);

  segments.forEach((segment) => {
    const match = segment.match(/\[([^\]]+)\]/);
    if (match) {
      if (segment.startsWith('[...')) {
        const paramName = match[1].replace('...', '');
        params[paramName] = [];
      } else if (segment.startsWith('[[...')) {
        const paramName = match[1].replace('...', '');
        params[paramName] = [];
      } else {
        params[match[1]] = null;
      }
    }
  });

  return params;
}

/**
 * Maps frontmatter properties to route parameters
 * @param {Object.<string, any>} frontmatter Frontmatter data
 * @param {Object.<string, unknown>} routeParams Route parameters
 * @returns {Record<string, unknown>} normalized parameters
 */
function normalizeParams(frontmatter, routeParams) {
  const normalizedParams = {};

  Object.keys(routeParams).forEach((param) => {
    const value = frontmatter[param];
    if (value === undefined) {
      throw new Error(
        `error parsing frontmatter properties and route params. Frontmatter property for param "${param}" not found.`
      );
    }
    if (Array.isArray(value)) {
      normalizedParams[param] = value;
    } else if (typeof value === 'string') {
      normalizedParams[param] = value.split('/');
    } else {
      normalizedParams[param] = [String(value)];
    }
  });

  return normalizedParams;
}

/**
 * Generate path parameters for Next.js getStaticPaths
 * @param {Object.<string, any>} frontmatter Frontmatter data
 * @param {Object.<string, unknown>} routeParams Route parameters
 * @returns {import("next").GetStaticPathsResult['paths']} Array of path parameters
 */
function generatePathParams(frontmatter, routeParams) {
  const normalizedParams = normalizeParams(frontmatter, routeParams);

  const keys = Object.keys(normalizedParams);
  const combinations = keys.reduce((acc, key) => {
    const values = normalizedParams[key];
    if (acc.length === 0) {
      return values.map((value) => ({ [key]: value }));
    }

    return acc.flatMap((combo) =>
      values.map((value) => ({
        ...combo,
        [key]: value
      }))
    );
  }, []);

  return combinations.map((params) => ({ params }));
}

/**
 * Plugin to add getStaticProps and getStaticPaths for MDX files with frontmatter
 * @param {RecmaMdxFrontmatterPluginOptions} [options]
 * @returns {import('unified').Plugin<[RecmaMdxFrontmatterPluginOptions], import('estree').Program>}
 */
export const recmaMdxFrontmatter = (options) => {
  const { name = 'frontmatter', pagesPath = 'src/pages' } = options || {};

  /**
   * @param {import('estree').Program} tree - AST tree
   * @param {import('vfile').VFile} vfile - Virtual file
   * @returns {void}
   */
  return (tree, vfile) => {
    /** @type {Record<string, unknown>} */
    const frontmatter = {};

    const filePath = vfile.path;
    const absolutePagesPath = join(
      process.cwd(),
      pagesPath.split('/').join(sep)
    );
    const routeParams = extractRouteParams(filePath, absolutePagesPath);

    visit(tree, (node) => {
      if (node.type === 'VariableDeclarator' && node.id.name === name) {
        if (!Array.isArray(node.init.properties)) return;
        for (const prop of node.init.properties) {
          // handle array values
          if ('elements' in prop.value) {
            frontmatter[prop.key.value] = prop.value.elements.map(
              (element) => element.value
            );
            continue;
          }
          // handle everything else
          frontmatter[prop.key.value] = prop.value.value;
        }
      }
    });

    const getStaticProps = fromJs(
      `
      export const getStaticProps = async ({ params }) => {
        return {
          props: {
            frontmatter: ${JSON.stringify(frontmatter)},
          }
        }
      }
      `,
      { module: true }
    );

    tree.body.push(...getStaticProps.body);

    if (Object.keys(routeParams).length > 0) {
      // try to map frontmatter keys to extracted route params
      const getStaticPaths = fromJs(
        `
        export const getStaticPaths = async () => {
          return {
            paths: ${JSON.stringify(generatePathParams(frontmatter, routeParams))},
            fallback: false,
          }
        }
        `,
        { module: true }
      );
      tree.body.push(...getStaticPaths.body);
    }
  };
};

export default recmaMdxFrontmatter;
