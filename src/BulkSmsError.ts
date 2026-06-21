import type { ErrorCode } from './types';

export class BulkSmsError extends Error {
	constructor(
		public message: string,
		public code: ErrorCode = 400
	) {
		super(message);
		this.name = 'BulkSmsError';

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}
