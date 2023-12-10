import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'
//A custom decorator that checks that the array is not empty
export function IsNotEmptyArray(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isNotEmptyArray',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return Array.isArray(value) && value.length > 0
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must not be an empty array`
        },
      },
    })
  }
}
