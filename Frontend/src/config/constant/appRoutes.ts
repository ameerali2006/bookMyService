export const COMMON_API={
    GENERATE_OTP: "/generate-otp",
    VERIFY_OTP: "/verify-otp",
    REGISTER: "/register",
    LOGIN: "/login",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    LOGOUT: "/logout",
}as const


export const USER_API={
    ...COMMON_API,
    GOOGLE_LOGIN: "/google-auth",
    CLOUDINARY_SIGNATURE: "/cloudinary-signature",
    GET_SERVICE_NAMES: "/getserviceNames"

}as const


export const WORKER_API={
    ...COMMON_API,
    GOOGLE_LOGIN: "/google-login",
}

export const ADMIN_API={
    LOGIN: "/login",
    LOGOUT: "/logout",

}as const


