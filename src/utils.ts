import { isNonEmptyString, isObjectWithKeys } from 'toolbox-x/guards';
import { BulkSmsError } from './BulkSmsError';
import { ERROR_CODES } from './constants';
import type { ErrorCode, GenericResponse, Message, SuccessData } from './types';
/**
 * * Check if a value is a {@link Message} object
 * @param value - Value to check
 * @returns `true` if the value is a {@link Message} object, `false` otherwise
 *
 * @remarks
 * A message object should have `to` and `message` properties.
 *  - `to` should be a valid {@link isPhoneNumber | phone number}.
 *  - `message` should be a non-empty string.
 */
export function isMessage(value: unknown): value is Message {
	return (
		isObjectWithKeys(value, ['to', 'message']) &&
		isPhoneNumber(value.to) &&
		isNonEmptyString(value.message)
	);
}

/**
 * * Type guard to check if a value is a valid phone number.
 * @param value - The value to check.
 * @returns `true` if the value is a valid phone number, otherwise `false`.
 *
 * @remarks A phone number should be a non-empty string of length `4`-`17` digits,
 *          optionally prefixed with a single `+` sign.
 */
export function isPhoneNumber(value: unknown): value is string {
	return isNonEmptyString(value) && /^(?:\+[1-9]\d{3,16}|\d{4,17})$/.test(value);
}

/**
 * Throws {@link BulkSmsError} with error code `1003` for invalid phone and/or message arguments
 */
export function _throwValidationError(): never {
	throw new BulkSmsError(
		`Invalid arguments! Please provide valid phone number(s) and/or message(s)!`,
		1003
	);
}

/**
 * Throws {@link BulkSmsError} with error code and message
 * @param error - Original error from catch block
 * @param message - Fallback error message to throw
 * @param code - Error code to throw
 */
export function _throwCaughtError(error: unknown, message: string, code: ErrorCode): never {
	throw new BulkSmsError(
		error instanceof Error ? error.message : message,
		error instanceof BulkSmsError ? error.code : code
	);
}

/**
 * Throws {@link BulkSmsError} with error code and message
 * @param data - Response data from bulk SMS BD API
 *
 * @remarks
 * This function will throw an error if the `response_code` is not `202` (Accepted).
 */
export function _assertSuccessData<D extends GenericResponse>(
	data: D
): asserts data is SuccessData<D> {
	if (data?.response_code !== 202) {
		throw new BulkSmsError(
			ERROR_CODES[data?.response_code] || data?.error_message,
			data?.response_code
		);
	}
}
