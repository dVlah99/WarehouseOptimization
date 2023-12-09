import { ValidationOptions, registerDecorator, ValidationArguments } from 'class-validator'

export function IsNotNullOrUndefinedOrEmptyObject(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isNotNullOrUndefinedOrEmptyObject',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (value === null || value === undefined || (typeof value === 'object' && Object.keys(value).length === 0)) {
            return false
          }
          return true
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must not be null, undefined, or an empty object`
        },
      },
    })
  }
}
