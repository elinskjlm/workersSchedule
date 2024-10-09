const BaseJoi =  require('joi');
const sanitizeHTML = require('sanitize-html');
const { hebMessages } = require('./utils/joiMessages');

const extention = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML':    '{{#label}} לא יכול להכיל HTML',
        'string.hebAlphanum':   '{{#label}} יכול להכיל רק אותיות בעברית או אנגלית, ומספרים',
        'string.password':      '{{#label}} חייב להיות באורך מינימלי של 8 תווים, וחייב לכלול שילוב של אותיות גדולות וקטנות באנגלית, ומספרים',
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value });
                return clean
            }
        },
        hebAlphanum: {
            validate(value, helpers) {
                if (/^[א-תa-zA-Z0-9\s]+$/.test(value)) {
                    return value;
                }
                return helpers.error('string.hebAlphanum');
            }
        },
        password: {
            validate(value, helpers) {
                if (/^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$/.test(value)) {
                    return value;
                }
                return helpers.error('string.password');
            }
        },
    }
})

Joi = BaseJoi.extend(extention);

const daySchema = Joi.object({
    morning: Joi.object({
        reg: Joi.boolean().required().default(false),
        ot1: Joi.alternatives().conditional('reg', {
            is: false, then: Joi.boolean().invalid(true), otherwise: Joi.boolean()
        }).required(),
    }).required(),
    noon: Joi.object({
        reg: Joi.boolean().required().default(false),
    }).required(),
    night: Joi.object({
        reg: Joi.boolean().required().default(false),
        ot1: Joi.alternatives().conditional('reg', {
            is: false, then: Joi.boolean().invalid(true), otherwise: Joi.boolean()
        }).required(),
        ot2: Joi.alternatives().conditional('reg', {
            is: false, then: Joi.boolean().invalid(true), otherwise: Joi.boolean()
        }).required(),
    }).required(),
}).required()


module.exports.scheduleSchema = Joi.object({
    timeSubmitted:  Joi.date().required().default(Date.now),
    year:           Joi.number().required().min(2020).max(2120).messages(hebMessages),
    weekNum:        Joi.number().required().min(1).max(53).messages(hebMessages),
    name:           Joi.string().escapeHTML().hebAlphanum().required().min(2).max(30).messages(hebMessages),
    schedule:       Joi.object({
        day1: daySchema,
        day2: daySchema,
        day3: daySchema,
        day4: daySchema,
        day5: daySchema,
        day6: daySchema,
        day7: daySchema,
    }),
    comment:        Joi.string().escapeHTML().hebAlphanum().messages(hebMessages).allow(null, '').max(250),
    isProper:       Joi.boolean().default(true),
    isSeen:         Joi.boolean().default(false),
    isOpen:         Joi.boolean().default(true),
}).required()

module.exports.formSchema = Joi.object({
    timeCreated:    Joi.date().default(Date.now).required(),
    year:           Joi.number().required().min(2020).max(2120),
    weekNum:        Joi.number().required().min(1).max(53),
    isLive:         Joi.boolean().required().default(false),
}).required()

module.exports.userSchema = Joi.object({
    name:           Joi.string().hebAlphanum().required().min(2).max(30).messages(hebMessages).escapeHTML(),
    username:       Joi.string().hebAlphanum().required().min(3).max(10).messages(hebMessages).escapeHTML(),
    password:       Joi.string().password().required().messages(hebMessages).escapeHTML(),
    role:           Joi.string().valid('inspector', 'dev', 'organizer').required().default('inspector'),
    created:        Joi.date().default(Date.now), // TODO ??
    lastSeen:       Joi.date().default(Date.now),
    lastModified:   Joi.date().default(Date.now),
})
