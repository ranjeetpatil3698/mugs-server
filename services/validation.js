var Joi = require('joi');
var emailregex = (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

module.exports = {
    login: {
        body: {
            email: Joi.string().email().regex(emailregex).required(),
            password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
        }
    },
    register: {
        body: {
            name: Joi.string().min(1).max(60).trim().required(), // string using string-based notation
            email: Joi.string().email().regex(emailregex).required(),
            password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
            mobile: Joi.number().required(),
            gender: Joi.string().required(),
            college: Joi.string().required(),
        }
    },
    token: {
        body: {
            token: Joi.string().required(),
        }
    },
    verifyotp: {
        body: {
            email: Joi.string().email().regex(emailregex).required(),
            otp: Joi.number().required(),
        }
    },
    grievance: {
        body: {
            from: Joi.string().email().regex(emailregex).required(),
            degree: Joi.string().min(1).max(60).trim().required(),
            discipline: Joi.string().min(1).max(60).trim().required(),
            cgpa: Joi.number().required(),
            startDate: Joi.number().required(),
            endDate: Joi.number().required(),
            summary: Joi.string().optional(),
        }
    },
    profileRecruiter: {
        body: {
            name: Joi.string().min(1).max(60).trim().required(),
            about: Joi.string().min(1).max(60).trim().required(),
            address: Joi.string().min(1).max(60).trim().required(),
            city: Joi.string().min(1).max(60).trim().required(),
            organizationType: Joi.string().min(1).max(60).trim().required(),
            industry: Joi.string().min(1).max(60).trim().required(),
            numberOfEmployees: Joi.string().required(),
            yearOfIncorporation: Joi.number().required(),
            url: {
                linkdedIn: Joi.string().optional()
            }
        }
    },
    postInternship: {
        body: {
            title: Joi.string().min(1).max(60).trim().required(),
            description: Joi.string().min(1).max(60).trim().required(),
            stipend: Joi.number().required(),
            city: Joi.string().min(1).max(60).trim().required(),
            startDate: Joi.number().required(),
            deadlineToApplyDate: Joi.number().required(),
            openings: Joi.number().required(),
            duration: Joi.number().required()
        }
    },
    applyForInternship: {
        body: {
            internship_id: Joi.string().required()
        }
    },
    application: {
        body: {
            internship_id: Joi.string().required(),
            student_id: Joi.string().required()
        }
    }
};