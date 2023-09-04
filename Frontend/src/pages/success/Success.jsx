import React from 'react'
import { Link } from 'react-router-dom'

const Success = () => { 
	// const { cart } = useSelector((state) => ({
    //     cart: state.cart.cart
    // }));

	// console.log(location.search);

	// const parsed = queryString.parse(location.search);
	// console.log(parsed);

	// const orderDetails = {
	// 	cart: cart,
	// 	// totalAmount: totalAmount,
	// 	// shippingAddress: shipingAddress
	// }
  return (
	<div className="container text-center">
	  <h1 className="mt-5">Your order has been placed successfully! Thank you for shopping with us!</h1>
	  <Link to={'/'}><button className="btn btn-primary mt-5" type='button'>Continue shopping with us</button></Link>
	</div>
  )
}

export default Success
