import type { ErrorCode } from './types';

/**
 * @class `BulkSmsError`
 *
 * Custom error class for Bulk SMS BD API.
 *
 * @extends - Native {@link Error} class with custom `name` (`'BulkSmsError'`) and `code`.
 */
export class BulkSmsError extends Error {
	/**
	 * @param message Error message
	 * @param code Error code from `1001` to `1032`. Details: {@link https://bulksmsbd.net/developers Bulk SMS BD API Documentation}
	 */
	constructor(
		public message: string,
		public code: ErrorCode
	) {
		super(message);
		this.name = 'BulkSmsError';

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}
