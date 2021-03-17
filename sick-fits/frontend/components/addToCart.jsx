import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { CURRENT_USER_QUERY } from './User';
import { useCart } from '../lib/cartState';

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART($id: ID!) {
    addToCart(productId: $id) {
      id
    }
  }
`;

const AddToCart = ({ id }) => {
  const [addToCart, { error, loading }] = useMutation(ADD_TO_CART_MUTATION, {
    variables: { id },
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  const { openCart } = useCart();
  const addItem = async () => {
    await addToCart();
    openCart();
  };

  return (
    <button disabled={loading} type="button" onClick={addItem}>
      Add{loading ? 'ing' : null} to cart
    </button>
  );
};

export default AddToCart;
