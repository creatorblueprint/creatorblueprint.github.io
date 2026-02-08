const payBtn = document.getElementById("payBtn");

payBtn.addEventListener("click", async () => {
  payBtn.innerText = "Processing...";
  payBtn.disabled = true;
  
  try {
    // 1️⃣ Get Razorpay key
    const keyRes = await fetch("https://pdf-backend-1-g2p9.onrender.com/get-key");
    const { key } = await keyRes.json();
    
    // 2️⃣ Create order
    const orderRes = await fetch(
      "https://pdf-backend-1-g2p9.onrender.com/create-order",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 8 })
      }
    );
    
    const order = await orderRes.json();
    
    // 3️⃣ Razorpay Checkout
    const options = {
      key,
      amount: order.amount,
      currency: "INR",
      name: "Creator’s Blueprint",
      description: "One-time PDF download",
      order_id: order.id,
      
      handler: async function(response) {
        const verifyRes = await fetch(
          "https://pdf-backend-1-g2p9.onrender.com/verify-payment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response)
          }
        );
        
        const result = await verifyRes.json();
        
        if (result.success) {
          window.location.href = "access.html";
        } else {
          alert("Payment verification failed");
        }
      },
      
      theme: { color: "#60E9F9" }
    };
    
    const rzp = new Razorpay(options);
    rzp.open();
    
  } catch (err) {
    alert("Something went wrong");
    console.error(err);
  } finally {
    payBtn.innerText = "Get the Blueprint";
    payBtn.disabled = false;
  }
});