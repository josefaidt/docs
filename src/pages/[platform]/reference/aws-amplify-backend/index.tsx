import type { JSONOutput } from 'typedoc';
import type { FC } from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { Layout } from '@/components/Layout';
import { getCustomStaticPath } from '@/utils/getCustomStaticPath';
import api from './api.json';

export const meta = {
  title: api.packageName,
  description: `Reference for ${api.packageName}`,
  platforms: [
    'android',
    'angular',
    'flutter',
    'javascript',
    'nextjs',
    'react',
    'react-native',
    'swift',
    'vue'
  ]
};

type BackendApiReferencePageProps = {
  api: JSONOutput.ProjectReflection;
};

export const BackendApiReferencePage: FC<BackendApiReferencePageProps> = ({
  api
}) => {
  return (
    <Layout
      showLastUpdatedDate={true}
      pageTitle="@aws-amplify/backend"
      pageDescription="API reference for the @aws-amplify/backend package"
    >
      <pre>
        <code>{JSON.stringify(api)}</code>
      </pre>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return getCustomStaticPath(meta.platforms);
};

export const getStaticProps: GetStaticProps<
  BackendApiReferencePageProps
> = () => {
  return {
    props: {
      // @ts-expect-error casting unknown json structure to appease prop types
      api: api as JSONOutput.ProjectReflection
    }
  };
};
