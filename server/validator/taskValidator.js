import Joi from 'joi';

export const schema = Joi.object({
  title: Joi.string().min(3).max(30).required(),

  description: Joi.string().trim().min(3).max(120).required(),

  status: Joi.string().valid('TODO', 'DONE').default('TODO'),

  deadline: Joi.date().required(),
});

export const statusSchema = Joi.object({
  status: Joi.string().valid('TODO', 'DONE').required(),
});

export const editSchema = Joi.object({
  title: Joi.string().min(3).max(30),
  description: Joi.string().min(3).max(120),
  deadline: Joi.date(),
})
  .min(1)
  .unknown(false);
