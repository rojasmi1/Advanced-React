import {
  CartItemCreateInput,
  OrderCreateInput,
} from '../.keystone/schema-types';
/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';

import stripeConfig from '../lib/stripe';

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
  const cartItems = user.cart.filter(cartItem => cartItem.product);
  const amount = cartItems.reduce((tally: number, cartItem: CartItemCreateInput) => {
    return tally + cartItem.quantity * cartItem.product.price
  }, 0);
  const charge = await stripeConfig.paymentIntents.create({
    amount,
    currency: 'USD',
    confirm: true,
    payment_method: token
  }).catch(err => {
    console.log(err);
    throw new Error(err.message);
  });
  
  const orderItems = cartItems.map(cartItem => {
    const orderItem = {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      photo: {
        connect: { id: cartItem.product.photo.id }
      }
    }
    return orderItem;
  });
  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId } }
    }
  });
  const cartItemIds = user.cart.map(cartItem => cartItem.id);
  await context.lists.CartItem.deleteMany({
    ids: cartItemIds
  });
  return order;
}
