import Joi from "joi";
export const signupSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            "string.empty": "Name is required",
            "string.min": "Name must be at least 3 characters",
            "string.max": "Name must be at most 50 characters",
        }),
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .messages({
            "string.empty": "Username is required",
            "string.alphanum": "Username must only contain letters and numbers",
            "string.min": "Username must be at least 3 characters",
            "string.max": "Username must be at most 30 characters",
        }),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Invalid email format",
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 6 characters",
        }),
    confirmPassword: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .messages({
            "any.only": "Passwords do not match",
            "any.required": "Confirm password is required",
        }),
});


export const Loginvalidation = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Invalid email format",
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 6 characters",
        }),
})