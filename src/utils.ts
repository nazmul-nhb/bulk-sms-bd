import { isNonEmptyString, isObjectWithKeys } from 'toolbox-x/guards';
import type { Message } from './types';

/**
 * * Check if a value is a {@link Message} object
 * @param value - Value to check
 * @returns `true` if the value is a {@link Message} object, `false` otherwise
 */
export function isMessage(value: unknown): value is Message {
	return (
		isObjectWithKeys(value, ['to', 'message']) &&
		isNonEmptyString(value.to) &&
		isNonEmptyString(value.message)
	);
}
