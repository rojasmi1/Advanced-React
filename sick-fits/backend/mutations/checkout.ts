/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import { OrderCreateInput } from '../.keystone/schema-types';

const graphql = String.raw;

export default async function checkout(
  root: never,
  { token }: { token: string },
  context: KeystoneContext
): Promise<OrderCreateInput> {
  const userId = context.session.itemId;
  if (!userId) {
    throw new Error('Must be signed to crear an Order');
  }

  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql`
    id
    name
    email
    cart {
      id 
      quantity 
      product {
        name 
        price
        description
        id
        photo {
          id 
          publicUrlTransformed
        }
      }
    }
    `
  })
  console.dir(user);
}
