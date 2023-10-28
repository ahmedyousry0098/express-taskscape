import Joi from "joi";
import { CUSTOM_FIELDS_SCHEMAS } from "../../constants/schema_validation_fields";
import { ISprint } from "../../types/sprint.types";

interface ICreateSprintSchema extends ISprint {}

export const createSprintSchema = Joi.object<ICreateSprintSchema>({
    sprint_name: Joi.string().required(),
    start_date: Joi.date().greater(Date.now()),
    deadline: Joi.date().greater(Joi.ref('start_date')),
    project: CUSTOM_FIELDS_SCHEMAS.objectId.required(),
    organization: CUSTOM_FIELDS_SCHEMAS.objectId,
}).required()