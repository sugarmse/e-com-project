import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { decreaseQuantity, increaseQuantity, removeProduct } from '../../store/cartSlice';
import { createOrderApi } from '../../apis/Api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
    const { cart } = useSelector((state) => ({
        cart: state.cart.cart
    }))

    const navigate = useNavigate();

    const token = localStorage.getItem(('token'));
    useEffect(() => {
        if(!token) {
            return navigate('/');
        }
    })

    const [totalAmount , setTotalAmount] = useState(0);

    // calculate total amount
    const calculateTotalAmount = () => {
        let totalPrice = 0;
        cart.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
        })
        setTotalAmount(totalPrice);
    }

    // calculate total amount and update it when cart changes
    useEffect(() => {
        calculateTotalAmount();
    }, [cart]);
    
    const [shipingAddress, setShipingAddress] = useState('');


    const dispatch = useDispatch();

    const handleQuantityDecrease = (itemId) => {
        dispatch(decreaseQuantity({itemId}))
    };

    const handleQuantityIncrease = (itemId) => {
        dispatch(increaseQuantity({itemId}))
    };

    const handleRemoveProduct = (itemId) => {
        dispatch(removeProduct({itemId}))
    };

    //   -----------------------------
    // create orders
    const handleCreateOrder = async () => {
        if(!shipingAddress){
            alert('Please enter shiping address');
            return;
        }

        const orderDetails = {
            cart: cart,
            totalAmount: totalAmount,
            shippingAddress: shipingAddress
        }

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "key a6177cd297f34b7a8dbb69e0cd759c17");
        myHeaders.append("Content-Type", "application/json");

        // console.log(orderDetails);

        const raw = {
            "return_url": "http://localhost:3000/",
            "website_url": "http://localhost:3000/",
            "amount": orderDetails.totalAmount * 100,
            "purchase_order_id": "Order01",
            "modes":["KHALTI"],
            "purchase_order_name": "test",
            "customer_info": {
                "name": "Test Bahadur",
                "email": "test@khalti.com",
                "phone": "9800000001"
            }
        };

        const response = await axios.post('http://localhost:5000/khalti-api', raw);
        window.location.href = response.data.data.payment_url;
        
        createOrderApi(orderDetails).then((res) => {
            toast.success('Order created successfully');
        }).catch((err) => {
            toast.error('Something went wrong');
        })

    };

    return (
        <div className="container">
            <section className="h-100">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12">
                            <div className="card card-registration card-registration-2" style={{ borderRadius: '15px' }}>
                                <div className="card-body p-0">
                                    <div className="row g-0">
                                        <div className="col-lg-8">
                                            <div className="p-5">
                                                <h1 className="fw-bold mb-0 text-black">Shopping Cart</h1>
                                                <hr className="my-4" />

                                                {
                                                    cart.map((item, index) => (
                                                        <div className="row mb-4 d-flex justify-content-between align-items-center">
                                                            <div className="col-md-2 col-lg-2 col-xl-2">
                                                                <img
                                                                    src={item.image}
                                                                    className="img-fluid rounded-3" alt="Cotton T-shirt"
                                                                />
                                                            </div>
                                                            <div className="col-md-3 col-lg-3 col-xl-3">
                                                                <h6 className="text-muted">{item.category}</h6>
                                                                <h6 className="text-black mb-0">{item.name}</h6>
                                                            </div>
                                                            <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
                                                                <button className="btn btn-link px-2" onClick={() => handleQuantityDecrease(item.id)}>
                                                                    <i className="fas fa-minus"></i>
                                                                </button>

                                                                <input id="form1" min="0" name="quantity" value={item.quantity} type="number"
                                                                    className="form-control form-control-sm"
                                                                />

                                                                <button className="btn btn-link px-2" onClick={() => handleQuantityIncrease(item.id)}>
                                                                    <i className="fas fa-plus"></i>
                                                                </button>
                                                            </div>
                                                            <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                                                                <h6 className="mb-0">NPR. {item.price}</h6>
                                                            </div>
                                                            <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                                                                <button className="btn"><i className="fas fa-times" onClick={() => handleRemoveProduct(item.id)}></i></button>
                                                            </div>
                                                        </div>

                                                    ))

                                                }
                                                <hr className="my-4" />
                                            </div>
                                        </div>
                                        <div className="col-lg-4 bg-grey">
                                            <div className="p-5">
                                                <h3 className="fw-bold mb-5 mt-2 pt-1">Summary</h3>
                                                <h6 className="text-muted">Total quantity: {cart.length}</h6>
                                                <h6 className="text-muted">Total price:</h6>
                                                <h3 className="fw-bold">NPR. {totalAmount.toFixed(2)}</h3>
                                                <hr />
                                                <p htmlFor="">Shipping Address</p>
                                                <input type="text" className='form-control m-0 p-0' value={shipingAddress} onChange={(e) => setShipingAddress(e.target.value)} />

                                                <button className="btn btn-primary btn-lg btn-block mt-3" onClick={handleCreateOrder}>Pay with Khalti</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Cart
