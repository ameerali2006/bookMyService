import {
  GoogleOAuthProvider,
  GoogleLogin,
  type CredentialResponse,
 
} from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "@/redux/slice/userTokenSlice";
import { authService } from "@/api/AuthService";
import { ENV } from "@/config/env/env";

const clientId = ENV.VITE_GOOGLE_CLIENT_ID;
console.log("Google Client ID:", clientId);
  
interface GoogleLoginComponentProps {
  userType: "worker" | "user"; 
  onGoogleSuccess?: () => void;
}
const GoogleLoginComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("Google credential is missing");
      }
      const token: string = credentialResponse.credential;

      const response = await authService.googleLogin(token);

      if (response.data.success) {
        dispatch(addUser(response.data.user));
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Login Failed")}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginComponent;
