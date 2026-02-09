// Grab the payment button from HTML
const payBtn = document.getElementById("payBtn");

if (!payBtn) {
  console.error("Pay button not found");
}

// Run this when user clicks "Get the Blueprint"
payBtn.addEventListener("click", async () => {
  
  // UI feedback so user knows something is happening
  payBtn.innerText = "Processing...";
  payBtn.disabled = true;
  
  try {
    /*
      STEP 1️⃣
      Ask backend for Razorpay PUBLIC KEY
      (Never expose key directly in frontend)
    */
    const keyRes = await fetch(
      "https://pdf-backend-1-g2p9.onrender.com/get-key"
    );
    const { key } = await keyRes.json();
    
    /*
      STEP 2️⃣
      Create a payment order from backend
      Razorpay requires an order_id before checkout opens
    */
    const orderRes = await fetch(
      "https://pdf-backend-1-g2p9.onrender.com/create-order",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 8 }) // ₹8 product
      }
    );
    
    const order = await orderRes.json();
    
    /*
      STEP 3️⃣
      Razorpay checkout configuration
    */
    const options = {
      key: key, // key received from backend
      amount: order.amount, // amount in paise
      currency: "INR",
      name: "Creator’s Blueprint",
      description: "One-time PDF download",
      order_id: order.id, // critical for payment verification
      
      /*
        STEP 4️⃣
        Runs AFTER successful payment
        We now VERIFY payment from backend
      */
      handler: async function(response) {
        
        const verifyRes = await fetch(
          "https://pdf-backend-1-g2p9.onrender.com/verify-payment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response) // send Razorpay response
          }
        );
        
        const result = await verifyRes.json();
        
        // If backend confirms payment is legit
        if (result.success) {
          // Redirect user to download page
          window.location.href = "access.html";
        } else {
          alert("Payment verification failed");
        }
      },
      
      // Checkout theme color
      theme: { color: "#60E9F9" }
    };
    
    /*
      STEP 5️⃣
      Open Razorpay payment modal
    */
    const rzp = new Razorpay(options);
    rzp.open();
    
  } catch (err) {
    // Any unexpected error
    alert("Something went wrong");
    console.error(err);
  } finally {
    // Reset button back to normal
    payBtn.innerText = "Get the Blueprint";
    payBtn.disabled = false;
  }
});

// Auto shine effect every 3 seconds
const shineBtn = document.getElementById("payBtn");

setInterval(() => {
  shineBtn.classList.remove("shine"); // reset animation
  void shineBtn.offsetWidth; // force reflow
  shineBtn.classList.add("shine"); // trigger shine
}, 3000);