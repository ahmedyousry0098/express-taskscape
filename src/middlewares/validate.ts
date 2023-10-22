import { NextFunction, Request, Response } from 'express';
import joi, { ObjectSchema, ValidationResult } from 'joi';
import { ResponseError } from '../utils/errHandling';

export const validate = (schema: ObjectSchema) => {
	return (req: Request, res: Response, next: NextFunction) => {
		let requestKeys = { ...req.body, ...req.params, ...req.query };
		if (req.file || req.files) {
			requestKeys.file = req.file || req.files;
		}
		const result: ValidationResult = schema.validate(requestKeys, {
			abortEarly: false,
		});
		let messages: string[] = [];
		console.log(requestKeys);
		if (result.error?.details) {
			for (let err of result.error.details) {
				messages.push(err.message);
			}
			return res
				.status(400)
				.json({ message: 'validation error', details: messages });
		}
		console.log('ok');
		next();
	};
};
