import CartList from './CartList/CartList';
import './Cart.scss';
import { useEffect, useState } from 'react';
import CartPayment from './CartPayment/CartPayment';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { faAppStoreIos } from '@fortawesome/free-brands-svg-icons';

function Cart() {
  const [cartListMockData, setCartListMockData] = useState([]);
  const [totalPayment, setTotalPayment] = useState(0);
  let { pk } = useParams();

  useEffect(() => {
    fetch('http://localhost:10010/cart/3', {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => {
        setCartListMockData(data.data);
      });
  }, []);

  // useEffect(() => {
  //   axios.get('http://localhost:10010/cart/3').then(data => {
  //     setCartListMockData(data.data);
  //   });
  // }, []);

  const increaseProductPriceAndAmount = e => {
    let copy = [...cartListMockData];
    console.log(e.target.id);
    copy[e.target.id].productAmount = copy[e.target.id].productAmount + 1;
    // copy[e.target.id].paymentAmount =
    //   copy[e.target.id].productAmount * copy[e.target.id].productPrice;
    return setCartListMockData(copy);
    console.log(cartListMockData);
  };

  // function patchAmountIncrease(e) {
  //   // let copy = [...cartListMockData];
  //   // copy[e.target.id].productAmount = copy[e.target.id].productAmount + 1;
  //   // setCartListMockData(copy);

  //   fetch('http://localhost:10010/cart', {
  //     method: 'PATCH',
  //     headers: { 'Content-type': 'application/json' },

  //     body: JSON.stringify({
  //       productId: cartListMockData[e.target.id].productId,
  //       productAmount: cartListMockData[e.target.id].productAmount,
  //     }),
  //   }).then(res => {
  //     return res.json();
  //   });
  // }

  function patchAmountIncrease(e) {
    // let copy = [...cartListMockData];
    // copy[e.target.id].productAmount = copy[e.target.id].productAmount + 1;
    // setCartListMockData(copy);
    try {
      axios.patch('http://localhost:10010/cart', {
        userId: cartListMockData[e.target.id].userId,
        productId: cartListMockData[e.target.id].productId,
        productAmount: cartListMockData[e.target.id].productAmount,
      });
      console.log(cartListMockData);
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else {
        console.log(`Error:${err.message}`);
      }
    }
  }

  function deleteCartListData(pk) {
    fetch('http://localhost:10010/cart/${pk}', {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(data => {
        setCartListMockData(data.data);
      });
  }

  const decreaseProductPriceAndAmount = e => {
    let copy = [...cartListMockData];
    copy[e.target.id].productAmount = copy[e.target.id].productAmount - 1;
    copy[e.target.id].paymentAmount =
      copy[e.target.id].productAmount * copy[e.target.id].productPrice;
    return setCartListMockData(copy);
  };

  const deleteCartList = e => {
    let copy = [...cartListMockData];
    copy.splice(e.target.id, 1);
    setCartListMockData(copy);
  };

  return (
    <div id="cart-wrapper">
      <p className="cart-title">장바구니</p>
      <section className="cart-container">
        <div className="cart-table">
          <div className="cart-head">
            <div className="cart-head-info">상품정보</div>
            <div className="cart-head-amount">수량</div>
            <div className="cart-head-price">가격</div>
          </div>
          {cartListMockData.map(cartData => {
            return (
              <CartList
                key={cartData.id}
                id={cartData.id}
                cartListData={cartData}
                deleteCartList={deleteCartList}
                patchAmountIncrease={patchAmountIncrease}
                increaseProductPriceAndAmount={increaseProductPriceAndAmount}
                // decreaseProductPriceAndAmount={decreaseProductPriceAndAmount}
              ></CartList>
            );
          })}
        </div>
        <CartPayment
          cartList={cartListMockData}
          totalPayment={totalPayment}
        ></CartPayment>
      </section>
    </div>
  );
}
export default Cart;
