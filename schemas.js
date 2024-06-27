const Joi = require('joi');

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
    name:           Joi.string().required().min(2).max(30),
    schedule:       Joi.object({
        day1: daySchema,
        day2: daySchema,
        day3: daySchema,
        day4: daySchema,
        day5: daySchema,
        day6: daySchema,
        day7: daySchema,
    }),
    comment:        Joi.string().allow(null, '').max(250),
    status:         Joi.any(), //TODO TEMP
    // toIgnore:       Joi.boolean().required().default(false),
    // wasSeen:        Joi.boolean().required().default(false),
    // isOpen:         Joi.boolean().required().default(true),
}).required()


