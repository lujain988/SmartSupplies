import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAv5vCoLdqubm_IJAOjNlgF7o9zo-1-VfE",
  authDomain: "login-3e8e4.firebaseapp.com",
  projectId: "login-3e8e4",
  storageBucket: "login-3e8e4.appspot.com",
  messagingSenderId: "251369161445",
  appId: "1:251369161445:web:ef0c157a6b0cdcdb1a0a0c",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "en";
const provider = new GoogleAuthProvider();

const googleLogin = document.getElementById("google-login-btn");
if (googleLogin) {
    googleLogin.addEventListener("click", async function () {
      debugger;
      event.preventDefault();
      try {
        console.log("Button clicked, attempting login...");
        const result = await signInWithPopup(auth, provider);
  
        const user = result.user;
        console.log("User:", user);
        let dbuser = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
        }
        
        let response = await fetch(`https://localhost:44381/api/User/Google`, {
          method: "POST",
          body: JSON.stringify(dbuser),
          headers: {"Content-Type": "application/json"}
        });
        if (response.status === 200) {
          const data = await response.json();
          console.log("Login Data:", data);
    
          const userId = data.userID; // Extract userId here
          localStorage.setItem('jwtToken', data.token);
          localStorage.setItem('UserId', userId);
    
          // Fetch the cart from the server using the user's ID
          const cartUrl = `https://localhost:44381/api/Cart/getallitems/${userId}`;
          const serverCartResponse = await fetch(cartUrl);
    
          let serverCart = [];
          if (serverCartResponse.ok) {
            serverCart = await serverCartResponse.json();
            console.log("Server Cart:", serverCart);
          } else {
            const errorText = await serverCartResponse.text();
            console.error("Failed to fetch server cart:", errorText);
            message.innerHTML = "<p style='color:red;'>Failed to fetch server cart</p>";
            return; // Exit if the cart fetch fails
          }
    
          const localCart = JSON.parse(localStorage.getItem("cart")) || [];
          console.log("Local Cart:", localCart);
    
          if (localCart.length > 0) {
            const mergedCart = mergeCarts(localCart, serverCart);
            console.log("Merged Cart:", mergedCart);
    
            const updateCartUrl = "https://localhost:44381/api/Cart/cartitem/updateMulti";
            const cartRequest = mergedCart.map(item => ({
              userId: userId,
              productId: item.productId,
              quantity: item.quantity,
            }));
    
            const updateResponse = await fetch(updateCartUrl, {
              method: "PUT",
              body: JSON.stringify(cartRequest),
              headers: {
                "Content-Type": "application/json",
              },
            });
    
            if (!updateResponse.ok) {
              const errorMessage = await updateResponse.text();
              console.error("Cart update failed:", errorMessage);
              message.innerHTML = "<p style='color:red;'>Cart update failed</p>";
            } else {
              const updateResult = await updateResponse.json();
              console.log("Cart update result:", updateResult);
            }
    
            // Optionally, clear the cart from localStorage after syncing with the server
            localStorage.removeItem("cart");
          }
    
          
          if (data.userRole === "User") {
    
            window.history.back();
          } else if (data.userRole === "Admin") { 
    
            window.location.href = "Admin/index1.html";
          }
        } else {
          const errorText = await response.text();
          console.error("Login failed:", errorText);
          message.innerHTML = "<p style='color:red;'>Login failed</p>";
        }
        
      } catch (error) {
        console.error("Error during login:", error);
        alert("Error during login. Please try again.");
      }
      console.log("User Role:", data.userRole);
    });
} else {
    console.error("Login button not found");
}

