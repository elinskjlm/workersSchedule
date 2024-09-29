const BaseJoi =  require('joi');
const sanitizeHTML = require('sanitize-html');

const extention = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTNL': '{{#label}} must not include HTML'
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
        }
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
    year:           Joi.number().required().min(2020).max(2120),
    weekNum:        Joi.number().required().min(1).max(53),
    name:           Joi.string().alphanum().required().min(2).max(30),
    schedule:       Joi.object({
        day1: daySchema,
        day2: daySchema,
        day3: daySchema,
        day4: daySchema,
        day5: daySchema,
        day6: daySchema,
        day7: daySchema,
    }),
    comment:        Joi.string().alphanum().allow(null, '').max(250),
    isProper:       Joi.boolean().required().default(true),
    isSeen:         Joi.boolean().required().default(false),
    isOpen:         Joi.boolean().required().default(true),
}).required()

module.exports.formSchema = Joi.object({
    timeCreated:    Joi.date().default(Date.now).required(),
    year:           Joi.number().required().min(2020).max(2120),
    weekNum:        Joi.number().required().min(1).max(53),
    isLive:         Joi.boolean().required().default(false),
}).required()

module.exports.userSchema = Joi.object({
    name:           Joi.string().alphanum().required().min(2).max(30),
    username:       Joi.string().alphanum().required().min(3).max(10),
    password:       Joi.string()
                       .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')).required(),
    roll:           Joi.string().valid('inspector', 'dev', 'organizer').required().default('inspector'),
    created:        Joi.date().default(Date.now), // TODO ??
    lastSeen:       Joi.date().default(Date.now),
    lastModified:   Joi.date().default(Date.now),
})
