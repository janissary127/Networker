document.addEventListener('DOMContentLoaded', () => {
    // 유저 아이디(이메일) 정보 가져오기
    let userEmail = '';
    const checkLoginStatus = () => {
        fetch('/board', {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    // 유저 이메일(아이디) 저장
                    userEmail = data.userEmail;
                }
            })
            .catch(error => console.error('Error:', error));
    };

    // 페이지 로드 시 로그인 상태 확인
    checkLoginStatus();

    // 로컬스토리지에서 cartItems 불러와서 주문상품 정보 추가
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const orderProductsContainer = document.querySelector('.order-products');
    let productsHTML = '';

    cartItems.forEach(item => {
        productsHTML += `
            <div class="product-info">
                <img src="${item.image}" alt="${item.name}" class="product-image">
                <div class="product-details">
                    <p>${item.name}</p>
                    <p>수량: ${item.count}개</p>
                    <p>${item.price*item.count}원</p>
                </div>
            </div>
        `;
    });

    orderProductsContainer.innerHTML = productsHTML;

    // 주문상품의 금액을 cartItems의 가격 정보를 바탕으로 계산
    const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.count), 0);
    const shippingFee = 4000; // 배송비
    const finalAmount = totalAmount + shippingFee;

    document.getElementById('total-amount').textContent = `${totalAmount} 원`;
    document.getElementById('shipping-fee').textContent = `+ ${shippingFee} 원`;
    document.getElementById('final-amount').textContent = `${finalAmount} 원`;


    // 결제하기 버튼 클릭 시 결제 정보 웹서버에 전달 -> 결제 모듈 연결 후 결제 성공 시 실행되도록 코드 수정 예정
    // 결제 실패시 fail.html 관련 js 파일에서 저장한 결제 정보 삭제하도록하는 코드 추가하기

    const orderForm = document.getElementById('order-form');
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // 주문자 정보
        const orderInfo = {
            orderId: crypto.randomUUID(),   // 주문 번호
            userId: userEmail,           // 유저 아이디(주문자 정보에 넣는 이메일과 다를 수 있음)
            orderName: document.getElementById('order-name').value,
            email: document.getElementById('email').value,
            mobile: document.getElementById('mobile-prefix').value+document.getElementById('mobile-middle').value+document.getElementById('mobile-last').value,
        };
        // 배송 정보
        const shippingInfo = {
            receiver: document.getElementById('receiver').value,
            postcode: document.getElementById('postcode').value,
            address: document.getElementById('address').value,
            addressDetail: document.getElementById('address-detail').value,
            mobile: document.getElementById('mobile-prefix2').value+document.getElementById('mobile-middle2').value+document.getElementById('mobile-last2').value,
        };
        // 결제 금액 정보
        const paymentInfo = {
            totalAmount: totalAmount,
            shippingFee: shippingFee,
            finalAmount: finalAmount
        };
        
        // 최종 결제 정보 데이터
        const orderData = {
            orderInfo: orderInfo,
            shippingInfo: shippingInfo,
            cartItems: cartItems,   // 주문한 상품 정보
            paymentInfo: paymentInfo
        };

        fetch('/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('결제를 진행합니다');
                // 로컬 스토리지 장바구니 데이터 삭제
                localStorage.removeItem('cartItems');
                // 결제 정보 저장 후 결제하기 페이지로 리다이렉션
                window.location.href = 'checkout.html';
            } else {
                alert('주문 정보 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('주문 정보 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        });
    });

});
