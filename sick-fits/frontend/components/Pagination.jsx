import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Link from 'next/link';
import Head from 'next/head';
import PaginationStyles from './styles/PaginationStyles';
import DisplayError from './DisplayError';
import { perPage } from '../config';

export const PAGINATION_QUERY = gql`
  query {
    _allProductsMeta {
      count
    }
  }
`;

const Pagination = ({ page }) => {
  const { error, loading, data } = useQuery(PAGINATION_QUERY);
  if (loading) return null;
  if (error) return <DisplayError error={error} />;
  const { count } = data._allProductsMeta;
  const pageCount = Math.ceil(count / perPage);
  return (
    <PaginationStyles>
      <Head>
        <title>
          Sick Fits - Page {page} of {pageCount}
        </title>
      </Head>
      <Link href={`/products/${page - 1}`}>
        <a aria-disabled={page === 1}>Prev</a>
      </Link>
      <p>
        Page {page} of {pageCount}
      </p>
      <p>{count} Items Total</p>
      <Link href={`/products/${page + 1}`}>
        <a aria-disabled={page === pageCount}>Next</a>
      </Link>
    </PaginationStyles>
  );
};

export default Pagination;
